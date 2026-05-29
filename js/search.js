/**
 * Búsqueda, filtros, orden y render de cards.
 * Dispara CustomEvent 'oportunidades:filtered' con el array resultante.
 */
import { FECHA_REFERENCIA } from "./data.js";

const TIPO_LABELS = {
  convocatoria: "Convocatoria",
  empleo: "Empleo",
  participacion: "Participación",
  evento: "Evento",
  formacion: "Formación",
  organizacion: "Organización",
};

const MS_DIA = 86_400_000;

/**
 * @param {object[]} items
 * @param {{ q: string, tipo: string, territorio: string, tab: string }} filtros
 * @returns {object[]}
 */
export function filtrarOportunidades(items, filtros) {
  const q = (filtros.q || "").trim().toLowerCase();
  const tipo = filtros.tipo || "";
  const territorio = filtros.territorio || "";
  const tab = filtros.tab || "todas";

  let result = items.filter((item) => {
    if (tipo && item.tipo !== tipo) return false;
    if (territorio && item.territorio !== territorio) return false;

    if (tab === "convocatorias") {
      if (item.tipo !== "convocatoria" || item.estado !== "abierta") return false;
    } else if (tab === "eventos") {
      if (item.tipo !== "evento") return false;
    } else if (tab === "empleo") {
      if (item.tipo !== "empleo") return false;
    }

    if (!q) return true;
    const blob = [item.titulo, item.descripcion, item.organizacion]
      .join(" ")
      .toLowerCase();
    return blob.includes(q);
  });

  result = ordenarOportunidades(result);
  return result;
}

/**
 * Convocatorias abiertas primero por fecha_cierre ascendente; resto sin reordenar fuerte.
 * @param {object[]} items
 * @returns {object[]}
 */
export function ordenarOportunidades(items) {
  const abiertas = [];
  const resto = [];

  for (const item of items) {
    if (item.tipo === "convocatoria" && item.estado === "abierta") {
      abiertas.push(item);
    } else {
      resto.push(item);
    }
  }

  abiertas.sort((a, b) => compararFechaCierre(a.fecha_cierre, b.fecha_cierre));

  return [...abiertas, ...resto];
}

/**
 * @param {string|null|undefined} a
 * @param {string|null|undefined} b
 * @returns {number}
 */
function compararFechaCierre(a, b) {
  if (!a && !b) return 0;
  if (!a) return 1;
  if (!b) return -1;
  return a.localeCompare(b);
}

/**
 * @param {object} item
 * @param {string} [fechaRef=FECHA_REFERENCIA]
 * @returns {boolean}
 */
export function esUrgente(item, fechaRef = FECHA_REFERENCIA) {
  if (!item.fecha_cierre) return false;
  const ref = parseISO(fechaRef);
  const cierre = parseISO(item.fecha_cierre);
  if (!ref || !cierre) return false;
  const diff = Math.ceil((cierre - ref) / MS_DIA);
  return diff >= 0 && diff <= 7;
}

/**
 * @param {string} iso YYYY-MM-DD
 * @returns {string} DD/MM/YYYY
 */
export function formatearFecha(iso) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

/**
 * @param {object[]} items
 * @param {{ q: string, tipo: string, territorio: string, tab: string }} filtros
 * @returns {object[]}
 */
export function buscarYFiltrar(items, filtros) {
  const result = filtrarOportunidades(items, filtros);
  document.dispatchEvent(
    new CustomEvent("oportunidades:filtered", {
      detail: { items: result, filtros },
    })
  );
  return result;
}

/**
 * @param {object[]} items
 * @param {HTMLElement|null} container
 */
export function renderLista(items, container) {
  if (!container) return;
  container.innerHTML = "";
  for (const item of items) {
    container.appendChild(crearCard(item));
  }
}

/**
 * @param {object} item
 * @returns {HTMLElement}
 */
export function crearCard(item) {
  const article = document.createElement("article");
  article.className = "card-oportunidad";
  if (item.estado === "cerrada") {
    article.classList.add("card-oportunidad--cerrada");
  }
  if (esUrgente(item)) {
    article.classList.add("card-oportunidad--urgente");
    article.dataset.urgente = "true";
  }

  article.dataset.id = item.id;
  article.dataset.tipo = item.tipo;
  article.dataset.estado = item.estado;
  article.dataset.lat = String(item.lat);
  article.dataset.lng = String(item.lng);
  article.setAttribute("tabindex", "0");
  article.setAttribute("role", "listitem");

  const tipoLabel = TIPO_LABELS[item.tipo] || item.tipo;
  const estadoClass =
    item.estado === "abierta" ? "badge--abierta" : "badge--cerrada";
  const estadoLabel = item.estado === "abierta" ? "Abierta" : "Cerrada";

  const cierreBadge =
    item.tipo === "convocatoria" && item.fecha_cierre
      ? `<span class="badge ${esUrgente(item) ? "card-oportunidad__dates--cierre" : ""}">Cierra: ${escapeHtml(formatearFecha(item.fecha_cierre))}${esUrgente(item) ? " · Urgente" : ""}</span>`
      : "";

  article.innerHTML = `
    <header class="card-oportunidad__header">
      <span class="chip-tipo chip-tipo--${escapeHtml(item.tipo)}">${escapeHtml(tipoLabel)}</span>
      <span class="badge ${estadoClass}">${estadoLabel}</span>
    </header>
    <h2 class="card-oportunidad__title">${escapeHtml(item.titulo)}</h2>
    <p class="card-oportunidad__org">${escapeHtml(item.organizacion)}</p>
    <p class="card-oportunidad__place">${escapeHtml(item.territorio)} · ${escapeHtml(item.direccion)}</p>
    <p class="card-oportunidad__desc">${escapeHtml(item.descripcion)}</p>
    ${cierreBadge}
    <div class="card-oportunidad__actions">
      <a class="btn btn-sm btn-primary" href="${escapeAttr(item.contacto)}" target="_blank" rel="noopener noreferrer">Quiero vincularme</a>
      <a href="${escapeAttr(item.url_fuente)}" target="_blank" rel="noopener noreferrer">Fuente oficial</a>
    </div>
  `;

  article.addEventListener("click", (e) => {
    if (e.target.closest("a")) return;
    article.dispatchEvent(
      new CustomEvent("oportunidad:focus", {
        bubbles: true,
        detail: { id: item.id, lat: item.lat, lng: item.lng },
      })
    );
  });

  article.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      article.click();
    }
  });

  return article;
}

/**
 * @param {string} iso
 * @returns {number|null}
 */
function parseISO(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return null;
  return Date.UTC(y, m - 1, d);
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = String(str ?? "");
  return div.innerHTML;
}

function escapeAttr(str) {
  return String(str ?? "#")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;");
}
