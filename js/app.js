import {
  cargarOportunidades,
  contarConvocatoriasAbiertas,
  listarTerritorios,
  FECHA_REFERENCIA,
} from "./data.js";
import { buscarYFiltrar, renderLista } from "./search.js";
import { bootstrapMinimapa } from "./map.js";

const els = {
  lista: () => document.getElementById("lista-oportunidades"),
  meta: () => document.getElementById("results-meta"),
  empty: () => document.getElementById("empty-state"),
  search: () => document.getElementById("search-q"),
  tipo: () => document.getElementById("filter-tipo"),
  territorio: () => document.getElementById("filter-territorio"),
  heroCta: () => document.getElementById("hero-cta"),
  tabs: () => document.querySelectorAll('[role="tab"][data-tab]'),
};

/** @type {object[]} */
let todas = [];
/** @type {string} */
let tabActiva = "convocatorias";

async function main() {
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
  poblarFiltroTerritorio(todas);
  enlazarFiltros();
  enlazarTabs();
  sincronizarFiltroTipo();
  await bootstrapMinimapa();
  render();
  requestAnimationFrame(() => {
    window.dispatchEvent(new Event("resize"));
  });

  const abiertas = contarConvocatoriasAbiertas(todas);
  if (todas.length < 12 || abiertas < 5) {
    console.warn(
      `Datos incompletos: ${todas.length} ítems, ${abiertas} convocatorias abiertas (mín. 12 y 5).`
    );
  }
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

function poblarFiltroTerritorio(items) {
  const select = els.territorio();
  if (!select) return;
  for (const t of listarTerritorios(items)) {
    const opt = document.createElement("option");
    opt.value = t;
    opt.textContent = t;
    select.appendChild(opt);
  }
}

function enlazarFiltros() {
  const inputs = [els.search(), els.tipo(), els.territorio()].filter(Boolean);
  for (const input of inputs) {
    input.addEventListener("input", render);
    input.addEventListener("change", render);
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
    territorio: els.territorio()?.value ?? "",
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
      meta.textContent = `0 resultados · verificado al ${FECHA_REFERENCIA}`;
    }
    mostrarEstadoVacio(
      "Sin coincidencias",
      "Prueba otro texto o quita filtros. Solo mostramos información verificada."
    );
    return;
  }

  ocultarEstadoVacio();
  renderLista(filtradas, lista);

  if (meta) {
    meta.textContent = `${filtradas.length} de ${todas.length} oportunidades · verificado al ${FECHA_REFERENCIA}`;
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
