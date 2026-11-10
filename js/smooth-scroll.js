/**
 * Armina Stone - Luxury Smooth Scroll Engine
 * Powered by Lenis for buttery-smooth, hardware-accelerated momentum scrolling.
 * Supports native position:sticky, modal pause/resume, and anchor link navigation.
 */
(function () {
  'use strict';

  // Respect user preference for reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  // Ensure Lenis constructor is loaded
  if (typeof window.Lenis !== 'function') {
    return;
  }

  var lenis = new Lenis({
    duration: 1.2,
    easing: function (t) {
      return Math.min(1, 1.001 - Math.pow(2, -10 * t));
    },
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 0.95,
    touchMultiplier: 1.5,
    infinite: false,
  });

  window.lenis = lenis;

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);

  // Smooth scroll for internal anchor links
  document.addEventListener('click', function (e) {
    var anchor = e.target.closest('a[href*="#"]');
    if (!anchor) return;

    var href = anchor.getAttribute('href');
    if (!href || href === '#' || href.startsWith('javascript:')) return;

    try {
      var url = new URL(anchor.href, window.location.href);
      if (url.pathname === window.location.pathname && url.hash) {
        var targetEl = document.querySelector(url.hash);
        if (targetEl) {
          e.preventDefault();
          var headerOffset = 90;
          lenis.scrollTo(targetEl, { offset: -headerOffset, duration: 1.2 });
        }
      }
    } catch (err) {
      // Graceful fallback
    }
  });

  // Automatically pause Lenis when modals / overlays lock body scroll
  if (typeof MutationObserver !== 'undefined' && document.body) {
    var bodyObserver = new MutationObserver(function () {
      if (document.body.style.overflow === 'hidden' || document.documentElement.classList.contains('lenis-stopped')) {
        lenis.stop();
      } else {
        lenis.start();
      }
    });
    bodyObserver.observe(document.body, { attributes: true, attributeFilter: ['style', 'class'] });
  }

  // Modal scroll lock helpers
  window.pauseSmoothScroll = function () {
    if (window.lenis) window.lenis.stop();
  };

  window.resumeSmoothScroll = function () {
    if (window.lenis) window.lenis.start();
  };
})();
