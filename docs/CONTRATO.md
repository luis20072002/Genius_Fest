# Contrato de datos — Fíjate bien (Bolívar)

> **Producto:** micrositio **Fíjate bien** · Oportunidades juveniles en el departamento **Bolívar** (14–28 años).  
> **No modificar campos sin avisar al coordinador.**

**Archivo:** `data/oportunidades.json`  
**Formato:** array de objetos JSON.

## Campos obligatorios

| Campo | Tipo | Reglas |
|-------|------|--------|
| `id` | string | Identificador único en el array |
| `titulo` | string | Título visible en la card |
| `tipo` | enum | `"convocatoria"` \| `"empleo"` \| `"participacion"` \| `"evento"` \| `"formacion"` \| `"organizacion"` |
| `descripcion` | string | Máx. **280** caracteres; lenguaje útil para joven 14–28 |
| `organizacion` | string | Entidad que ofrece o convoca |
| `departamento` | string | Siempre **`"Bolívar"`** en Fase 2 |
| `municipio` | string | Ciudad o pueblo del departamento (p. ej. `"Cartagena"`, `"Turbaco"`, `"Magangué"`) |
| `direccion` | string | Dirección o referencia de ubicación |
| `lat` | number | Latitud WGS84 |
| `lng` | number | Longitud WGS84 |
| `fecha_inicio` | string \| null | `"YYYY-MM-DD"` o `null` |
| `fecha_cierre` | string \| null | `"YYYY-MM-DD"` o `null` (solo `null` si la fuente dice **permanente** o sin cierre) |
| `estado` | enum | `"abierta"` \| `"cerrada"` |
| `contacto` | string | Email, teléfono o URL de inscripción |
| `url_fuente` | string | Página oficial verificada |
| `verificado_en` | string | Fecha de verificación: `"YYYY-MM-DD"` |

## Campo opcional (compatibilidad MVP)

| Campo | Tipo | Reglas |
|-------|------|--------|
| `territorio` | string | Barrio, comuna o zona **dentro** del `municipio` (legacy MVP Cartagena). Si falta, la UI puede omitirlo. |

## Fecha de referencia del sistema

**2026-05-29** (zona `America/Bogota`).

## Reglas de negocio

### Convocatorias y estado `abierta`

- Una convocatoria está **`abierta`** solo si:
  - `fecha_cierre >= 2026-05-29`, **o**
  - la fuente oficial indica explícitamente que la convocatoria sigue vigente.
- Si **no** hay fecha de cierre verificable: **no inventar**. Marcar `estado: "cerrada"` o **excluir** del listado de convocatorias abiertas.

### Criterios de entrega

| Fase | Ítems | Convocatorias abiertas | Municipios distintos |
|------|-------|------------------------|----------------------|
| MVP (cerrado) | ≥ 12 | ≥ 5 | — |
| **Fase 2** | **≥ 20** | **≥ 8** | **≥ 8** |

## Ejemplo mínimo (Fase 2)

```json
{
  "id": "ejemplo-001",
  "titulo": "Título de la oportunidad",
  "tipo": "convocatoria",
  "descripcion": "Texto breve para un joven de Bolívar (máx. 280 caracteres).",
  "organizacion": "Nombre de la organización",
  "departamento": "Bolívar",
  "municipio": "Cartagena",
  "territorio": "Centro Histórico",
  "direccion": "Calle ejemplo #1-23, Cartagena",
  "lat": 10.4236,
  "lng": -75.5144,
  "fecha_inicio": "2026-04-01",
  "fecha_cierre": "2026-06-30",
  "estado": "abierta",
  "contacto": "https://ejemplo.org/inscripcion",
  "url_fuente": "https://ejemplo.org/convocatoria",
  "verificado_en": "2026-05-29"
}
```

## Stack del micrositio

- HTML5 + CSS + JavaScript vanilla (sin React, Angular, WordPress ni HTML copiado de Elementor).
- Diseño coherente con [fundacionmisangre.org](https://fundacionmisangre.org).
- Contexto Fase 2: `docs/CONTEXTO-FASE2.md`.
