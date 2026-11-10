/**
 * Armina Stone - Granite Collection Listing Controller
 * Handles dropdown filtering, live search, view mode toggle (Slab / Texture), active chips, and counter.
 */
document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // State
  const state = {
    searchQuery: '',
    selectedFinish: 'all',
    selectedThickness: 'all',
    selectedOrigin: 'all',
    viewMode: 'slab' // 'slab' or 'closeup'
  };

  // DOM Elements
  const cards = Array.from(document.querySelectorAll('.granite-card'));
  const searchInput = document.getElementById('graniteSearchInput');
  const searchClearBtn = document.getElementById('graniteSearchClear');
  const heroSearchInput = document.getElementById('graniteHeroSearchInput');
  const heroSearchClearBtn = document.getElementById('graniteHeroSearchClear');
  const countDisplay = document.getElementById('graniteResultCount');
  const emptyState = document.getElementById('graniteEmptyState');
  const activeTagsContainer = document.getElementById('graniteActiveTags');
  const resetBtn = document.getElementById('graniteResetBtn');
  const viewSlabBtn = document.getElementById('viewModeSlab');
  const viewCloseupBtn = document.getElementById('viewModeCloseup');
  const viewApplicationBtn = document.getElementById('viewModeApplication');

  // Dropdown Select Elements
  const finishSelect = document.getElementById('graniteFinishSelect');
  const thicknessSelect = document.getElementById('graniteThicknessSelect');
  const originSelect = document.getElementById('graniteOriginSelect');

  // Filter application logic
  function applyFilters() {
    let visibleCount = 0;
    const query = state.searchQuery.toLowerCase().trim();

    cards.forEach(card => {
      const title = (card.getAttribute('data-title') || '').toLowerCase();
      const finish = (card.getAttribute('data-finish') || '').toLowerCase();
      const thickness = (card.getAttribute('data-thickness') || '').toLowerCase();
      const origin = (card.getAttribute('data-origin') || '').toLowerCase();
      const color = (card.getAttribute('data-color') || '').toLowerCase();
      const desc = (card.getAttribute('data-desc') || '').toLowerCase();

      // Search matching
      const matchesSearch = !query || 
        title.includes(query) || 
        color.includes(query) || 
        origin.includes(query) || 
        finish.includes(query) || 
        desc.includes(query);

      // Finish filter
      const matchesFinish = state.selectedFinish === 'all' || finish.includes(state.selectedFinish);

      // Thickness filter
      const matchesThickness = state.selectedThickness === 'all' || thickness.includes(state.selectedThickness);

      // Origin filter
      const matchesOrigin = state.selectedOrigin === 'all' || origin.includes(state.selectedOrigin);

      const isMatch = matchesSearch && matchesFinish && matchesThickness && matchesOrigin;

      if (isMatch) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    // Update Counter & Empty State
    if (countDisplay) {
      countDisplay.textContent = 'Showing ' + visibleCount + ' of ' + cards.length + ' granite slabs';
    }

    if (emptyState) {
      if (visibleCount === 0) {
        emptyState.classList.add('is-visible');
      } else {
        emptyState.classList.remove('is-visible');
      }
    }

    renderActiveTags();
  }

  // Render active tags row
  function renderActiveTags() {
    if (!activeTagsContainer) return;
    activeTagsContainer.innerHTML = '';

    const tags = [];

    // Permanent category tag
    tags.push({ label: 'Stone Type: Granite', removable: false });

    if (state.selectedFinish !== 'all') {
      tags.push({
        label: 'Finish: ' + capitalize(state.selectedFinish),
        removable: true,
        reset: () => setFilter('finish', 'all')
      });
    }

    if (state.selectedThickness !== 'all') {
      tags.push({
        label: 'Thickness: ' + state.selectedThickness.toUpperCase(),
        removable: true,
        reset: () => setFilter('thickness', 'all')
      });
    }

    if (state.selectedOrigin !== 'all') {
      tags.push({
        label: 'Origin: ' + capitalize(state.selectedOrigin),
        removable: true,
        reset: () => setFilter('origin', 'all')
      });
    }

    if (state.searchQuery) {
      tags.push({
        label: 'Search: "' + state.searchQuery + '"',
        removable: true,
        reset: () => {
          state.searchQuery = '';
          if (searchInput) searchInput.value = '';
          if (searchClearBtn) searchClearBtn.classList.remove('is-visible');
          applyFilters();
        }
      });
    }

    tags.forEach(tag => {
      const chip = document.createElement('span');
      chip.className = 'granite-tag-chip';
      chip.textContent = tag.label;

      if (tag.removable) {
        const removeBtn = document.createElement('button');
        removeBtn.className = 'granite-tag-remove';
        removeBtn.innerHTML = '&times;';
        removeBtn.setAttribute('aria-label', 'Remove ' + tag.label);
        removeBtn.addEventListener('click', tag.reset);
        chip.appendChild(removeBtn);
      }

      activeTagsContainer.appendChild(chip);
    });

    const hasFilters = state.selectedFinish !== 'all' || 
                       state.selectedThickness !== 'all' || 
                       state.selectedOrigin !== 'all' || 
                       Boolean(state.searchQuery);

    if (resetBtn) {
      resetBtn.style.display = hasFilters ? 'inline-block' : 'none';
    }
  }

  function setFilter(type, value) {
    if (type === 'finish') {
      state.selectedFinish = value;
      if (finishSelect) {
        finishSelect.value = value;
        finishSelect.classList.toggle('has-value', value !== 'all');
      }
    }
    if (type === 'thickness') {
      state.selectedThickness = value;
      if (thicknessSelect) {
        thicknessSelect.value = value;
        thicknessSelect.classList.toggle('has-value', value !== 'all');
      }
    }
    if (type === 'origin') {
      state.selectedOrigin = value;
      if (originSelect) {
        originSelect.value = value;
        originSelect.classList.toggle('has-value', value !== 'all');
      }
    }

    applyFilters();
  }

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // Dropdown Change Listeners
  if (finishSelect) {
    finishSelect.addEventListener('change', (e) => {
      setFilter('finish', e.target.value);
    });
  }

  if (thicknessSelect) {
    thicknessSelect.addEventListener('change', (e) => {
      setFilter('thickness', e.target.value);
    });
  }

  if (originSelect) {
    originSelect.addEventListener('change', (e) => {
      setFilter('origin', e.target.value);
    });
  }

  // Unified Search Handler (syncs desktop and mobile inputs)
  function handleSearchQuery(val) {
    state.searchQuery = val;
    if (searchInput && searchInput.value !== val) searchInput.value = val;
    if (heroSearchInput && heroSearchInput.value !== val) heroSearchInput.value = val;

    const hasText = val.length > 0;
    if (searchClearBtn) searchClearBtn.classList.toggle('is-visible', hasText);
    if (heroSearchClearBtn) heroSearchClearBtn.classList.toggle('is-visible', hasText);

    applyFilters();
  }

  // Search input listeners
  if (searchInput) {
    searchInput.addEventListener('input', (e) => handleSearchQuery(e.target.value));
  }
  if (heroSearchInput) {
    heroSearchInput.addEventListener('input', (e) => handleSearchQuery(e.target.value));
  }

  if (searchClearBtn) {
    searchClearBtn.addEventListener('click', () => handleSearchQuery(''));
  }
  if (heroSearchClearBtn) {
    heroSearchClearBtn.addEventListener('click', () => handleSearchQuery(''));
  }

  // Reset all button
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      state.selectedFinish = 'all';
      state.selectedThickness = 'all';
      state.selectedOrigin = 'all';
      handleSearchQuery('');

      if (finishSelect) {
        finishSelect.value = 'all';
        finishSelect.classList.remove('has-value');
      }
      if (thicknessSelect) {
        thicknessSelect.value = 'all';
        thicknessSelect.classList.remove('has-value');
      }
      if (originSelect) {
        originSelect.value = 'all';
        originSelect.classList.remove('has-value');
      }

      applyFilters();
    });
  }

  // View Mode Switcher (Slab vs Closeup vs In Application)
  function setViewMode(mode) {
    state.viewMode = mode;
    if (viewSlabBtn) {
      viewSlabBtn.classList.toggle('active', mode === 'slab');
      viewSlabBtn.setAttribute('aria-pressed', mode === 'slab');
    }
    if (viewCloseupBtn) {
      viewCloseupBtn.classList.toggle('active', mode === 'closeup');
      viewCloseupBtn.setAttribute('aria-pressed', mode === 'closeup');
    }
    if (viewApplicationBtn) {
      viewApplicationBtn.classList.toggle('active', mode === 'application');
      viewApplicationBtn.setAttribute('aria-pressed', mode === 'application');
    }

    cards.forEach(c => {
      c.classList.toggle('force-closeup', mode === 'closeup');
      c.classList.toggle('force-application', mode === 'application');
    });
  }

  if (viewSlabBtn) {
    viewSlabBtn.addEventListener('click', () => setViewMode('slab'));
  }
  if (viewCloseupBtn) {
    viewCloseupBtn.addEventListener('click', () => setViewMode('closeup'));
  }
  if (viewApplicationBtn) {
    viewApplicationBtn.addEventListener('click', () => setViewMode('application'));
  }

  // Related Products Slider Controller (More Granite Slabs in Stock)
  function initRelatedCarousel() {
    const carouselWrap = document.getElementById('relatedCarouselWrap');
    if (!carouselWrap) return;

    const prevBtn = document.getElementById('relatedPrevBtn');
    const nextBtn = document.getElementById('relatedNextBtn');

    function updateArrowStates() {
      if (!prevBtn || !nextBtn) return;
      const scrollLeft = carouselWrap.scrollLeft;
      const maxScroll = carouselWrap.scrollWidth - carouselWrap.clientWidth - 8;

      prevBtn.disabled = scrollLeft <= 8;
      nextBtn.disabled = scrollLeft >= maxScroll;
    }

    function scrollCarousel(direction) {
      const firstCard = carouselWrap.querySelector('.granite-card');
      const cardWidth = firstCard ? firstCard.offsetWidth + 28 : 420;
      carouselWrap.scrollBy({
        left: direction * cardWidth,
        behavior: 'smooth'
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        scrollCarousel(-1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        scrollCarousel(1);
      });
    }

    carouselWrap.addEventListener('scroll', updateArrowStates, { passive: true });
    window.addEventListener('resize', updateArrowStates, { passive: true });

    // Initial state after layout settles
    setTimeout(updateArrowStates, 150);

    // Mouse drag-to-scroll for desktop
    let isDown = false;
    let startX = 0;
    let scrollLeftPos = 0;
    let hasMoved = false;

    carouselWrap.addEventListener('mousedown', (e) => {
      if (e.target.closest('a') || e.target.closest('button')) return;
      isDown = true;
      hasMoved = false;
      carouselWrap.classList.add('is-dragging');
      startX = e.pageX - carouselWrap.offsetLeft;
      scrollLeftPos = carouselWrap.scrollLeft;
    });

    window.addEventListener('mouseup', () => {
      if (!isDown) return;
      isDown = false;
      carouselWrap.classList.remove('is-dragging');
    });

    carouselWrap.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - carouselWrap.offsetLeft;
      const walk = (x - startX) * 1.4;
      if (Math.abs(walk) > 4) hasMoved = true;
      carouselWrap.scrollLeft = scrollLeftPos - walk;
    });

    // Prevent accidental click navigation if user dragged
    carouselWrap.addEventListener('click', (e) => {
      if (hasMoved) {
        e.preventDefault();
        e.stopPropagation();
        hasMoved = false;
      }
    }, true);
  }

  // Initialize
  applyFilters();
  initRelatedCarousel();
});
