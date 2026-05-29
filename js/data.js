/**
 * Carga y validación del contrato de datos (docs/CONTRATO.md — Fase 2 Fíjate bien).
 * Fecha de referencia: 2026-05-29 (America/Bogota)
 */
const FECHA_REFERENCIA = "2026-05-29";
const DEPARTAMENTO_FASE2 = "Bolívar";
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
 * Normaliza ítems legacy (territorio sin municipio).
 * @param {object} item
 * @returns {object}
 */
export function normalizarItem(item) {
  const out = { ...item };
  if (!out.departamento) out.departamento = DEPARTAMENTO_FASE2;
  if (!out.municipio) {
    const t = (out.territorio || "").trim();
    if (t === "Bolívar" || t === "") {
      out.municipio = inferirMunicipioDesdeDireccion(out.direccion) || "Cartagena";
    } else if (esBarrioCartagena(t)) {
      out.municipio = "Cartagena";
    } else {
      out.municipio = t;
    }
  }
  return out;
}

function esBarrioCartagena(territorio) {
  const barrios = [
    "Centro",
    "Centro Histórico",
    "Centro / Puerto",
    "Manga",
    "Pie de la Popa",
    "Serena del Mar",
    "San Diego",
  ];
  return barrios.some((b) => territorio.includes(b)) || territorio === "Cartagena";
}

function inferirMunicipioDesdeDireccion(direccion) {
  if (!direccion || typeof direccion !== "string") return null;
  const d = direccion.toLowerCase();
  if (d.includes("cartagena")) return "Cartagena";
  if (d.includes("turbaco")) return "Turbaco";
  if (d.includes("magangué") || d.includes("magangue")) return "Magangué";
  if (d.includes("arjona")) return "Arjona";
  return null;
}

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
  return data.map(normalizarItem).filter(validarItem);
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
    "departamento",
    "municipio",
    "direccion",
    "estado",
    "contacto",
    "url_fuente",
    "verificado_en",
  ];
  for (const key of required) {
    if (item[key] === undefined || item[key] === "") return false;
  }

  if (item.departamento !== DEPARTAMENTO_FASE2) return false;
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
  const set = new Set(
    items.map((o) => o.territorio || o.municipio).filter(Boolean)
  );
  return [...set].sort((a, b) => a.localeCompare(b, "es"));
}

/**
 * Municipios con conteo (Fase 2 — chips / select).
 * @param {object[]} items
 * @returns {{ nombre: string, count: number }[]}
 */
export function listarMunicipios(items) {
  const counts = new Map();
  for (const o of items) {
    const m = o.municipio;
    if (!m) continue;
    counts.set(m, (counts.get(m) || 0) + 1);
  }
  return [...counts.entries()]
    .map(([nombre, count]) => ({ nombre, count }))
    .sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
}

export { FECHA_REFERENCIA, DEPARTAMENTO_FASE2 };
