# CONTEXTO FASE 2 — Fíjate bien · Bolívar

> **Hackathon · Fundación Mi Sangre · 1 hora · Fecha sistema: 2026-05-29 (America/Bogota)**

## Producto

| Aspecto | Definición |
|---------|------------|
| **Nombre visible** | **Fíjate bien** (no usar "Juventudes Cartagena" como marca principal) |
| **Cliente** | Fundación Mi Sangre — [fundacionmisangre.org](https://fundacionmisangre.org) |
| **Público** | Jóvenes **14–28 años** (Ley 1622/2013) |
| **Alcance territorial** | Departamento **Bolívar**; cada ítem lleva `municipio` (ciudad o pueblo) |
| **Departamento fijo en datos** | `departamento`: `"Bolívar"` |

### Propuesta de valor

Centralizar oportunidades reales (convocatorias, empleo, participación, eventos, formación, organizaciones) que hoy están dispersas, con navegación por **municipio** y mapa.

### UX Fase 2 (sobre el MVP existente)

- **Hero dual:** cifras del reto (ver `context.md`: 87% no participa, caída/recuperación participación, ~245 mil jóvenes en Cartagena como referencia departamental) + mensaje inspirador **«Fíjate bien»**.
- **Nav micrositio:** Inicio | Buscar | Oportunidades | Mapa — **tamaño visual del header** alineado con [fundacionmisangre.org](https://fundacionmisangre.org).
- **Navegación rápida por municipio:** chips y/o `<select>` con **contador** de ítems por municipio.
- **Animaciones nivel B** + skill **impeccable:** reveal al scroll, hover en cards, `prefers-reduced-motion` respetado.
- **Datos:** solo fuentes verificadas; convocatoria `abierta` solo si `fecha_cierre >= 2026-05-29` o vigencia explícita en la fuente (ver `docs/CONTRATO.md`).

## Metas de la hora (Fase 2)

| Meta | Objetivo |
|------|----------|
| Ítems en JSON | **20+** |
| Convocatorias abiertas | **8+** (a 2026-05-29) |
| Municipios distintos | **8+** en el departamento Bolívar |
| Calidad | Primera impresión pulida; filtros y mapa funcionando |

## Stack (sin cambiar)

- HTML5 + CSS + JavaScript **vanilla** (sin React, Angular, WordPress ni HTML copiado de Elementor).
- Datos: `data/oportunidades.json` según `docs/CONTRATO.md`.
- Diseño: tokens en `css/variables.css` y `docs/design-tokens.md`.

## División sugerida de agentes

| Agente | Entregable |
|--------|------------|
| **1 — Datos** | Ampliar `data/oportunidades.json` y `data/fuentes.md`: 20+ ítems, 8+ convocatorias abiertas, 8+ municipios reales |
| **2 — Diseño** | Rebrand UI «Fíjate bien», hero dual, header tamaño Mi Sangre, chips municipio, animaciones B |
| **3 — Frontend** | `index.html` + integración filtros/municipio/mapas Bolívar |
| **4 — QA / integración** | Validar contrato, metas numéricas, prueba local |

## Coordinador

- No rehacer el MVP desde cero.
- Mantener `docs/CONTRATO.md` como fuente de verdad de campos.
- Integrar entregas, probar con servidor local, actualizar `README.md` con nombre **Fíjate bien**.

## Referencias de problema (context.md)

- **87%** no participa en ningún espacio (Calidad de Vida Cartagena 2024).
- Participación comunitaria: 74% (2019) → 30,1% (2022) → 45,1% (2024).
- Solo **3%** en Consejos de Juventud o CTP; **3%** en mecanismos digitales públicos.
- Ocupación juvenil Cartagena 2024: **34,8%**.

## Pregunta orientadora (sin cambiar)

> ¿Cómo organizar y comunicar de forma clara las oportunidades juveniles para que más jóvenes en **Bolívar** las conozcan, se vinculen e incidan en sus territorios?
