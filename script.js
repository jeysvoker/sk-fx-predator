/* =========================
  script.js
  - Keeps footer year
  - Keeps carousels (Mentor / Quantum / Chat)
  - No in-page "open details" logic (details are separate pages now)
========================= */

// Helper
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

document.addEventListener("DOMContentLoaded", () => {
  // Footer year
  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();

  // ---------- Carousel factory (supports multiple independent carousels) ----------
  function initStoryCarousel({ trackSel, viewportSel, dotsSel, prevSel, nextSel }) {
    const track = $(trackSel);
    const viewport = $(viewportSel);
    const dotsWrap = $(dotsSel);
    const btnPrev = $(prevSel);
    const btnNext = $(nextSel);

    if (!track || !viewport || !dotsWrap) return;

    let index = 0;

    const slides = () => $$(".story__slide", track);

    function clamp(n, min, max) {
      return Math.max(min, Math.min(max, n));
    }

    function renderDots() {
      dotsWrap.innerHTML = "";
      slides().forEach((_, i) => {
        const dot = document.createElement("div");
        dot.className = "story__dot" + (i === index ? " is-active" : "");
        dot.addEventListener("click", () => goTo(i));
        dotsWrap.appendChild(dot);
      });
    }

    function goTo(i) {
      const s = slides();
      if (s.length === 0) return;

      index = clamp(i, 0, s.length - 1);
      track.style.transform = `translateX(-${index * 100}%)`;
      renderDots();
    }

    if (btnPrev) btnPrev.addEventListener("click", () => goTo(index - 1));
    if (btnNext) btnNext.addEventListener("click", () => goTo(index + 1));

    // Swipe support
    let startX = 0;
    let dragging = false;

    viewport.addEventListener(
      "touchstart",
      (e) => {
        dragging = true;
        startX = e.touches[0].clientX;
      },
      { passive: true }
    );

    viewport.addEventListener("touchend", (e) => {
      if (!dragging) return;
      dragging = false;

      const endX =
        e.changedTouches && e.changedTouches[0]
          ? e.changedTouches[0].clientX
          : startX;

      const dx = endX - startX;

      if (Math.abs(dx) > 40) {
        if (dx < 0) goTo(index + 1);
        else goTo(index - 1);
      }
    });

    // Init
    goTo(0);
  }

  // Mentor carousel (details-mentor.html)
  initStoryCarousel({
    trackSel: "[data-story-track]",
    viewportSel: "[data-story-viewport]",
    dotsSel: "[data-story-dots]",
    prevSel: "[data-story-prev]",
    nextSel: "[data-story-next]"
  });

  // Quantum carousel (details-quantum.html)
  initStoryCarousel({
    trackSel: "[data-story-track-2]",
    viewportSel: "[data-story-viewport-2]",
    dotsSel: "[data-story-dots-2]",
    prevSel: "[data-story-prev-2]",
    nextSel: "[data-story-next-2]"
  });

  // Chat carousel (details-chat.html)
  initStoryCarousel({
    trackSel: "[data-story-track-3]",
    viewportSel: "[data-story-viewport-3]",
    dotsSel: "[data-story-dots-3]",
    prevSel: "[data-story-prev-3]",
    nextSel: "[data-story-next-3]"
  });
});
