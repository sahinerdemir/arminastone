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
  const countDisplay = document.getElementById('graniteResultCount');
  const emptyState = document.getElementById('graniteEmptyState');
  const activeTagsContainer = document.getElementById('graniteActiveTags');
  const resetBtn = document.getElementById('graniteResetBtn');
  const viewSlabBtn = document.getElementById('viewModeSlab');
  const viewCloseupBtn = document.getElementById('viewModeCloseup');

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

  // Search input listeners
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      if (searchClearBtn) {
        if (state.searchQuery.length > 0) {
          searchClearBtn.classList.add('is-visible');
        } else {
          searchClearBtn.classList.remove('is-visible');
        }
      }
      applyFilters();
    });
  }

  if (searchClearBtn) {
    searchClearBtn.addEventListener('click', () => {
      state.searchQuery = '';
      if (searchInput) searchInput.value = '';
      searchClearBtn.classList.remove('is-visible');
      applyFilters();
    });
  }

  // Reset all button
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      state.searchQuery = '';
      state.selectedFinish = 'all';
      state.selectedThickness = 'all';
      state.selectedOrigin = 'all';
      if (searchInput) searchInput.value = '';
      if (searchClearBtn) searchClearBtn.classList.remove('is-visible');

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

  // View Mode Switcher (Slab vs Closeup)
  function setViewMode(mode) {
    state.viewMode = mode;
    if (mode === 'closeup') {
      viewCloseupBtn.classList.add('active');
      viewSlabBtn.classList.remove('active');
      cards.forEach(c => c.classList.add('force-closeup'));
    } else {
      viewSlabBtn.classList.add('active');
      viewCloseupBtn.classList.remove('active');
      cards.forEach(c => c.classList.remove('force-closeup'));
    }
  }

  if (viewSlabBtn && viewCloseupBtn) {
    viewSlabBtn.addEventListener('click', () => setViewMode('slab'));
    viewCloseupBtn.addEventListener('click', () => setViewMode('closeup'));
  }

  // Initialize
  applyFilters();
});
