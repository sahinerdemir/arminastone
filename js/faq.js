/**
 * Armina Stone - FAQs Directory Controller
 * Handles topic pill filtering, product category dropdown filtering, live search
 * (desktop + mobile hero search), exclusive click accordion behavior, and Expand/Collapse All.
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
  const productSelect = document.getElementById('faqProductSelect');
  const emptyResetBtn = document.getElementById('faqEmptyResetBtn');
  const emptyState = document.getElementById('faqEmptyState');
  const expandAllBtn = document.getElementById('faqExpandAllBtn');

  const state = {
    searchQuery: '',
    category: 'all',
    product: 'all'
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
    state.product = 'all';
    syncSearchInputs('');
    if (productSelect) productSelect.value = 'all';
    setCategory('all');
  }

  function applyFilters() {
    const query = state.searchQuery.toLowerCase().trim();
    let visibleCount = 0;

    items.forEach(item => {
      const category = (item.dataset.category || '').toLowerCase();
      const products = (item.dataset.product || '').toLowerCase().split(',').map(s => s.trim()).filter(Boolean);
      const question = (item.querySelector('.faq-question-text')?.textContent || '').toLowerCase();
      const answer = (item.querySelector('.faq-answer')?.textContent || '').toLowerCase();
      const keywords = (item.dataset.keywords || '').toLowerCase();

      const matchesCategory = state.category === 'all' || category === state.category;
      const matchesProduct = state.product === 'all' || products.includes(state.product);
      const matchesSearch =
        !query ||
        question.includes(query) ||
        answer.includes(query) ||
        keywords.includes(query);

      if (matchesCategory && matchesProduct && matchesSearch) {
        item.style.display = '';
        visibleCount++;
      } else {
        item.style.display = 'none';
      }
    });

    if (emptyState) {
      emptyState.classList.toggle('is-visible', visibleCount === 0);
    }

    syncExpandButtonState();
  }

  // Exclusive accordion behavior on individual item click (closes previously open item)
  directoryAccordion.addEventListener('click', (e) => {
    const summary = e.target.closest('.faq-question');
    if (!summary) return;
    const clickedItem = summary.parentElement;
    if (!clickedItem || !clickedItem.classList.contains('faq-item')) return;

    // If it's currently closed, browser will open it -> close all other open items
    if (!clickedItem.open) {
      items.forEach(item => {
        if (item !== clickedItem && item.open) {
          item.open = false;
        }
      });
    }
  });

  // Search inputs (desktop toolbar + mobile hero)
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

  // Topic Filter Buttons
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      setCategory(btn.dataset.category || 'all');
    });
  });

  // Product Category Dropdown
  if (productSelect) {
    productSelect.addEventListener('change', (e) => {
      state.product = (e.target.value || 'all').toLowerCase();
      applyFilters();
    });
  }

  // Empty State Reset
  if (emptyResetBtn) emptyResetBtn.addEventListener('click', resetAll);

  // Expand / Collapse All
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
