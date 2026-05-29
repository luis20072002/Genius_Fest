/**
 * Carga y validación del contrato de datos (docs/CONTRATO.md).
 * Fecha de referencia: 2026-05-29 (America/Bogota)
 */
const FECHA_REFERENCIA = "2026-05-29";
const TIPOS_VALIDOS = new Set([
  "convocatoria",
  "empleo",
  "participacion",
  "evento",
  "formacion",
  "organizacion",
]);
const ESTADOS_VALIDOS = new Set(["abierta", "cerrada"]);
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * @returns {Promise<object[]>}
 */
export async function cargarOportunidades() {
  const res = await fetch("./data/oportunidades.json");
  if (!res.ok) {
    throw new Error(`No se pudo cargar oportunidades.json (${res.status})`);
  }
  const data = await res.json();
  if (!Array.isArray(data)) {
    throw new Error("oportunidades.json debe ser un array");
  }
  return data.filter(validarItem);
}

/**
 * @param {object} item
 * @returns {boolean}
 */
function validarItem(item) {
  if (!item || typeof item !== "object") return false;

  const required = [
    "id",
    "titulo",
    "tipo",
    "descripcion",
    "organizacion",
    "territorio",
    "direccion",
    "estado",
    "contacto",
    "url_fuente",
    "verificado_en",
  ];
  for (const key of required) {
    if (item[key] === undefined || item[key] === "") return false;
  }

  if (!TIPOS_VALIDOS.has(item.tipo)) return false;
  if (!ESTADOS_VALIDOS.has(item.estado)) return false;
  if (typeof item.lat !== "number" || typeof item.lng !== "number") return false;
  if (typeof item.descripcion !== "string" || item.descripcion.length > 280) return false;
  if (!ISO_DATE.test(item.verificado_en)) return false;

  if (item.fecha_inicio !== null && item.fecha_inicio !== undefined) {
    if (!ISO_DATE.test(item.fecha_inicio)) return false;
  }
  if (item.fecha_cierre !== null && item.fecha_cierre !== undefined) {
    if (!ISO_DATE.test(item.fecha_cierre)) return false;
  }

  return true;
}

/**
 * Convocatorias abiertas según contrato (estado verificado en JSON).
 * @param {object[]} items
 * @returns {object[]}
 */
export function filtrarConvocatoriasAbiertas(items) {
  return items.filter((o) => o.tipo === "convocatoria" && o.estado === "abierta");
}

/**
 * @param {object[]} items
 * @returns {number}
 */
export function contarConvocatoriasAbiertas(items) {
  return filtrarConvocatoriasAbiertas(items).length;
}

/**
 * @param {object[]} items
 * @returns {string[]}
 */
export function listarTerritorios(items) {
  const set = new Set(items.map((o) => o.territorio).filter(Boolean));
  return [...set].sort((a, b) => a.localeCompare(b, "es"));
}

export { FECHA_REFERENCIA };
