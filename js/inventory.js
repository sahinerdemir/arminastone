/**
 * Armina Stone - Section 3: Featured Inventory Engine
 * Handles genuine multi-page carousel sliding, touch swipe, responsive pagination,
 * and category filtering (All Materials, Marble, Quartzite, Granite, Quartz, Porcelain, Onyx).
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    const section = document.getElementById('inventory');
    if (!section) return;

    const slider = section.querySelector('.inventory-slider');
    const track = section.querySelector('.inventory-track');
    const filterBtns = section.querySelectorAll('.inventory-filter-btn');
    const allCards = Array.from(section.querySelectorAll('.inventory-card'));
    const paginationText = document.getElementById('inventory-pagination-text');
    const paginationThumb = document.getElementById('inventory-pagination-thumb');
    const prevBtn = document.getElementById('inventory-prev-btn');
    const nextBtn = document.getElementById('inventory-next-btn');

    if (!track || allCards.length === 0) return;

    let currentFilter = 'all';
    let currentPage = 0;
    let cardsPerView = getCardsPerView();
    let visibleCards = [...allCards];
    let totalPages = 1;

    function getCardsPerView() {
      const w = window.innerWidth;
      if (w <= 640) return 1;
      if (w <= 1180) return 2;
      return 4;
    }

    function calculateMetrics() {
      cardsPerView = getCardsPerView();
      visibleCards = allCards.filter(card => !card.classList.contains('is-hidden'));
      totalPages = Math.max(1, Math.ceil(visibleCards.length / cardsPerView));
      if (currentPage >= totalPages) {
        currentPage = Math.max(0, totalPages - 1);
      }
    }

    function updateSlider(animate = true) {
      calculateMetrics();

      if (!animate) {
        track.classList.add('no-transition');
      } else {
        track.classList.remove('no-transition');
      }

      if (visibleCards.length === 0) {
        track.style.transform = 'translateX(0px)';
        if (paginationText) paginationText.textContent = '00 / 00';
        if (paginationThumb) paginationThumb.style.width = '0%';
        if (prevBtn) prevBtn.disabled = true;
        if (nextBtn) nextBtn.disabled = true;
        return;
      }

      // Calculate sliding offset
      // Each page advances by cardsPerView cards
      const gap = parseFloat(window.getComputedStyle(track).gap) || 20;
      const firstCard = visibleCards[0];
      const cardWidth = firstCard.getBoundingClientRect().width;
      const stepWidth = (cardWidth + gap) * cardsPerView;

      let targetOffset = currentPage * stepWidth;

      // Bound max offset so cards don't overscroll past the end
      const totalWidth = (visibleCards.length * cardWidth) + ((visibleCards.length - 1) * gap);
      const viewportWidth = slider.getBoundingClientRect().width;
      const maxOffset = Math.max(0, totalWidth - viewportWidth);

      if (targetOffset > maxOffset) {
        targetOffset = maxOffset;
      }

      track.style.transform = `translateX(-${targetOffset}px)`;

      // Update Pagination UI
      const displayPage = String(currentPage + 1).padStart(2, '0');
      const displayTotal = String(totalPages).padStart(2, '0');
      if (paginationText) {
        paginationText.textContent = `${displayPage} / ${displayTotal}`;
      }

      if (paginationThumb) {
        const thumbPct = Math.max(25, 100 / totalPages);
        paginationThumb.style.width = `${thumbPct}%`;
        const maxThumbMove = 100 - thumbPct;
        const currentThumbMove = totalPages > 1 ? (currentPage / (totalPages - 1)) * maxThumbMove : 0;
        paginationThumb.style.transform = `translateX(${currentThumbMove}%)`;
      }

      // Update Prev / Next Buttons State
      if (prevBtn) {
        prevBtn.disabled = (currentPage === 0);
      }
      if (nextBtn) {
        nextBtn.disabled = (currentPage >= totalPages - 1);
      }

      if (!animate) {
        // Restore transition after immediate layout
        requestAnimationFrame(() => {
          track.classList.remove('no-transition');
        });
      }
    }

    function goToPage(page) {
      currentPage = Math.max(0, Math.min(page, totalPages - 1));
      updateSlider(true);
    }

    function applyFilter(filter) {
      currentFilter = filter;
      currentPage = 0;

      allCards.forEach((card) => {
        const cat = card.getAttribute('data-category');
        const matches = (filter === 'all' || cat === filter);
        if (matches) {
          card.classList.remove('is-hidden');
          card.style.opacity = '1';
        } else {
          card.classList.add('is-hidden');
          card.style.opacity = '0';
        }
      });

      updateSlider(false);
    }

    // Filter Buttons Click
    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterBtns.forEach((b) => {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');

        const filter = btn.getAttribute('data-filter') || 'all';
        applyFilter(filter);
      });
    });

    // Arrow Buttons Click
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (currentPage > 0) {
          goToPage(currentPage - 1);
        }
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (currentPage < totalPages - 1) {
          goToPage(currentPage + 1);
        }
      });
    }

    // Keyboard Arrow Navigation when section is focused
    section.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        if (currentPage > 0) goToPage(currentPage - 1);
      } else if (e.key === 'ArrowRight') {
        if (currentPage < totalPages - 1) goToPage(currentPage + 1);
      }
    });

    // Touch Swipe Support
    let startX = 0;
    let currentX = 0;
    let isTouching = false;

    slider.addEventListener('touchstart', (e) => {
      if (e.touches.length !== 1) return;
      startX = e.touches[0].clientX;
      currentX = startX;
      isTouching = true;
    }, { passive: true });

    slider.addEventListener('touchmove', (e) => {
      if (!isTouching || e.touches.length !== 1) return;
      currentX = e.touches[0].clientX;
    }, { passive: true });

    slider.addEventListener('touchend', () => {
      if (!isTouching) return;
      isTouching = false;
      const diffX = startX - currentX;
      const threshold = 40; // min swipe distance in px

      if (diffX > threshold && currentPage < totalPages - 1) {
        goToPage(currentPage + 1);
      } else if (diffX < -threshold && currentPage > 0) {
        goToPage(currentPage - 1);
      }
    });

    // Resize Observer / Window Resize Handler
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        updateSlider(false);
      }, 100);
    });

    // Initial setup
    updateSlider(false);
  });
})();
