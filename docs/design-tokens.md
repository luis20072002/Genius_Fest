# Design tokens — Fíjate bien · Bolívar

> **Agente 2 · Fase 2** · Cliente visual: [Fundación Mi Sangre](https://fundacionmisangre.org)  
> **Marca del producto:** **Fíjate bien** (no renombrar a “Juventudes Cartagena” ni otro título en UI).

## Hojas de estilo (orden)

```html
<link rel="stylesheet" href="css/variables.css" />
<link rel="stylesheet" href="css/layout.css" />
<link rel="stylesheet" href="css/components.css" />
```

Google Fonts incluidas en `variables.css`: Roboto 400/600, Roboto Slab 400/600.

---

## Marca y alcance

| Concepto | Valor |
|----------|--------|
| Nombre visible | **Fíjate bien** |
| Alcance datos | Departamento **Bolívar** (`municipio` por ítem) |
| Institucional | Micrositio de Fundación Mi Sangre |
| Token CSS nombre | `--fb-name` (referencia; copy en HTML) |

Paleta padre: prefijo `--ms-*` (Mi Sangre). No eliminar ni renombrar esos tokens.

---

## Header (Fase 2)

| Spec | Token / valor |
|------|----------------|
| Altura | `--header-height`: **100px** |
| Fondo | `--ms-navy`: **#121641** |
| Logo desktop | `--logo-height-desktop`: **92px** (máx. 96px) |
| Logo mobile | `--logo-height-mobile`: **72px** |
| Nav links | `--text-nav`: **1rem**, peso 600, color blanco |

### Nav micrositio (Agente 3)

Enlaces: **Inicio** `#hero` · **Buscar** `#buscar` · **Oportunidades** `#oportunidades` · **Mapa** `#mapa`.

```html
<header class="site-header">
  <div class="container site-header__inner">
    <button type="button" class="nav-toggle" aria-expanded="false" aria-controls="site-nav-main">
      <span class="nav-toggle__bar" aria-hidden="true"></span>
      <span class="sr-only">Abrir menú</span>
    </button>
    <nav id="site-nav-main" class="site-header__nav--left site-nav" aria-label="Fíjate bien">
      <ul class="site-nav">
        <li><a href="#hero" aria-current="page">Inicio</a></li>
        <li><a href="#buscar">Buscar</a></li>
      </ul>
    </nav>
    <a class="site-logo" href="https://fundacionmisangre.org" target="_blank" rel="noopener noreferrer">
      <img src="https://fundacionmisangre.org/wp-content/uploads/2025/08/LOGO-VERTICAL-FMS-2O-ANOS-BLANCO.svg"
           alt="Fundación Mi Sangre — 20 años" width="120" height="92" />
    </a>
    <nav class="site-header__nav--right site-nav" aria-label="Secciones">
      <ul class="site-nav">
        <li><a href="#oportunidades">Oportunidades</a></li>
        <li><a href="#mapa">Mapa</a></li>
      </ul>
    </nav>
    <span class="site-header__spacer" aria-hidden="true"></span>
  </div>
</header>
```

**JS mobile:** al clic en `.nav-toggle`, toggle `.is-open` en nav(s) y `aria-expanded`. Opcional: `.brand-lockup` con `.brand-lockup__name` = “Fíjate bien” bajo el logo.

**Estado activo:** clase `.is-active` o `aria-current="page"` en el enlace de la sección visible.

---

## Hero dual (obligatorio Fase 2)

Dos paneles: **reto (cifras)** + **inspirador «Fíjate bien»**. Roboto Slab en títulos; CTA amarillo `.btn-primary`.

```html
<section id="hero" class="hero hero-dual">
  <div class="container hero-dual__grid">
    <!-- Panel 1: datos del reto (context.md) -->
    <div class="hero-dual__stats hero-panel reveal-on-scroll">
      <p class="hero__eyebrow">El reto en Bolívar</p>
      <div class="stats-grid">
        <article class="stat-card stat-card--highlight">
          <strong class="stat-card__value">87%</strong>
          <span class="stat-card__label">no participa en ningún espacio</span>
          <span class="stat-card__source">Calidad de Vida Cartagena 2024</span>
        </article>
        <article class="stat-card">
          <strong class="stat-card__value">45,1%</strong>
          <span class="stat-card__label">participación comunitaria (2024), tras 30,1% en 2022</span>
        </article>
        <article class="stat-card">
          <strong class="stat-card__value">3%</strong>
          <span class="stat-card__label">en Consejos de Juventud o CTP</span>
        </article>
        <article class="stat-card">
          <strong class="stat-card__value">~245 mil</strong>
          <span class="stat-card__label">jóvenes 14–28 en Cartagena (ref. departamental)</span>
        </article>
      </div>
      <p class="hero-dual__footnote">Ocupación juvenil Cartagena 2024: 34,8%. Fuentes: context.md / CONTEXTO-FASE2.</p>
    </div>

    <!-- Panel 2: marca Fíjate bien -->
    <div class="hero-dual__brand hero-panel hero-panel--inspire reveal-on-scroll reveal-delay-1">
      <p class="hero__eyebrow">Fundación Mi Sangre · Bolívar</p>
      <h1 class="hero__title hero__title--brand">Fíjate bien</h1>
      <p class="hero__lead">
        Convocatorias, empleo y espacios de participación en un solo mapa — con fuente oficial y filtro por municipio.
      </p>
      <div class="hero__actions">
        <a class="btn btn-primary" href="#oportunidades">Explorar oportunidades</a>
        <a class="btn btn-secondary" href="#mapa">Ver en mapa</a>
      </div>
    </div>
  </div>
</section>
```

| Clase | Rol |
|-------|-----|
| `.hero-dual` | Contenedor hero navy |
| `.hero-dual__grid` | Grid 1 col → 2 cols ≥900px |
| `.hero-panel` | Card semitransparente stats |
| `.hero-panel--inspire` | Panel marca + CTA |
| `.hero__title--brand` | H1 “Fíjate bien” (amarillo, Slab grande) |
| `.stats-grid` / `.stat-card` | Cifras editoriales |
| `.stat-card__value` / `__label` / `__source` | Número, texto, fuente |

---

## Chips municipio (Agente 3)

Contenedor + botones con contador. Filtrar por `data-municipio` (vacío = todos).

```html
<div class="municipio-chips reveal-on-scroll" role="group" aria-label="Filtrar por municipio">
  <p class="municipio-chips__label" id="municipio-chips-label">Municipio</p>
  <button type="button" class="chip-municipio is-active" data-municipio=""
          aria-pressed="true" aria-describedby="municipio-chips-label">
    Todos <span class="chip-municipio__count">24</span>
  </button>
  <button type="button" class="chip-municipio" data-municipio="Cartagena" aria-pressed="false">
    Cartagena <span class="chip-municipio__count">12</span>
  </button>
  <!-- generar desde listarMunicipios() + conteo -->
</div>
```

| Clase | Rol |
|-------|-----|
| `.municipio-chips` | Flex wrap de chips |
| `.chip-municipio` | Botón pill |
| `.chip-municipio.is-active` | Municipio seleccionado (navy) |
| `.chip-municipio__count` | Badge numérico |
| `aria-pressed` | Estado para accesibilidad |

En cards: `.card-oportunidad__municipio` o texto con `.chip-municipio-inline`.

**Select legacy:** `#filter-territorio` puede sincronizarse con chips; preferir filtro por campo JSON `municipio` (ver `js/data.js`).

---

## Búsqueda, tabs y listado

```html
<section id="buscar" class="section section--white section--buscar reveal-on-scroll">…</section>

<div class="search-bar">…</div>
<div class="filter-tabs" role="tablist">…</div>
<!-- municipio-chips aquí -->

<section id="oportunidades" class="section section--oportunidades">
  <h2 class="section__title">Oportunidades en Bolívar</h2>
  <p id="results-meta" class="results-meta" aria-live="polite">…</p>
  <div class="oportunidades-layout reveal-on-scroll">
    <div class="oportunidades-layout__list">
      <div id="lista-oportunidades" class="cards-grid" role="list"></div>
    </div>
    <aside class="map-panel" id="mapa">…</aside>
  </div>
</section>
```

---

## Card oportunidad

```html
<article class="card-oportunidad reveal-on-scroll" role="listitem"
         data-id="…" data-tipo="convocatoria" data-municipio="Cartagena"
         data-estado="abierta" data-lat="10.4" data-lng="-75.5">
  <header class="card-oportunidad__header">
    <span class="chip-tipo chip-tipo--convocatoria">Convocatoria</span>
    <span class="badge badge--abierta">Abierta</span>
  </header>
  <h3 class="card-oportunidad__title">Título</h3>
  <p class="card-oportunidad__org">Organización</p>
  <p class="card-oportunidad__municipio">Cartagena</p>
  <p class="card-oportunidad__place">Barrio · dirección</p>
  <p class="card-oportunidad__desc">…</p>
  <p class="card-oportunidad__dates card-oportunidad__dates--cierre">Cierra: 2026-06-15</p>
  <div class="card-oportunidad__actions">
    <a class="btn btn-sm btn-primary" href="…">Quiero vincularme</a>
    <a href="…" rel="noopener">Fuente oficial</a>
  </div>
</article>
```

| `tipo` | Chip |
|--------|------|
| convocatoria | `.chip-tipo--convocatoria` |
| empleo | `.chip-tipo--empleo` |
| evento | `.chip-tipo--evento` |
| participacion | `.chip-tipo--participacion` |
| formacion | `.chip-tipo--formacion` |
| organizacion | `.chip-tipo--organizacion` |

Cerrada: `.card-oportunidad--cerrada` + `.badge--cerrada` (sin hover lift fuerte).

**Hover:** cards suben `--lift-card` (-6px) + sombra; respetado `prefers-reduced-motion`.

---

## Animaciones (Agente 3 — JS mínimo)

### `.reveal-on-scroll`

1. Añadir clase a secciones/cards al renderizar.
2. `IntersectionObserver` → añadir `.is-visible` cuando `intersectionRatio > 0.15`.
3. Opcional stagger: `.reveal-delay-1`, `.reveal-delay-2`, `.reveal-delay-3`.

**Importante:** con `prefers-reduced-motion: reduce` el contenido ya es visible (sin ocultar por opacity).

Ejemplo:

```javascript
function initReveal() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.querySelectorAll(".reveal-on-scroll").forEach((el) => el.classList.add("is-visible"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  document.querySelectorAll(".reveal-on-scroll").forEach((el) => io.observe(el));
}
```

### Motion (impeccable)

- Curvas: `--ease-out-quart`, `--ease-out-expo` (sin bounce).
- Botones/chips: `translateY(-2px)` en hover.
- Cards: `translateY(var(--lift-card))`.

---

## Footer

```html
<footer class="site-footer">
  <div class="container site-footer__grid">
    <div class="site-footer__brand">
      <img src="…LOGO-BLANCO.svg" alt="" />
      <p class="site-footer__product">Fíjate bien</p>
      <p class="site-footer__tagline">…</p>
      <p class="site-footer__micro">Un micrositio de Fundación Mi Sangre · Bolívar</p>
    </div>
    …
  </div>
</footer>
```

---

## Accesibilidad y contraste

- Texto en navy: blanco `--ms-white` o `--color-text-muted-on-dark` (90% opacidad).
- No usar grises &lt;78% opacidad sobre `#121641` para texto importante.
- Foco: `--color-focus` / amarillo brillante, offset 3px.
- `aria-live="polite"` en `#results-meta`.
- Chips: `aria-pressed` sincronizado con `.is-active`.

---

## Referencia visual

Ritmo editorial tipo micrositios Mi Sangre ([biblioteca-lideres](https://fundacionmisangre.org), [unir-para-construir](https://fundacionmisangre.org)): mucho aire (`--section-pad-y`), títulos Slab, bloques con borde suave, CTAs pill amarillos.

## Datos

No editar JSON desde diseño. Contrato: `docs/CONTRATO.md`. Fecha sistema: **2026-05-29**.
