# Design tokens — Micrositio Juventudes Cartagena

> **Agente 2 (Diseño UI)** · Rama `mvp/multi-agent`  
> Coherente con [fundacionmisangre.org](https://fundacionmisangre.org) (kit Elementor `elementor-kit-655` traducido a CSS vanilla).

## Enlace de hojas de estilo (coordinador)

Orden obligatorio en `index.html`:

```html
<link rel="stylesheet" href="css/variables.css" />
<link rel="stylesheet" href="css/layout.css" />
<link rel="stylesheet" href="css/components.css" />
```

`variables.css` ya importa Google Fonts (Roboto 400/600, Roboto Slab 400/600).

## Paleta de marca

| Token | Hex | Uso |
|-------|-----|-----|
| `--ms-ink` | `#1E1D3A` | Texto principal en fondos claros |
| `--ms-navy` | `#121641` | Header, footer, fondos oscuros |
| `--ms-navy-soft` | `#25354D` | Texto secundario, chips formación |
| `--ms-yellow` | `#F9DF51` | CTAs primarios, acentos |
| `--ms-yellow-bright` | `#FCE139` | Hover botón, foco accesible |
| `--ms-coral` | `#EE7065` | Eyebrows, fechas cierre, chip evento |
| `--ms-mint` | `#78C3AF` | Chip empleo, fondos suaves |
| `--ms-sky` | `#8CCAD1` | Chip participación, micrositio footer |
| `--ms-cream` | `#F8F7F7` | Fondo de página, inputs |
| `--ms-white` | `#FFFFFF` | Cards, superficies |

## Tipografía

| Rol | Familia | Peso | Variable |
|-----|---------|------|----------|
| Primaria (UI, botones) | Roboto | 600 | `--font-primary` |
| Secundaria (títulos) | Roboto Slab | 400 | `--font-display` |
| Cuerpo | Roboto | 400 | `--font-sans` |

Escala: `--text-xs` … `--text-3xl`. Títulos hero: clase `.hero__title` (máx. ~3.25rem vía clamp).

## Espaciado y forma

- Espaciado: `--space-xs` (4px) → `--space-4xl` (80px)
- Radios: `--radius-sm` (6px), `--radius-md` (12px), `--radius-lg` (20px), `--radius-pill` (píldora botones)
- Ancho contenido: `--max-width` (1140px)
- Header: `--header-height` (72px)

## Breakpoints

| Nombre | Valor | Comportamiento |
|--------|-------|----------------|
| Mobile | `≤767px` | Menú hamburguesa; nav en panel fijo |
| Tablet | `≥768px` | Grid 2 columnas en pasos |
| Desktop | `≥1024px` | Layout oportunidades + mapa lateral |

## Z-index

`--z-dropdown` (50) → `--z-sticky` (100) → `--z-overlay` (200) → `--z-modal` (300) → `--z-toast` (400)

---

## Contrato HTML ↔ CSS

### Header (3 zonas)

```html
<header class="site-header">
  <div class="container site-header__inner">
    <button type="button" class="nav-toggle" aria-expanded="false" aria-controls="nav-left">
      <span class="nav-toggle__bar" aria-hidden="true"></span>
      <span class="sr-only">Abrir menú</span>
    </button>
    <nav id="nav-left" class="site-header__nav--left site-nav" aria-label="Principal">
      <ul class="site-nav">…</ul>
    </nav>
    <a class="site-logo" href="/">
      <img src="https://fundacionmisangre.org/wp-content/uploads/2025/08/LOGO-VERTICAL-FMS-2O-ANOS-BLANCO.svg" alt="Fundación Mi Sangre" width="120" height="52" />
    </a>
    <nav class="site-header__nav--right site-nav" aria-label="Secundario">
      <ul class="site-nav">
        <li><a href="#">Blog</a></li>
        <li><a href="#">Unidad de servicios</a></li>
        <li><a class="nav-donar" href="#">Donar</a></li>
      </ul>
    </nav>
    <span class="site-header__spacer" aria-hidden="true"></span>
  </div>
</header>
```

- Logo oficial SVG blanco (20 años), centrado en desktop.
- En mobile: toggle añade clase `.is-open` a los `<nav>` (lógica en JS del coordinador).
- Enlace **Donar**: clase `.nav-donar` o `.is-cta` (negrita visual, color `--ms-yellow-bright`).

### Hero

```html
<section class="hero">
  <div class="container">
    <p class="hero__eyebrow">Cartagena te conecta</p>
    <h1 class="hero__title">Tu mapa de oportunidades juveniles</h1>
    <p class="hero__lead">Subtítulo empático, sin jerga institucional.</p>
    <div class="hero__actions">
      <a class="btn btn-primary" href="#oportunidades">Quiero vincularme</a>
      <a class="btn btn-secondary" href="#mapa">Ver en mapa</a>
    </div>
    <div class="steps-grid">
      <article class="step-block">
        <span class="step-block__number">1</span>
        <h3 class="step-block__title">Título</h3>
        <p class="step-block__subtitle">Subtítulo corto</p>
      </article>
      <!-- 2, 3, 4 -->
    </div>
  </div>
</section>
```

### Búsqueda y filtros

```html
<div class="search-bar">
  <div class="search-bar__row search-bar__row--full">
    <div class="field">
      <label for="q">Buscar</label>
      <input id="q" type="search" name="q" placeholder="Empleo, convocatoria, barrio…" />
    </div>
    <div class="filters">
      <div class="field">
        <label for="tipo">Tipo</label>
        <select id="tipo" name="tipo">…</select>
      </div>
      <div class="field">
        <label for="territorio">Territorio</label>
        <select id="territorio" name="territorio">…</select>
      </div>
    </div>
    <button type="button" class="btn btn-primary">Buscar</button>
  </div>
</div>
<p class="results-meta" aria-live="polite">12 oportunidades</p>
```

Alias: `.search-panel` comparte estilos con `.search-bar`.

### Card de oportunidad (`data/oportunidades.json`)

```html
<article
  class="card-oportunidad"
  data-id="…"
  data-tipo="convocatoria"
  data-estado="abierta"
  data-lat="10.4"
  data-lng="-75.5"
>
  <header class="card-oportunidad__header">
    <span class="chip-tipo chip-tipo--convocatoria">Convocatoria</span>
    <span class="badge badge--abierta">Abierta</span>
  </header>
  <h2 class="card-oportunidad__title">Título</h2>
  <p class="card-oportunidad__org">Organización</p>
  <p class="card-oportunidad__place">Territorio · dirección</p>
  <p class="card-oportunidad__desc">Descripción (máx. 280 caracteres)</p>
  <p class="card-oportunidad__dates card-oportunidad__dates--cierre">
    Cierra: 2026-06-15
  </p>
  <div class="card-oportunidad__actions">
    <a class="btn btn-sm btn-primary" href="…">Quiero vincularme</a>
    <a href="…">Fuente oficial</a>
  </div>
</article>
```

| `tipo` (JSON) | Clase chip |
|---------------|------------|
| `convocatoria` | `.chip-tipo--convocatoria` |
| `empleo` | `.chip-tipo--empleo` |
| `evento` | `.chip-tipo--evento` |
| `participacion` | `.chip-tipo--participacion` |
| `formacion` | `.chip-tipo--formacion` |
| `organizacion` | `.chip-tipo--organizacion` |

**Estado cerrada:** añadir `.card-oportunidad--cerrada` o `.card--cerrada` y `badge--cerrada`. Mostrar fecha de cierre en convocatorias abiertas/cerradas cuando exista en JSON.

**Compatibilidad:** clases genéricas `.card`, `.card__title`, `.card__tipo--*` siguen soportadas.

### Mapa

```html
<aside class="map-panel" id="mapa">
  <div class="map-panel__header">
    <h3>Oportunidades en el mapa</h3>
    <p class="map-panel__hint">Toca un punto para ver el detalle</p>
  </div>
  <div id="minimapa" class="map-panel__map" role="img" aria-label="Mapa de Cartagena"></div>
</aside>
```

Alturas: **280px** mobile, **360px** desde `1024px`.

### Estados

| Clase | Cuándo |
|-------|--------|
| `.empty-state` | Sin resultados tras filtrar |
| `.loading` | Carga de JSON o mapa |
| `.card-oportunidad--cerrada` | `estado: "cerrada"` en datos |

### Footer

```html
<footer class="site-footer">
  <div class="container site-footer__grid">
    <div class="site-footer__brand">
      <img src="…LOGO…BLANCO.svg" alt="" />
      <p class="site-footer__tagline">Frase institucional breve</p>
      <p class="site-footer__micro">Un micrositio de Fundación Mi Sangre</p>
    </div>
    <div>
      <p>Medellín · +57 (604) 3123920 · infomisangre@fundacionmisangre.org</p>
      <ul class="site-footer__social">
        <li><a href="https://www.facebook.com/fmisangre">Facebook</a></li>
        <!-- X, Instagram, LinkedIn -->
      </ul>
      <p>
        <a href="https://fundacionmisangre.org">fundacionmisangre.org</a> ·
        <a href="https://fundacionmisangre.org/politica-de-tratamiento-de-datos-personales/">
          Política de datos
        </a>
      </p>
    </div>
  </div>
</footer>
```

## Botones (copy Mi Sangre)

| Clase | Uso sugerido |
|-------|----------------|
| `.btn-primary` | "Quiero vincularme", "Quiero saber más" |
| `.btn-secondary` | Sobre hero oscuro |
| `.btn-ghost` | Acciones secundarias en cards |
| `.btn-sm` | Enlaces compactos en cards |

## Accesibilidad

- Contraste: texto `--ms-ink` sobre `--ms-cream` / `--ms-white`; texto claro sobre `--ms-navy`.
- Foco: `--color-focus` (`--ms-yellow-bright`), offset 3px.
- `prefers-reduced-motion`: animación de `.loading` desactivada; transiciones acortadas en `:root`.
- Contenido dinámico: `aria-live="polite"` en `.results-meta`.
- Solo lectura: `.sr-only` para etiquetas de iconos.

## Datos (referencia Agente 1)

No editar `data/oportunidades.json` desde diseño. Fecha sistema: **2026-05-29** (`America/Bogota`). Ver `docs/CONTRATO.md`.

## Tono visual (context.md)

- Mucho aire entre bloques; cards con borde suave, no sombras pesadas.
- Protagonista el joven: copy corto en hero y cards; chips legibles a 14px equivalente.
- Sin copiar HTML de Elementor; solo esencia: navy + amarillo + slab en títulos.
