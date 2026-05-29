#!/usr/bin/env node
/**
 * QA Fase 2 — metas numéricas (docs/CONTRATO.md)
 * Uso: node scripts/check-fase2.mjs
 */
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const data = JSON.parse(
  readFileSync(join(root, "data/oportunidades.json"), "utf8")
);

const municipios = new Set();
let convAbiertas = 0;
let sinMunicipio = 0;
let sinDepto = 0;

for (const o of data) {
  const m = o.municipio || o.territorio;
  if (m) municipios.add(m);
  if (!o.municipio) sinMunicipio++;
  if (o.departamento !== "Bolívar") sinDepto++;
  if (o.tipo === "convocatoria" && o.estado === "abierta") convAbiertas++;
}

const goals = {
  items: { actual: data.length, min: 20, ok: data.length >= 20 },
  convocatorias_abiertas: {
    actual: convAbiertas,
    min: 8,
    ok: convAbiertas >= 8,
  },
  municipios: {
    actual: municipios.size,
    min: 8,
    ok: municipios.size >= 8,
  },
};

console.log("Fíjate bien — check Fase 2\n");
for (const [k, v] of Object.entries(goals)) {
  console.log(
    `${v.ok ? "OK" : "PENDIENTE"}  ${k}: ${v.actual} (min ${v.min})`
  );
}
if (sinMunicipio) console.log(`\nAviso: ${sinMunicipio} ítems sin campo municipio`);
if (sinDepto) console.log(`Aviso: ${sinDepto} ítems sin departamento Bolívar`);
console.log("\nMunicipios:", [...municipios].sort().join(", ") || "(ninguno)");

process.exit(Object.values(goals).every((g) => g.ok) ? 0 : 1);
