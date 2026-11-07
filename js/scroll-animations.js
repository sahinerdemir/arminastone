/**
 * Armina Stone - Luxury Scroll Motion Engine
 * Triggers smooth, hardware-accelerated fade-and-slide reveals as sections enter the viewport.
 * Automatically handles re-animation on scroll down and respects reduced-motion preferences.
 * (Excludes Hero and Footer as specified)
 */
(function () {
  'use strict';

  function initScrollAnimations() {
    // Accessibility: Respect reduced motion preferences
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('.reveal-item').forEach(el => el.classList.add('is-visible'));
      return;
    }

    const elements = document.querySelectorAll('.reveal-item');
    if (!elements.length) return;

    // Graceful fallback for legacy browsers without IntersectionObserver
    if (!('IntersectionObserver' in window)) {
      elements.forEach(el => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const rect = entry.boundingClientRect;
        const windowHeight = window.innerHeight;

        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        } else {
          // If the element has scrolled back down below the viewport,
          // remove .is-visible so it slides and fades in smoothly when scrolling back down.
          // Elements above the viewport stay visible to ensure reading comfort.
          if (rect.top > windowHeight * 0.88) {
            entry.target.classList.remove('is-visible');
          }
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    elements.forEach((el) => observer.observe(el));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollAnimations);
  } else {
    initScrollAnimations();
  }
})();
