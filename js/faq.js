/**
 * Armina Stone - FAQs Directory Controller
 * Handles category filtering, live search (desktop + mobile hero search),
 * active filter chips, result counter, and Expand/Collapse All accordion controls.
 */
document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  const directoryAccordion = document.getElementById('faqDirectoryAccordion');
  if (!directoryAccordion) return;

  const items = Array.from(directoryAccordion.querySelectorAll('.faq-item'));
  const searchInput = document.getElementById('faqSearchInput');
  const searchClearBtn = document.getElementById('faqSearchClear');
  const heroSearchInput = document.getElementById('faqHeroSearchInput');
  const heroSearchClearBtn = document.getElementById('faqHeroSearchClear');
  const filterButtons = Array.from(document.querySelectorAll('.faq-filter-btn'));
  const activeTagsContainer = document.getElementById('faqActiveTags');
  const countDisplay = document.getElementById('faqResultCount');
  const resetBtn = document.getElementById('faqResetBtn');
  const emptyResetBtn = document.getElementById('faqEmptyResetBtn');
  const emptyState = document.getElementById('faqEmptyState');
  const expandAllBtn = document.getElementById('faqExpandAllBtn');

  const CATEGORY_LABELS = {
    all: 'All Topics',
    company: 'Company & Showrooms',
    products: 'Products & Materials',
    fabrication: 'Fabrication & Install',
    care: 'Care & Maintenance'
  };

  const state = {
    searchQuery: '',
    category: 'all'
  };

  function getVisibleItems() {
    return items.filter(item => item.style.display !== 'none');
  }

  function syncExpandButtonState() {
    if (!expandAllBtn) return;
    const visible = getVisibleItems();
    const allOpen = visible.length > 0 && visible.every(item => item.open);
    expandAllBtn.setAttribute('aria-expanded', String(allOpen));
  }

  function syncSearchInputs(value) {
    if (searchInput && searchInput.value !== value) searchInput.value = value;
    if (heroSearchInput && heroSearchInput.value !== value) heroSearchInput.value = value;
    if (searchClearBtn) searchClearBtn.classList.toggle('is-visible', value.length > 0);
    if (heroSearchClearBtn) heroSearchClearBtn.classList.toggle('is-visible', value.length > 0);
  }

  function setCategory(category) {
    state.category = category;
    filterButtons.forEach(btn => {
      const isActive = btn.dataset.category === category;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', String(isActive));
    });
    applyFilters();
  }

  function resetAll() {
    state.searchQuery = '';
    syncSearchInputs('');
    setCategory('all');
  }

  function renderActiveTags() {
    if (!activeTagsContainer) return;
    activeTagsContainer.innerHTML = '';

    const tags = [{ label: 'Knowledge Base: FAQs', removable: false }];

    if (state.category !== 'all') {
      tags.push({
        label: 'Topic: ' + (CATEGORY_LABELS[state.category] || state.category),
        removable: true,
        onRemove: () => setCategory('all')
      });
    }

    if (state.searchQuery) {
      tags.push({
        label: 'Search: "' + state.searchQuery + '"',
        removable: true,
        onRemove: () => {
          state.searchQuery = '';
          syncSearchInputs('');
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
        removeBtn.type = 'button';
        removeBtn.className = 'granite-tag-remove';
        removeBtn.setAttribute('aria-label', 'Remove ' + tag.label);
        removeBtn.innerHTML = '&times;';
        removeBtn.addEventListener('click', tag.onRemove);
        chip.appendChild(removeBtn);
      }

      activeTagsContainer.appendChild(chip);
    });

    if (resetBtn) {
      const hasActiveFilters = state.category !== 'all' || state.searchQuery.length > 0;
      resetBtn.style.display = hasActiveFilters ? 'inline-block' : 'none';
    }
  }

  function applyFilters() {
    const query = state.searchQuery.toLowerCase().trim();
    let visibleCount = 0;

    items.forEach(item => {
      const category = (item.dataset.category || '').toLowerCase();
      const question = (item.querySelector('.faq-question-text')?.textContent || '').toLowerCase();
      const answer = (item.querySelector('.faq-answer')?.textContent || '').toLowerCase();
      const keywords = (item.dataset.keywords || '').toLowerCase();

      const matchesCategory = state.category === 'all' || category === state.category;
      const matchesSearch =
        !query ||
        question.includes(query) ||
        answer.includes(query) ||
        keywords.includes(query);

      if (matchesCategory && matchesSearch) {
        item.style.display = '';
        visibleCount++;
      } else {
        item.style.display = 'none';
      }
    });

    if (countDisplay) {
      countDisplay.textContent = 'Showing ' + visibleCount + ' of ' + items.length + ' questions';
    }

    if (emptyState) {
      emptyState.classList.toggle('is-visible', visibleCount === 0);
    }

    renderActiveTags();
    syncExpandButtonState();
  }

  // Event Listeners: Search inputs
  [searchInput, heroSearchInput].forEach(input => {
    if (!input) return;
    input.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      syncSearchInputs(state.searchQuery);
      applyFilters();
    });
  });

  [searchClearBtn, heroSearchClearBtn].forEach(btn => {
    if (!btn) return;
    btn.addEventListener('click', () => {
      state.searchQuery = '';
      syncSearchInputs('');
      applyFilters();
      if (searchInput && window.innerWidth > 768) searchInput.focus();
      if (heroSearchInput && window.innerWidth <= 768) heroSearchInput.focus();
    });
  });

  // Event Listeners: Category Filter Buttons
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      setCategory(btn.dataset.category || 'all');
    });
  });

  // Event Listeners: Reset
  if (resetBtn) resetBtn.addEventListener('click', resetAll);
  if (emptyResetBtn) emptyResetBtn.addEventListener('click', resetAll);

  // Event Listener: Expand / Collapse All
  if (expandAllBtn) {
    expandAllBtn.addEventListener('click', () => {
      const shouldExpand = expandAllBtn.getAttribute('aria-expanded') !== 'true';
      getVisibleItems().forEach(item => {
        item.open = shouldExpand;
      });
      syncExpandButtonState();
    });
  }

  // Sync Expand/Collapse button when individual <details> items toggle (toggle does not bubble)
  directoryAccordion.addEventListener('toggle', (e) => {
    if (e.target.matches('.faq-item')) {
      syncExpandButtonState();
    }
  }, { capture: true });

  // Initial render
  applyFilters();
});
