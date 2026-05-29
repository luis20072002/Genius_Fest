# Brief agentes — Fase 2 «Fíjate bien»

**Rama:** la actual del repo · **No modificar** `docs/CONTRATO.md` sin coordinador.

## Agente 1 — Datos

**Archivos:** `data/oportunidades.json`, `data/fuentes.md`

- Cumplir metas: **20+** ítems, **8+** convocatorias `abierta`, **8+** `municipio` distintos (p. ej. Cartagena, Turbaco, Magangué, Arjona, Carmen de Bolívar, El Carmen de Bolívar, San Juan Nepomuceno, Mahates… solo si hay fuente).
- Cada ítem: `departamento`: `"Bolívar"`, `municipio` obligatorio.
- `territorio` opcional: barrio/zona dentro del municipio.
- No inventar convocatorias ni fechas de cierre.

## Agente 2 — Diseño / UI

**Archivos:** `css/*.css`, `docs/design-tokens.md` (si aplica)

- Marca visible: **Fíjate bien** + subtítulo Bolívar / Mi Sangre.
- Hero dual (datos + mensaje inspirador).
- Header/nav escala similar a fundacionmisangre.org.
- Chips municipio con contador; estados hover y scroll reveal; `prefers-reduced-motion`.

## Agente 3 — Frontend

**Archivos:** `index.html`, `js/search.js`, `js/app.js`, `js/map.js` (ajustes mínimos)

- Nav: Inicio | Buscar | Oportunidades | Mapa.
- Filtro/chips por `municipio` (usar `listarMunicipios` de `js/data.js`).
- Centrar mapa en Bolívar (no solo Cartagena si hay ítems en otros municipios).
- No romper carga de `oportunidades.json`.

## Agente 4 — QA

- Script o checklist: contar ítems, convocatorias abiertas, municipios.
- Probar: `npx --yes serve` o `py -m http.server 8080`.
- Reportar gaps al coordinador.

## Coordinador

- `docs/CONTEXTO-FASE2.md`, `docs/CONTRATO.md`, `README.md`, integración final.
