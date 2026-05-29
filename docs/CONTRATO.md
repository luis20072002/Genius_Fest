# Contrato de datos — Oportunidades juveniles Cartagena

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
| `territorio` | string | Barrio/comuna o `"Cartagena"` |
| `direccion` | string | Dirección o referencia de ubicación |
| `lat` | number | Latitud WGS84 |
| `lng` | number | Longitud WGS84 |
| `fecha_inicio` | string \| null | `"YYYY-MM-DD"` o `null` |
| `fecha_cierre` | string \| null | `"YYYY-MM-DD"` o `null` (solo `null` si la fuente dice **permanente** o sin cierre) |
| `estado` | enum | `"abierta"` \| `"cerrada"` |
| `contacto` | string | Email, teléfono o URL de inscripción |
| `url_fuente` | string | Página oficial verificada |
| `verificado_en` | string | Fecha de verificación: `"YYYY-MM-DD"` |

## Fecha de referencia del sistema

**2026-05-29** (zona `America/Bogota`).

## Reglas de negocio

### Convocatorias y estado `abierta`

- Una convocatoria está **`abierta`** solo si:
  - `fecha_cierre >= 2026-05-29`, **o**
  - la fuente oficial indica explícitamente que la convocatoria sigue vigente.
- Si **no** hay fecha de cierre verificable: **no inventar**. Marcar `estado: "cerrada"` o **excluir** del listado de convocatorias abiertas.

### Criterios de entrega (MVP)

- Mínimo **12** ítems en el array.
- Mínimo **5** convocatorias con `tipo: "convocatoria"` y `estado: "abierta"` a la fecha de referencia.

## Ejemplo mínimo

```json
{
  "id": "ejemplo-001",
  "titulo": "Título de la oportunidad",
  "tipo": "convocatoria",
  "descripcion": "Texto breve para un joven de Cartagena (máx. 280 caracteres).",
  "organizacion": "Nombre de la organización",
  "territorio": "Cartagena",
  "direccion": "Calle ejemplo #1-23",
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
