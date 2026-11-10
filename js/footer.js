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

  function initBackToTop() {
    let btn = document.getElementById('backToTopBtn');
    if (!btn) {
      btn = document.createElement('button');
      btn.id = 'backToTopBtn';
      btn.type = 'button';
      btn.className = 'back-to-top-btn';
      btn.setAttribute('aria-label', 'Back to top');
      btn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <line x1="12" y1="19" x2="12" y2="5"></line>
          <polyline points="5 12 12 5 19 12"></polyline>
        </svg>
      `;
      document.body.appendChild(btn);
    }

    let isVisible = false;
    let ticking = false;

    function updateVisibility() {
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      const shouldShow = scrollY > 320;
      if (shouldShow !== isVisible) {
        isVisible = shouldShow;
        btn.classList.toggle('is-visible', isVisible);
      }
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(updateVisibility);
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    updateVisibility();

    btn.addEventListener('click', function () {
      btn.blur();
      if (window.lenis) {
        window.lenis.scrollTo(0, { duration: 1.2 });
      } else {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
    });
  }

  function initAll() {
    initFooterAccordion();
    initBackToTop();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();
