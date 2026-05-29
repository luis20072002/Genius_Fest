# -*- coding: utf-8 -*-
from pathlib import Path

README = Path(__file__).resolve().parent.parent / "README.md"

README.write_text(
    """# Fíjate bien

**Oportunidades juveniles verificadas en Bolívar** — micrositio MVP para el hackathon de [Fundación Mi Sangre](https://fundacionmisangre.org).

Centraliza convocatorias, empleo, participación, eventos y organizaciones del departamento en un solo lugar: búsqueda por texto, filtros por tipo y **navegación por municipio**, con mapa georreferenciado y enlace a la fuente oficial de cada oportunidad.

| | |
|---|---|
| **Stack** | HTML · CSS · JavaScript (vanilla) |
| **Mapa** | Leaflet 1.9 + OpenStreetMap |
| **Datos** | JSON estático con fuentes verificables |
| **Rama** | `main` |

## Contenido

- [Para quién es](#para-quién-es)
- [Qué incluye](#qué-incluye)
- [Inicio rápido](#inicio-rápido)
- [Datos](#datos-verificados-al-2026-05-29)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Créditos de imágenes](#créditos-de-imágenes-hero)
- [Contexto del problema](#contexto-del-problema)
- [Documentación](#documentación)
- [Stack técnico](#stack-técnico)
- [Repositorio](#repositorio)

---

## Para quién es

| | |
|---|---|
| **Público** | Jóvenes de **14 a 28 años** en Bolívar (Ley 1622 de 2013) |
| **Territorio** | Todo el departamento; cada registro incluye `municipio` |
| **Cliente** | Fundación Mi Sangre |
| **Fecha de referencia de datos** | 29 de mayo de 2026 |

---

## Qué incluye

- **Hero con carrusel** (2 slides): mensaje inspirador + cifras del reto de participación juvenil, con imágenes y créditos de fuente.
- **Buscador** por palabra clave, tipo de oportunidad y municipio.
- **Chips de municipios** con contador de resultados.
- **Listado de tarjetas** con convocatorias abiertas priorizadas por fecha de cierre.
- **Minimapa** (Leaflet + OpenStreetMap) centrado en Bolívar, sincronizado con los filtros.
- **Diseño** alineado visualmente con el ecosistema [fundacionmisangre.org](https://fundacionmisangre.org) (HTML/CSS/JS vanilla, sin frameworks).

---

## Inicio rápido

El sitio carga datos con `fetch`; **no funciona abriendo `index.html` directo** (`file://`). Usa un servidor local:

```bash
cd Geniusfest
py -m http.server 8080
```

Abre: **http://localhost:8080**

Alternativas:

```bash
py -m http.server 8080
npx --yes serve -p 8080
```

---

## Datos (verificados al 2026-05-29)

| Métrica | Valor |
|---------|------:|
| Oportunidades en catálogo | **25** |
| Convocatorias abiertas | **10** |
| Municipios con al menos un ítem | **8** |

**Municipios:** Arjona, Carmen de Bolívar, Cartagena, Magangué, Mompox, San Juan Nepomuceno, Santa Rosa del Sur, Turbaco.

Cada ítem en [`data/oportunidades.json`](data/oportunidades.json) cumple el contrato en [`docs/CONTRATO.md`](docs/CONTRATO.md). La trazabilidad de fuentes está en [`data/fuentes.md`](data/fuentes.md).

**Regla para convocatorias abiertas:** `fecha_cierre >= 2026-05-29` o vigencia explícita en la página oficial citada. No se inventan títulos, fechas ni enlaces.

Validar metas del MVP:

```bash
node scripts/check-fase2.mjs
```

---

## Estructura del proyecto

```
Geniusfest/
├── index.html              # Página única (hero, buscar, oportunidades, mapa)
├── assets/hero/            # Imágenes del carrusel (uso con crédito)
├── css/
│   ├── variables.css       # Tokens Mi Sangre (colores, tipografía)
│   ├── layout.css          # Header, hero slider, secciones
│   └── components.css      # Cards, chips, botones, mapa, animaciones
├── js/
│   ├── data.js             # Carga y validación del JSON
│   ├── search.js           # Filtros, listado, eventos para el mapa
│   ├── map.js              # Leaflet — Bolívar y municipios
│   ├── hero-slider.js      # Carrusel del inicio (autoplay, accesibilidad)
│   └── app.js              # Orquestación e inicialización
├── data/
│   ├── oportunidades.json  # Catálogo de oportunidades
│   └── fuentes.md          # Tabla de fuentes consultadas
├── docs/
│   ├── CONTRATO.md         # Esquema de datos
│   ├── CONTEXTO-FASE2.md   # Producto y metas Fase 2
│   ├── design-tokens.md    # Guía UI para desarrolladores
│   └── BRIEF-AGENTES-FASE2.md
├── scripts/
│   └── check-fase2.mjs     # QA de metas numéricas
├── context.md              # Contexto del reto (hackathon)
└── Reto.pdf                # Documento del reto
```

---

## Créditos de imágenes (hero)

| Imagen | Fuente |
|--------|--------|
| Juanes con niños en actividad de la fundación | [Vivir en el Poblado (2024)](https://vivirenelpoblado.com/fundacion-mi-sangre-20-anos-impacto-medellin-colombia/) |
| Jóvenes en territorio | [Fundación Mi Sangre — Donaciones](https://fundacionmisangre.org/donaciones-3/) |

Uso con fines informativos en el marco del micrositio **Fíjate bien** (hackathon). Sin afiliación comercial con los medios citados. El listado completo también aparece en la página bajo el carrusel.

---

## Contexto del problema

En Bolívar hay oportunidades y espacios juveniles, pero la información está **dispersa** entre redes, WhatsApp y sitios desactualizados. Referencias del reto (Cartagena / departamento):

- **87%** de la población no participa en ningún espacio comunitario (Calidad de Vida Cartagena 2024).
- Solo **3%** participa en Consejos de Juventud o CTP.
- ~**245.000** jóvenes (14–28) en Cartagena; cientos de miles más en el resto del departamento.

Detalle ampliado: [`context.md`](context.md).

---

## Documentación

| Archivo | Contenido |
|---------|-----------|
| [`docs/CONTRATO.md`](docs/CONTRATO.md) | Campos JSON, reglas de convocatorias abiertas |
| [`docs/CONTEXTO-FASE2.md`](docs/CONTEXTO-FASE2.md) | Producto «Fíjate bien», UX y metas |
| [`docs/design-tokens.md`](docs/design-tokens.md) | Paleta, tipografía, componentes CSS |
| [`docs/BRIEF-AGENTES-FASE2.md`](docs/BRIEF-AGENTES-FASE2.md) | Roles de agentes en el desarrollo |

---

## Stack técnico

- HTML5 semántico, CSS modular, JavaScript ES modules.
- [Leaflet](https://leafletjs.com/) 1.9 + [OpenStreetMap](https://www.openstreetmap.org/) para el mapa.
- Sin React, Angular, WordPress ni backend en este MVP.

---

## Pregunta orientadora

> ¿Cómo organizar y comunicar de forma clara las oportunidades juveniles para que más jóvenes en **Bolívar** las conozcan, se vinculen e incidan en sus territorios?

---

## Repositorio

- Rama principal de desarrollo y despliegue: **`main`**
- Remoto: [github.com/luis20072002/Genius_Fest](https://github.com/luis20072002/Genius_Fest)

---

## Contacto institucional

**Fundación Mi Sangre**  
[fundacionmisangre.org](https://fundacionmisangre.org) · infomisangre@fundacionmisangre.org · +57 (604) 3123920
""",
    encoding="utf-8",
    newline="\n",
)
print("README.md written")
