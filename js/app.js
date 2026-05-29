import {
  cargarOportunidades,
  contarConvocatoriasAbiertas,
  listarMunicipios,
  FECHA_REFERENCIA,
} from "./data.js";
import { buscarYFiltrar, renderLista } from "./search.js";
import { bootstrapMinimapa } from "./map.js";
import { initHeroSlider } from "./hero-slider.js";

const els = {
  lista: () => document.getElementById("lista-oportunidades"),
  meta: () => document.getElementById("results-meta"),
  empty: () => document.getElementById("empty-state"),
  search: () => document.getElementById("search-q"),
  tipo: () => document.getElementById("filter-tipo"),
  municipio: () => document.getElementById("filter-municipio"),
  chips: () => document.getElementById("municipio-chips"),
  heroCta: () => document.getElementById("hero-cta"),
  tabs: () => document.querySelectorAll('[role="tab"][data-tab]'),
};

/** @type {object[]} */
let todas = [];
/** @type {string} */
let tabActiva = "convocatorias";
/** @type {string} */
let municipioActivo = "";

/** @type {IntersectionObserver|null} */
let revealObserver = null;

async function main() {
  initHeroSlider();
  initRevealOnScroll();
  mostrarCargando();

  try {
    todas = await cargarOportunidades();
  } catch (err) {
    console.error(err);
    todas = [];
    mostrarEstadoVacio(
      "No se pudieron cargar los datos",
      "Revisa la conexión o vuelve a intentar. Los datos están en data/oportunidades.json."
    );
    buscarYFiltrar([], getFiltros());
    return;
  }

  if (todas.length === 0) {
    mostrarEstadoVacio(
      "Sin oportunidades verificadas",
      "No hay registros válidos en data/oportunidades.json."
    );
    buscarYFiltrar([], getFiltros());
    return;
  }

  ocultarEstadoVacio();
  poblarMunicipios(todas);
  enlazarFiltros();
  enlazarTabs();
  sincronizarFiltroTipo();
  await bootstrapMinimapa();
  render();
  observarReveal(document);
  requestAnimationFrame(() => {
    window.dispatchEvent(new Event("resize"));
  });

  const abiertas = contarConvocatoriasAbiertas(todas);
  if (todas.length < 20 || abiertas < 8) {
    console.warn(
      `Metas Fase 2: ${todas.length} ítems, ${abiertas} convocatorias abiertas (objetivo 20+ y 8+).`
    );
  }
}

function initRevealOnScroll() {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) {
    document.querySelectorAll(".reveal-on-scroll").forEach((el) => {
      el.classList.add("is-visible");
    });
    return;
  }

  revealObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-visible");
        revealObserver?.unobserve(entry.target);
      }
    },
    { threshold: 0.12, rootMargin: "0px 0px -32px 0px" }
  );
}

/**
 * @param {ParentNode} root
 */
function observarReveal(root) {
  if (!revealObserver) return;
  root.querySelectorAll(".reveal-on-scroll:not(.is-visible)").forEach((el) => {
    revealObserver.observe(el);
  });
}

function mostrarCargando() {
  const lista = els.lista();
  const meta = els.meta();
  if (lista) {
    lista.innerHTML = "";
    lista.classList.add("loading");
    lista.setAttribute("aria-busy", "true");
  }
  if (meta) meta.textContent = "Cargando oportunidades verificadas…";
}

/**
 * @param {object[]} items
 */
function poblarMunicipios(items) {
  const municipios = listarMunicipios(items);
  poblarSelectMunicipio(municipios, items.length);
  poblarChipsMunicipio(municipios, items.length);
}

/**
 * @param {{ nombre: string, count: number }[]} municipios
 * @param {number} total
 */
function poblarSelectMunicipio(municipios, total) {
  const select = els.municipio();
  if (!select) return;

  select.innerHTML = `<option value="">Todos (${total})</option>`;
  for (const { nombre, count } of municipios) {
    const opt = document.createElement("option");
    opt.value = nombre;
    opt.textContent = `${nombre} (${count})`;
    select.appendChild(opt);
  }
  select.value = municipioActivo;
}

/**
 * @param {{ nombre: string, count: number }[]} municipios
 * @param {number} total
 */
function poblarChipsMunicipio(municipios, total) {
  const container = els.chips();
  if (!container) return;

  const label = container.querySelector(".municipio-chips__label");
  container.innerHTML = "";
  if (label) container.appendChild(label);
  else {
    const p = document.createElement("p");
    p.className = "municipio-chips__label";
    p.textContent = "Municipio";
    container.appendChild(p);
  }

  container.appendChild(crearChipMunicipio("Todos", "", total, !municipioActivo));

  for (const { nombre, count } of municipios) {
    container.appendChild(
      crearChipMunicipio(nombre, nombre, count, municipioActivo === nombre)
    );
  }
}

/**
 * @param {string} label
 * @param {string} value
 * @param {number} count
 * @param {boolean} activo
 * @returns {HTMLButtonElement}
 */
function crearChipMunicipio(label, value, count, activo) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "chip-municipio";
  btn.dataset.municipio = value;
  btn.setAttribute("aria-pressed", activo ? "true" : "false");
  if (activo) btn.classList.add("is-active");
  btn.innerHTML = `${escapeHtml(label)} <span class="chip-municipio__count">${count}</span>`;
  btn.addEventListener("click", () => seleccionarMunicipio(value));
  return btn;
}

/**
 * @param {string} value
 */
function seleccionarMunicipio(value) {
  municipioActivo = value;
  const select = els.municipio();
  if (select) select.value = value;
  actualizarChipsUI();
  render();
}

function actualizarChipsUI() {
  const container = els.chips();
  if (!container) return;
  for (const btn of container.querySelectorAll(".chip-municipio")) {
    const activo = (btn.dataset.municipio || "") === municipioActivo;
    btn.classList.toggle("is-active", activo);
    btn.setAttribute("aria-pressed", activo ? "true" : "false");
  }
}

function enlazarFiltros() {
  const inputs = [els.search(), els.tipo(), els.municipio()].filter(Boolean);
  for (const input of inputs) {
    input.addEventListener("input", render);
    input.addEventListener("change", () => {
      if (input === els.municipio()) {
        municipioActivo = els.municipio()?.value ?? "";
        actualizarChipsUI();
      }
      render();
    });
  }

  els.heroCta()?.addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("oportunidades")?.scrollIntoView({ behavior: "smooth" });
  });
}

function enlazarTabs() {
  for (const tab of els.tabs()) {
    tab.addEventListener("click", () => {
      tabActiva = tab.dataset.tab || "todas";
      actualizarTabsUI();
      sincronizarFiltroTipo();
      render();
    });
  }
}

function actualizarTabsUI() {
  for (const tab of els.tabs()) {
    const activo = tab.dataset.tab === tabActiva;
    tab.setAttribute("aria-selected", activo ? "true" : "false");
    tab.classList.toggle("btn-primary", activo);
    tab.classList.toggle("btn-ghost", !activo);
  }
}

function sincronizarFiltroTipo() {
  const select = els.tipo();
  if (!select) return;

  if (tabActiva === "convocatorias") {
    select.value = "convocatoria";
  } else if (tabActiva === "eventos") {
    select.value = "evento";
  } else if (tabActiva === "empleo") {
    select.value = "empleo";
  } else if (tabActiva === "todas") {
    select.value = "";
  }
}

function getFiltros() {
  return {
    q: els.search()?.value ?? "",
    tipo: els.tipo()?.value ?? "",
    municipio: municipioActivo,
    tab: tabActiva,
  };
}

function render() {
  const lista = els.lista();
  const meta = els.meta();
  if (!lista) return;

  lista.classList.remove("loading");
  lista.removeAttribute("aria-busy");

  const filtradas = buscarYFiltrar(todas, getFiltros());

  if (filtradas.length === 0) {
    renderLista([], lista);
    if (meta) {
      const munLabel = municipioActivo ? ` · ${municipioActivo}` : "";
      meta.textContent = `0 resultados${munLabel} · verificado al ${FECHA_REFERENCIA}`;
    }
    mostrarEstadoVacio(
      "Sin coincidencias",
      municipioActivo
        ? `No hay oportunidades en ${municipioActivo} con estos filtros. Prueba otro municipio o quita filtros.`
        : "Prueba otro texto o quita filtros. Solo mostramos información verificada."
    );
    return;
  }

  ocultarEstadoVacio();
  renderLista(filtradas, lista);
  observarReveal(lista);

  if (meta) {
    const munLabel = municipioActivo ? ` · ${municipioActivo}` : "";
    meta.textContent = `${filtradas.length} de ${todas.length} oportunidades${munLabel} · verificado al ${FECHA_REFERENCIA}`;
  }
}

function mostrarEstadoVacio(titulo, mensaje) {
  const empty = els.empty();
  const lista = els.lista();

  if (lista) {
    lista.innerHTML = "";
    lista.classList.remove("loading");
    lista.removeAttribute("aria-busy");
  }

  if (!empty) return;
  empty.removeAttribute("hidden");
  empty.innerHTML = `<strong>${escapeHtml(titulo)}</strong><p>${escapeHtml(mensaje)}</p>`;
}

function ocultarEstadoVacio() {
  const empty = els.empty();
  if (!empty) return;
  empty.setAttribute("hidden", "");
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = String(str ?? "");
  return div.innerHTML;
}

main();
