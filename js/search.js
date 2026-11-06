/**
 * Armina Stone - Live Site Search Controller
 * Transforms header into full white search interface with live catalog matching
 */

// Genuine Armina Stone catalog dataset for real site search integration
const SEARCH_CATALOG = [
  {
    title: 'Calacatta Gold Marble',
    subtitle: 'Classic Italian marble with warm golden veining',
    category: 'Marble',
    thumb: './assets/images/products/marble-square.jpg',
    url: '#products'
  },
  {
    title: 'Taj Mahal Quartzite',
    subtitle: 'Premier Brazilian quartzite with soft crystalline layers',
    category: 'Quartzite',
    thumb: './assets/images/products/quartzite-square.jpg',
    url: '#products'
  },
  {
    title: 'Super White Quartzite',
    subtitle: 'High-contrast dramatic marble-look durable quartzite',
    category: 'Quartzite',
    thumb: './assets/images/products/quartzite-square.jpg',
    url: '#products'
  },
  {
    title: 'Nero Marquina Marble',
    subtitle: 'Striking black Spanish marble with crisp white calcite veins',
    category: 'Marble',
    thumb: './assets/images/products/granite-square.jpg',
    url: '#products'
  },
  {
    title: 'Black Galaxy Granite',
    subtitle: 'Deep obsidian natural granite with reflective bronzite flecks',
    category: 'Granite',
    thumb: './assets/images/products/granite-square.jpg',
    url: '#products'
  },
  {
    title: 'Calacatta Volar Quartz',
    subtitle: 'Engineered non-porous luxury quartz with bold feathering',
    category: 'Quartz',
    thumb: './assets/images/products/quartz-square.jpg',
    url: '#products'
  },
  {
    title: 'Cristallo Translucent Onyx',
    subtitle: 'Backlit statement exotic stone for custom bars and feature walls',
    category: 'Onyx',
    thumb: './assets/images/products/onyx-square.jpg',
    url: '#products'
  },
  {
    title: 'Large-Format Porcelain Slabs',
    subtitle: 'Ultra-compact heat and UV-proof contemporary surfaces',
    category: 'Porcelain',
    thumb: './assets/images/products/porcelain-square.jpg',
    url: '#products'
  },
  {
    title: 'Cheswick Flagship Showroom & HQ',
    subtitle: '1136 Freeport Rd, Cheswick PA • 50,000 sq ft Indoor Slab Gallery',
    category: 'Showroom',
    thumb: './assets/images/showrooms/cheswick-square.jpg',
    url: '#showrooms'
  },
  {
    title: 'Robinson Township Showroom',
    subtitle: '1000 Park Manor Blvd, Robinson Twp PA • Premier Design Center',
    category: 'Showroom',
    thumb: './assets/images/showrooms/robinson-square.jpg',
    url: '#showrooms'
  },
  {
    title: 'Cranberry Township Showroom',
    subtitle: '20400 Route 19, Cranberry Twp PA • North Hills Design Studio',
    category: 'Showroom',
    thumb: './assets/images/showrooms/cranberry-square.jpg',
    url: '#showrooms'
  },
  {
    title: 'Residential Kitchen Installations',
    subtitle: 'Waterfall islands, bookmatched backsplashes, and custom vanities',
    category: 'Projects',
    thumb: './assets/images/projects/residential-square.jpg',
    url: '#projects'
  },
  {
    title: 'Commercial & Hospitality Portfolios',
    subtitle: 'Architectural stone engineering for hotel lobbies and executive suites',
    category: 'Projects',
    thumb: './assets/images/projects/commercial-square.jpg',
    url: '#projects'
  },
  {
    title: 'Live Slabs Inventory (1,200+ Slabs)',
    subtitle: 'Real-time warehouse slab browsing with high-resolution photography',
    category: 'Inventory',
    thumb: './assets/images/products/slabs-square.jpg',
    url: '#inventory'
  }
];

export function initSearch() {
  const header = document.querySelector('.site-header');
  const searchTrigger = document.querySelector('.nav-search-btn');
  const searchCloseBtn = document.querySelector('#search-close-btn');
  const searchInput = document.querySelector('#site-search-input');
  const resultsPanel = document.querySelector('#search-results-panel');

  if (!header || !searchTrigger || !searchInput || !searchCloseBtn) return;

  function openSearch() {
    const mobilePanel = document.querySelector('.mobile-nav-panel');
    const mobileToggle = document.querySelector('.nav-mobile-toggle');
    if (mobilePanel && mobilePanel.classList.contains('is-open')) {
      mobilePanel.classList.remove('is-open');
      if (mobileToggle) {
        mobileToggle.classList.remove('is-active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
      header.classList.remove('mobile-nav-active');
      document.body.style.overflow = '';
    }
    header.classList.add('is-search-active');
    searchTrigger.setAttribute('aria-expanded', 'true');
    // Autofocus input
    setTimeout(() => {
      searchInput.focus();
    }, 50);
  }

  function closeSearch() {
    header.classList.remove('is-search-active');
    searchTrigger.setAttribute('aria-expanded', 'false');
    searchInput.value = '';
    if (resultsPanel) {
      resultsPanel.classList.remove('has-results');
      resultsPanel.innerHTML = '';
    }
    searchTrigger.focus();
  }

  searchTrigger.addEventListener('click', (e) => {
    e.preventDefault();
    openSearch();
  });

  searchCloseBtn.addEventListener('click', (e) => {
    e.preventDefault();
    closeSearch();
  });

  // Keyboard support: Escape closes search, Enter navigates top result
  document.addEventListener('keydown', (e) => {
    if (header.classList.contains('is-search-active')) {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeSearch();
      }
    }
  });

  // Real-time catalog search filtering
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim().toLowerCase();

    if (!resultsPanel) return;

    if (query.length === 0) {
      resultsPanel.classList.remove('has-results');
      resultsPanel.innerHTML = '';
      return;
    }

    const matches = SEARCH_CATALOG.filter((item) => {
      return (
        item.title.toLowerCase().includes(query) ||
        item.subtitle.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
      );
    });

    if (matches.length > 0) {
      resultsPanel.innerHTML = `
        <div class="search-results-header">
          <span class="search-results-count">${matches.length} matching result${matches.length > 1 ? 's' : ''} found</span>
        </div>
        <ul class="search-results-list">
          ${matches.slice(0, 6).map((item) => `
            <li>
              <a href="${item.url}" class="search-result-item" data-title="${item.title}">
                <div class="search-result-thumb">
                  <img src="${item.thumb}" alt="${item.title}" loading="lazy">
                </div>
                <div class="search-result-details">
                  <span class="search-result-title">${item.title}</span>
                  <span class="search-result-sub">${item.subtitle}</span>
                </div>
                <span class="search-result-category">${item.category}</span>
              </a>
            </li>
          `).join('')}
        </ul>
      `;
      resultsPanel.classList.add('has-results');

      // Click on result closes search and navigates
      resultsPanel.querySelectorAll('.search-result-item').forEach((link) => {
        link.addEventListener('click', () => {
          closeSearch();
        });
      });
    } else {
      resultsPanel.innerHTML = `
        <div class="search-empty-state">
          <p>No matching surfaces found for "<strong>${searchInput.value.replace(/</g, '&lt;')}</strong>"</p>
          <p style="margin-top: 6px; font-size: 13px; opacity: 0.7;">Browse our live slab warehouse or contact our showroom team at (412) 555-0199.</p>
        </div>
      `;
      resultsPanel.classList.add('has-results');
    }
  });

  // Enter key selects top match
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const topResult = resultsPanel?.querySelector('.search-result-item');
      if (topResult) {
        topResult.click();
      }
    }
  });
}
