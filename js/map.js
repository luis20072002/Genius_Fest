/**
 * Minimapa Leaflet — Agente 4
 *
 * CDN (coordinador: añadir en index.html antes de app.js):
 *   css: https://unpkg.com/leaflet/dist/leaflet.css
 *   js:  https://unpkg.com/leaflet/dist/leaflet.js
 *
 * Escucha `oportunidades:filtered` (search.js) — no duplica lógica de búsqueda.
 * Sincroniza con listado vía `oportunidad:focus` (card → mapa) y click en marker (mapa → card).
 */

const CARTAGENA_CENTER = [10.391, -75.4794];
const DEFAULT_ZOOM = 12;
const FOCUS_ZOOM = 15;

/** Convocatoria abierta vs resto — alineado con tokens Mi Sangre */
const MARKER_COLORS = {
  convocatoriaAbierta: { fill: "#f9df51", stroke: "#1e1d3a" },
  otro: { fill: "#25354d", stroke: "#ffffff" },
};

const TIPO_LABELS = {
  convocatoria: "Convocatoria",
  empleo: "Empleo",
  participacion: "Participación",
  evento: "Evento",
  formacion: "Formación",
  organizacion: "Organización",
};

let mapInstance = null;
let markersLayer = null;
let legendControl = null;
let bootstrapped = false;
/** @type {Map<string, import("leaflet").CircleMarker>} */
const markersById = new Map();

/**
 * @param {string} containerId
 * @returns {import("leaflet").Map|null}
 */
export function initMap(containerId = "minimapa") {
  if (typeof L === "undefined") {
    console.warn("[minimapa] Leaflet no cargado. Añade leaflet.css y leaflet.js vía CDN.");
    return null;
  }

  const el = document.getElementById(containerId);
  if (!el) return null;

  el.style.borderRadius = "var(--radius-lg)";
  el.style.overflow = "hidden";

  mapInstance = L.map(containerId, {
    scrollWheelZoom: false,
    attributionControl: true,
  }).setView(CARTAGENA_CENTER, DEFAULT_ZOOM);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 18,
  }).addTo(mapInstance);

  markersLayer = L.layerGroup().addTo(mapInstance);
  addLegend(mapInstance);

  return mapInstance;
}

/**
 * @param {import("leaflet").Map} map
 */
function addLegend(map) {
  if (legendControl) {
    map.removeControl(legendControl);
  }

  legendControl = L.control({ position: "bottomright" });

  legendControl.onAdd = () => {
    const div = L.DomUtil.create("div", "minimapa-leyenda");
    div.setAttribute("aria-label", "Leyenda del mapa");
    div.innerHTML = `
      <p class="minimapa-leyenda__title">Leyenda</p>
      <ul class="minimapa-leyenda__list">
        <li>
          <span class="minimapa-leyenda__dot minimapa-leyenda__dot--convocatoria" aria-hidden="true"></span>
          Convocatoria abierta
        </li>
        <li>
          <span class="minimapa-leyenda__dot minimapa-leyenda__dot--otro" aria-hidden="true"></span>
          Otros tipos
        </li>
      </ul>
    `;
    injectLegendStyles();
    L.DomEvent.disableClickPropagation(div);
    return div;
  };

  legendControl.addTo(map);
}

function injectLegendStyles() {
  if (document.getElementById("minimapa-leyenda-styles")) return;

  const style = document.createElement("style");
  style.id = "minimapa-leyenda-styles";
  style.textContent = `
    .minimapa-leyenda {
      background: rgba(255, 255, 255, 0.95);
      border: 1px solid rgba(30, 29, 58, 0.12);
      border-radius: 12px;
      padding: 0.5rem 0.75rem;
      font-family: Roboto, system-ui, sans-serif;
      font-size: 0.75rem;
      line-height: 1.4;
      color: #1e1d3a;
      box-shadow: 0 2px 8px rgba(18, 22, 65, 0.08);
    }
    .minimapa-leyenda__title {
      margin: 0 0 0.35rem;
      font-weight: 600;
    }
    .minimapa-leyenda__list {
      margin: 0;
      padding: 0;
      list-style: none;
    }
    .minimapa-leyenda__list li {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      margin: 0.15rem 0;
    }
    .minimapa-leyenda__dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      flex-shrink: 0;
      border: 2px solid;
    }
    .minimapa-leyenda__dot--convocatoria {
      background: ${MARKER_COLORS.convocatoriaAbierta.fill};
      border-color: ${MARKER_COLORS.convocatoriaAbierta.stroke};
    }
    .minimapa-leyenda__dot--otro {
      background: ${MARKER_COLORS.otro.fill};
      border-color: ${MARKER_COLORS.otro.stroke};
    }
    .card--active,
    .card-oportunidad.card--active {
      border-color: #f9df51;
      box-shadow: 0 0 0 2px rgba(249, 223, 81, 0.45), 0 8px 24px rgba(18, 22, 65, 0.12);
    }
  `;
  document.head.appendChild(style);
}

/**
 * @param {object} item
 * @returns {boolean}
 */
function tieneCoordenadas(item) {
  return (
    item &&
    typeof item.lat === "number" &&
    typeof item.lng === "number" &&
    !Number.isNaN(item.lat) &&
    !Number.isNaN(item.lng)
  );
}

/**
 * @param {object} item
 * @returns {boolean}
 */
function esConvocatoriaAbierta(item) {
  return item.tipo === "convocatoria" && item.estado === "abierta";
}

/**
 * @param {object} item
 * @returns {import("leaflet").CircleMarker|null}
 */
function crearMarcador(item) {
  const colors = esConvocatoriaAbierta(item)
    ? MARKER_COLORS.convocatoriaAbierta
    : MARKER_COLORS.otro;

  const marker = L.circleMarker([item.lat, item.lng], {
    radius: 8,
    fillColor: colors.fill,
    color: colors.stroke,
    weight: 2,
    opacity: 1,
    fillOpacity: 0.92,
  });

  marker.bindPopup(buildPopupHtml(item), { maxWidth: 280 });
  marker.on("click", () => {
    highlightCard(item.id);
    document.dispatchEvent(
      new CustomEvent("mapa:select", { detail: { id: item.id } })
    );
  });

  return marker;
}

/**
 * @param {object} item
 * @returns {string}
 */
function buildPopupHtml(item) {
  const tipoLabel = TIPO_LABELS[item.tipo] || item.tipo;
  const cierre =
    item.fecha_cierre
      ? `<p class="minimapa-popup__meta">Cierra: ${escapeHtml(formatearFecha(item.fecha_cierre))}</p>`
      : "";

  return `
    <div class="minimapa-popup">
      <strong>${escapeHtml(item.titulo)}</strong>
      <p class="minimapa-popup__tipo">${escapeHtml(tipoLabel)}</p>
      ${cierre}
      <p class="minimapa-popup__link">
        <a href="${escapeAttr(item.url_fuente)}" target="_blank" rel="noopener noreferrer">Fuente oficial</a>
      </p>
    </div>
  `;
}

/**
 * @param {object[]} items
 */
export function actualizarMarcadores(items) {
  if (!mapInstance || !markersLayer) return;

  markersLayer.clearLayers();
  markersById.clear();

  const bounds = [];

  for (const item of items) {
    if (!tieneCoordenadas(item)) {
      console.warn(
        `[minimapa] Omitiendo marker sin coordenadas: ${item.id} — ${item.titulo}`
      );
      continue;
    }

    const marker = crearMarcador(item);
    marker.addTo(markersLayer);
    markersById.set(item.id, marker);
    bounds.push([item.lat, item.lng]);
  }

  if (bounds.length > 1) {
    mapInstance.fitBounds(bounds, { padding: [32, 32], maxZoom: 14 });
  } else if (bounds.length === 1) {
    mapInstance.setView(bounds[0], FOCUS_ZOOM);
  } else {
    mapInstance.setView(CARTAGENA_CENTER, DEFAULT_ZOOM);
  }

  requestAnimationFrame(() => mapInstance?.invalidateSize());
}

/**
 * @param {string} id
 */
export function enfocarMarcador(id) {
  const marker = markersById.get(id);
  if (!marker || !mapInstance) return;

  mapInstance.setView(marker.getLatLng(), FOCUS_ZOOM, { animate: true });
  marker.openPopup();
  highlightCard(id);
}

/**
 * @param {string} id
 */
function highlightCard(id) {
  document.querySelectorAll(".card, .card-oportunidad").forEach((card) => {
    card.classList.toggle("card--active", card.dataset.id === id);
  });

  const card = document.querySelector(
    `.card[data-id="${CSS.escape(id)}"], .card-oportunidad[data-id="${CSS.escape(id)}"]`
  );
  card?.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

/**
 * Enlaza eventos del listado y de filtros con el mapa.
 */
export function enlazarEventosMapa() {
  document.addEventListener("oportunidades:filtered", (e) => {
    const items = e.detail?.items;
    if (Array.isArray(items)) {
      actualizarMarcadores(items);
    }
  });

  document.addEventListener("oportunidad:focus", (e) => {
    if (e.detail?.id) enfocarMarcador(e.detail.id);
  });

  document.addEventListener("mapa:select", (e) => {
    if (e.detail?.id) highlightCard(e.detail.id);
  });
}

/**
 * Inicializa mapa y enlaza eventos. Espera `oportunidades:filtered` del listado.
 */
export async function bootstrapMinimapa() {
  if (bootstrapped) return mapInstance;
  bootstrapped = true;

  const map = initMap("minimapa");
  if (!map) return null;

  enlazarEventosMapa();
  return map;
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

/**
 * @param {string|null|undefined} iso
 * @returns {string}
 */
function formatearFecha(iso) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

if (document.getElementById("minimapa")) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => bootstrapMinimapa());
  } else {
    bootstrapMinimapa();
  }
}
