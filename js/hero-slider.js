/**
 * Hero slider — Fíjate bien
 * Autoplay 6s, flechas, dots, teclado. Sin swipe en móvil.
 * prefers-reduced-motion: sin autoplay.
 */

const AUTOPLAY_MS = 6000;

/**
 * @param {HTMLElement|string} rootEl
 * @returns {{ goTo: (i: number) => void, destroy: () => void }|null}
 */
export function initHeroSlider(rootEl = ".hero-slider") {
  const root =
    typeof rootEl === "string" ? document.querySelector(rootEl) : rootEl;
  if (!root) return null;

  const slides = [...root.querySelectorAll(".hero-slide")];
  const dots = [...root.querySelectorAll(".hero-slider__dot")];
  const prevBtn = root.querySelector(".hero-slider__nav--prev");
  const nextBtn = root.querySelector(".hero-slider__nav--next");

  if (slides.length === 0) return null;

  let index = slides.findIndex((s) => s.classList.contains("is-active"));
  if (index < 0) index = 0;

  let timer = null;
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  root.dataset.reducedMotion = reducedMotion ? "true" : "false";
  if (reducedMotion) {
    root.classList.add("hero-slider--reduced-motion");
  }

  /**
   * @param {number} i
   */
  function goTo(i) {
    index = ((i % slides.length) + slides.length) % slides.length;

    slides.forEach((slide, j) => {
      const active = j === index;
      slide.classList.toggle("is-active", active);
      slide.setAttribute("aria-hidden", active ? "false" : "true");
      const content = slide.querySelector(".hero-slide__content");
      if (content) {
        content.classList.toggle("hero-slide__content--visible", active);
      }
    });

    dots.forEach((dot, j) => {
      const active = j === index;
      dot.classList.toggle("is-active", active);
      dot.setAttribute("aria-current", active ? "true" : "false");
    });

    root.dispatchEvent(
      new CustomEvent("hero-slide:change", {
        detail: { index, slide: slides[index] },
      })
    );
  }

  function next() {
    goTo(index + 1);
  }

  function prev() {
    goTo(index - 1);
  }

  function startAutoplay() {
    if (reducedMotion) return;
    stopAutoplay();
    timer = window.setInterval(next, AUTOPLAY_MS);
  }

  function stopAutoplay() {
    if (timer !== null) {
      window.clearInterval(timer);
      timer = null;
    }
  }

  function onPrevClick() {
    prev();
    startAutoplay();
  }

  function onNextClick() {
    next();
    startAutoplay();
  }

  function onDotClick(e) {
    const btn = e.currentTarget;
    const target = Number(btn.dataset.slideTo);
    if (Number.isNaN(target)) return;
    goTo(target);
    startAutoplay();
  }

  function onKeyDown(e) {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      prev();
      startAutoplay();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      next();
      startAutoplay();
    }
  }

  function onFocusOut(e) {
    if (!root.contains(e.relatedTarget)) {
      startAutoplay();
    }
  }

  prevBtn?.addEventListener("click", onPrevClick);
  nextBtn?.addEventListener("click", onNextClick);
  dots.forEach((dot) => dot.addEventListener("click", onDotClick));

  root.addEventListener("mouseenter", stopAutoplay);
  root.addEventListener("mouseleave", startAutoplay);
  root.addEventListener("focusin", stopAutoplay);
  root.addEventListener("focusout", onFocusOut);
  root.addEventListener("keydown", onKeyDown);

  root.setAttribute("tabindex", "0");

  goTo(index);
  startAutoplay();

  return {
    goTo,
    destroy() {
      stopAutoplay();
      prevBtn?.removeEventListener("click", onPrevClick);
      nextBtn?.removeEventListener("click", onNextClick);
      dots.forEach((dot) => dot.removeEventListener("click", onDotClick));
      root.removeEventListener("mouseenter", stopAutoplay);
      root.removeEventListener("mouseleave", startAutoplay);
      root.removeEventListener("focusin", stopAutoplay);
      root.removeEventListener("focusout", onFocusOut);
      root.removeEventListener("keydown", onKeyDown);
    },
  };
}
