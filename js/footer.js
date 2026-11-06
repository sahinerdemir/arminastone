/**
 * Armina Stone - Footer Interactivity
 * Handles mobile accordion collapsible navigation for Products, Company, Resources, and Showrooms.
 */

(function () {
  'use strict';

  function initFooterAccordion() {
    const footer = document.querySelector('.site-footer');
    if (!footer) return;

    const accordionBtns = footer.querySelectorAll('.footer-accordion-btn');

    accordionBtns.forEach((btn) => {
      btn.addEventListener('click', function () {
        // Only toggle accordion on mobile/tablet viewports
        if (window.innerWidth > 820) return;

        const item = btn.closest('.footer-accordion-item');
        if (!item) return;

        const isExpanded = item.classList.contains('is-expanded');

        // Toggle the clicked item
        if (isExpanded) {
          item.classList.remove('is-expanded');
          btn.setAttribute('aria-expanded', 'false');
        } else {
          item.classList.add('is-expanded');
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });

    // Reset expanded states if window is resized above mobile breakpoint
    window.addEventListener('resize', function () {
      if (window.innerWidth > 820) {
        accordionBtns.forEach((btn) => {
          btn.setAttribute('aria-expanded', 'false');
          const item = btn.closest('.footer-accordion-item');
          if (item) item.classList.remove('is-expanded');
        });
      }
    }, { passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFooterAccordion);
  } else {
    initFooterAccordion();
  }
})();
