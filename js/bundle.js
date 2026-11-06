/**
 * Armina Stone - Consolidated Application Bundle (Works on both http:// and file:// protocols)
 */
(function() {
  'use strict';

  // --- Search Controller ---
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

function initSearch() {
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


  // --- Navigation Header Controller ---
  /**
 * Armina Stone - Navigation Header & Mega Menu Controller
 * Handles sticky glass navigation, pointer-travel protected mega menus, mobile accordions, and search integration.
 */



function initHeader() {
  const header = document.querySelector('.site-header');
  const megaItems = document.querySelectorAll('.nav-item.has-mega-menu');
  const mobileToggle = document.querySelector('.nav-mobile-toggle');
  const mobilePanel = document.querySelector('.mobile-nav-panel');
  const mobileClose = document.querySelector('.mobile-close-btn');

  if (!header) return;

  // 1. Sticky Navigation Scroll Detector
  let ticking = false;
  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        if (window.scrollY > 30) {
          header.classList.add('is-scrolled');
        } else {
          header.classList.remove('is-scrolled');
        }
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // initial state

  // 2. Mega Menu with Pointer Travel Grace Buffer & Keyboard Support
  megaItems.forEach((item) => {
    const trigger = item.querySelector('.nav-link');
    const menu = item.querySelector('.mega-menu');
    let closeTimer = null;

    if (!trigger || !menu) return;

    function openMenu() {
      if (closeTimer) {
        clearTimeout(closeTimer);
        closeTimer = null;
      }
      // Close other open menus
      megaItems.forEach((other) => {
        if (other !== item) {
          other.classList.remove('is-open');
          const otherTrigger = other.querySelector('.nav-link');
          if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
        }
      });
      item.classList.add('is-open');
      trigger.setAttribute('aria-expanded', 'true');
    }

    function scheduleClose() {
      // 180ms grace buffer ensures fast diagonal mouse travel never loses hover
      closeTimer = setTimeout(() => {
        item.classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');
      }, 180);
    }

    // Pointer Events: Travel Protection
    item.addEventListener('mouseenter', openMenu);
    item.addEventListener('mouseleave', scheduleClose);

    menu.addEventListener('mouseenter', () => {
      if (closeTimer) {
        clearTimeout(closeTimer);
        closeTimer = null;
      }
      openMenu();
    });
    menu.addEventListener('mouseleave', scheduleClose);

    // Click on trigger toggles menu
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const isOpen = item.classList.contains('is-open');
      if (isOpen) {
        item.classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');
      } else {
        openMenu();
      }
    });

    // Keyboard Accessibility
    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openMenu();
        const firstLink = menu.querySelector('a');
        if (firstLink) firstLink.focus();
      }
    });

    menu.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        item.classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');
        trigger.focus();
      }
    });
  });

  // Global click outside closes any open mega menu
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-item.has-mega-menu')) {
      megaItems.forEach((item) => {
        item.classList.remove('is-open');
        const trigger = item.querySelector('.nav-link');
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
      });
    }
  });

  // 3. Mobile Navigation Drawer & Accordion Tap Behavior
  if (mobileToggle && mobilePanel) {
    function openMobileMenu() {
      // If search is active, close search first
      const searchCloseBtn = document.querySelector('#search-close-btn');
      if (header && header.classList.contains('is-search-active') && searchCloseBtn) {
        searchCloseBtn.click();
      }
      mobilePanel.classList.add('is-open');
      mobileToggle.classList.add('is-active');
      if (header) header.classList.add('mobile-nav-active');
      mobileToggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
      mobilePanel.classList.remove('is-open');
      mobileToggle.classList.remove('is-active');
      if (header) header.classList.remove('mobile-nav-active');
      mobileToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    mobileToggle.addEventListener('click', (e) => {
      e.preventDefault();
      const isOpen = mobilePanel.classList.contains('is-open');
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    if (mobileClose) {
      mobileClose.addEventListener('click', closeMobileMenu);
    }

    // Mobile Accordion Tap Behavior
    const accordionTriggers = mobilePanel.querySelectorAll('.mobile-menu-item .mobile-link');
    accordionTriggers.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const parentItem = btn.closest('.mobile-menu-item');
        if (!parentItem) return;
        const sublinks = parentItem.querySelector('.mobile-sublinks');
        if (sublinks) {
          e.preventDefault();
          const isExpanded = parentItem.classList.contains('is-expanded');
          parentItem.classList.toggle('is-expanded', !isExpanded);
          btn.setAttribute('aria-expanded', (!isExpanded).toString());
        } else {
          // Normal link, close menu
          closeMobileMenu();
        }
      });
    });

    // Close when tapping leaf sublinks or action links
    mobilePanel.querySelectorAll('.mobile-sublink, .mobile-action-link').forEach((link) => {
      link.addEventListener('click', closeMobileMenu);
    });

    // Escape closes mobile panel
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobilePanel.classList.contains('is-open')) {
        closeMobileMenu();
        mobileToggle.focus();
      }
    });
  }

  // 4. Initialize Header Search Transformation
  initSearch();

  // 5. Language Switcher (EN / ES)
  const langBtns = document.querySelectorAll('.lang-btn');
  langBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetLang = btn.getAttribute('data-lang');
      langBtns.forEach((b) => {
        const isActive = b.getAttribute('data-lang') === targetLang;
        b.classList.toggle('is-active', isActive);
        b.setAttribute('aria-pressed', isActive.toString());
      });
    });
  });
}


  // --- Hero Slider Controller ---
  /**
 * Armina Stone - Hero Multi-Slide Controller
 * Handles synchronized slide transitions, pagination controls, keyboard & touch swipe, and autoplay with pause.
 */

function initHero() {
  const heroSection = document.querySelector('.hero-section');
  const bgSlides = document.querySelectorAll('.hero-bg-slide');
  const contentPanes = document.querySelectorAll('.hero-slide-pane');
  const slideBars = document.querySelectorAll('.slide-bar');
  const slideCounter = document.querySelector('.slide-counter');
  const prevBtn = document.querySelector('#slide-prev-btn');
  const nextBtn = document.querySelector('#slide-next-btn');
  const scrollIndicator = document.querySelector('.scroll-indicator');
  const storyDialog = document.querySelector('#story-dialog');
  const storyCloseBtn = document.querySelector('#story-dialog-close');
  const bgVideo = document.querySelector('.hero-bg-video');

  if (!heroSection || bgSlides.length === 0) return;

  const totalSlides = bgSlides.length;
  let currentSlide = 0;
  let autoplayTimer = null;
  let isPaused = false;
  const DEFAULT_SLIDE_DURATION = 6000; // 6 seconds for image slides
  let videoDurationMs = 38816; // Exact duration of armina-video.mp4 (~38.8s)

  // Configure background video
  if (bgVideo) {
    bgVideo.muted = true;
    bgVideo.volume = 0;
    if (bgVideo.duration && !isNaN(bgVideo.duration) && bgVideo.duration > 0) {
      videoDurationMs = Math.round(bgVideo.duration * 1000);
    }
    bgVideo.addEventListener('loadedmetadata', () => {
      if (bgVideo.duration && !isNaN(bgVideo.duration) && bgVideo.duration > 0) {
        videoDurationMs = Math.round(bgVideo.duration * 1000);
        if (currentSlide === 0) {
          updateSlideDurationCSS(videoDurationMs / 1000);
        }
      }
    });

    // When video naturally ends on Slide 1, advance to Slide 2
    bgVideo.addEventListener('ended', () => {
      if (currentSlide === 0 && !isPaused) {
        nextSlide();
      }
    });
  }

  function getSlideDuration(index) {
    if (index === 0 && videoDurationMs > 0) {
      return videoDurationMs;
    }
    return DEFAULT_SLIDE_DURATION;
  }

  function updateSlideDurationCSS(sec) {
    heroSection.style.setProperty('--slide-duration', `${sec}s`);
  }

  // 1. Core Slide Switcher Function
  function goToSlide(index) {
    if (index === currentSlide) return;

    // Wrap around
    if (index < 0) index = totalSlides - 1;
    if (index >= totalSlides) index = 0;

    // Deactivate previous
    bgSlides[currentSlide]?.classList.remove('is-active');
    contentPanes[currentSlide]?.classList.remove('is-active');
    slideBars[currentSlide]?.classList.remove('is-active', 'is-animating');

    // Activate next
    currentSlide = index;
    bgSlides[currentSlide]?.classList.add('is-active');
    contentPanes[currentSlide]?.classList.add('is-active');

    // Video Playback Control: start on slide 0, pause on other slides
    if (bgVideo) {
      if (currentSlide === 0) {
        bgVideo.currentTime = 0;
        const playPromise = bgVideo.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {});
        }
      } else {
        bgVideo.pause();
      }
    }

    // Dynamic duration for the active progress bar
    const durationMs = getSlideDuration(currentSlide);
    updateSlideDurationCSS(durationMs / 1000);

    // Update Pagination Bar
    const activeBar = slideBars[currentSlide];
    if (activeBar) {
      activeBar.classList.add('is-active');
      if (!isPaused) {
        // Reset animation
        activeBar.classList.remove('is-animating');
        void activeBar.offsetWidth; // trigger reflow
        activeBar.classList.add('is-animating');
      }
    }

    // Update Counter Text (01 / 04, 02 / 04, etc.)
    if (slideCounter) {
      const num = String(currentSlide + 1).padStart(2, '0');
      const totalPad = String(totalSlides).padStart(2, '0');
      slideCounter.textContent = `${num} / ${totalPad}`;
    }

    // Reset Autoplay Timer
    resetAutoplay();
  }

  function nextSlide() {
    goToSlide(currentSlide + 1);
  }

  function prevSlide() {
    goToSlide(currentSlide - 1);
  }

  // 2. Autoplay Controller with Dynamic Video/Image Durations
  function scheduleNextSlide() {
    if (autoplayTimer) {
      clearTimeout(autoplayTimer);
      autoplayTimer = null;
    }
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    if (!isPaused) {
      const duration = getSlideDuration(currentSlide);
      autoplayTimer = setTimeout(() => {
        if (!isPaused) {
          nextSlide();
        }
      }, duration);
    }
  }

  function startAutoplay() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    isPaused = false;
    const durationMs = getSlideDuration(currentSlide);
    updateSlideDurationCSS(durationMs / 1000);
    slideBars[currentSlide]?.classList.add('is-animating');

    if (currentSlide === 0 && bgVideo) {
      const playPromise = bgVideo.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    }

    scheduleNextSlide();
  }

  function pauseAutoplay() {
    // Never pause during video slide (Slide 0) — video must play uninterruptedly
    if (currentSlide === 0) return;

    isPaused = true;
    slideBars[currentSlide]?.classList.remove('is-animating');
    if (autoplayTimer) {
      clearTimeout(autoplayTimer);
      autoplayTimer = null;
    }
  }

  function resetAutoplay() {
    if (autoplayTimer) {
      clearTimeout(autoplayTimer);
      autoplayTimer = null;
    }
    if (!isPaused) {
      scheduleNextSlide();
    }
  }

  // Pause on hover over interactive slide controls (arrows, pagination bars) on image slides
  const heroControls = document.querySelector('.hero-controls-left');
  if (heroControls) {
    heroControls.addEventListener('mouseenter', () => {
      if (currentSlide !== 0) pauseAutoplay();
    });
    heroControls.addEventListener('mouseleave', () => {
      if (currentSlide !== 0 && (!storyDialog || !storyDialog.open)) {
        startAutoplay();
      }
    });

    // Pause on focus within controls
    heroControls.addEventListener('focusin', () => {
      if (currentSlide !== 0) pauseAutoplay();
    });
    heroControls.addEventListener('focusout', () => {
      if (currentSlide !== 0 && (!storyDialog || !storyDialog.open)) {
        startAutoplay();
      }
    });
  }

  // 3. Slide Bar Pagination Controls
  slideBars.forEach((bar, idx) => {
    bar.addEventListener('click', (e) => {
      e.preventDefault();
      goToSlide(idx);
    });

    bar.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        goToSlide(idx);
      }
    });
  });

  // Arrow Buttons (if present)
  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      prevSlide();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      nextSlide();
    });
  }

  // 4. Keyboard Navigation (ArrowLeft / ArrowRight)
  document.addEventListener('keydown', (e) => {
    // Don't interfere if typing in an input or if search is active
    if (e.target.matches('input, textarea, select')) return;
    if (document.querySelector('.site-header.is-search-active')) return;

    if (e.key === 'ArrowRight') {
      nextSlide();
    } else if (e.key === 'ArrowLeft') {
      prevSlide();
    }
  });

  // 5. Touch Swipe Support (Mobile & Tablet)
  let touchStartX = 0;
  let touchStartY = 0;

  heroSection.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
    if (currentSlide !== 0) {
      pauseAutoplay();
    }
  }, { passive: true });

  heroSection.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].screenX;
    const touchEndY = e.changedTouches[0].screenY;
    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;

    // Ensure horizontal gesture is intentional (more horizontal than vertical)
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
      if (diffX < 0) {
        nextSlide(); // Swiped left -> next
      } else {
        prevSlide(); // Swiped right -> prev
      }
    }
    startAutoplay();
  }, { passive: true });

  // 6. Subtle Parallax on Scroll (Respects Reduced Motion & Mobile)
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.matchMedia('(max-width: 768px)').matches;

  if (!prefersReducedMotion && !isMobile) {
    let ticking = false;

    function updateParallax() {
      const scrollY = window.scrollY;
      const heroHeight = heroSection.offsetHeight;

      if (scrollY <= heroHeight) {
        const parallaxOffset = (scrollY * 0.16).toFixed(1);
        heroSection.style.setProperty('--parallax-y', `${parallaxOffset}px`);
      }
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });
  }

  // 7. Scroll to Explore Action (Smooth Scroll to Verification Spacer)
  if (scrollIndicator) {
    scrollIndicator.addEventListener('click', (e) => {
      e.preventDefault();
      const spacer = document.querySelector('#sticky-verification-spacer');
      if (spacer) {
        spacer.scrollIntoView({
          behavior: prefersReducedMotion ? 'auto' : 'smooth'
        });
      } else {
        window.scrollTo({
          top: heroSection.offsetHeight,
          behavior: prefersReducedMotion ? 'auto' : 'smooth'
        });
      }
    });
  }

  // 8. Watch Our Story Fullscreen Video Modal & Controls
  const storyVideo = document.getElementById('story-video-player');
  const storyPlayBtn = document.getElementById('story-play-btn');
  const storyRestartBtn = document.getElementById('story-restart-btn');
  const storyRewind10Btn = document.getElementById('story-rewind-10-btn');
  const storyForward10Btn = document.getElementById('story-forward-10-btn');
  const storyVolumeBtn = document.getElementById('story-volume-btn');
  const storyVolumeSlider = document.getElementById('story-volume-slider');

  let lastStoryVolume = 1;

  function updateStoryPlayIcons() {
    if (!storyVideo || !storyPlayBtn) return;
    const isPlaying = !storyVideo.paused && !storyVideo.ended;
    const playIcon = storyPlayBtn.querySelector('.icon-play');
    const pauseIcon = storyPlayBtn.querySelector('.icon-pause');
    if (playIcon) playIcon.style.display = isPlaying ? 'none' : 'block';
    if (pauseIcon) pauseIcon.style.display = isPlaying ? 'block' : 'none';
  }

  function updateStoryVolumeUI() {
    if (!storyVideo) return;
    const isMuted = storyVideo.muted || storyVideo.volume === 0;
    const currentVal = isMuted ? 0 : storyVideo.volume;

    if (storyVolumeSlider) {
      storyVolumeSlider.value = currentVal;
      const pct = Math.round(currentVal * 100);
      storyVolumeSlider.style.background = `linear-gradient(to right, #CBA36E ${pct}%, rgba(255, 255, 255, 0.28) ${pct}%)`;
    }

    if (storyVolumeBtn) {
      const volHigh = storyVolumeBtn.querySelector('.icon-volume-high');
      const volMuted = storyVolumeBtn.querySelector('.icon-volume-muted');
      if (volHigh) volHigh.style.display = isMuted ? 'none' : 'block';
      if (volMuted) volMuted.style.display = isMuted ? 'block' : 'none';
      storyVolumeBtn.setAttribute('aria-label', isMuted ? 'Unmute video' : 'Mute video');
      storyVolumeBtn.title = isMuted ? 'Sesi Aç' : 'Sesi Kapat';
    }
  }

  function openStoryModal() {
    if (bgVideo) bgVideo.pause();
    isPaused = true;
    slideBars[currentSlide]?.classList.remove('is-animating');
    if (autoplayTimer) {
      clearTimeout(autoplayTimer);
      autoplayTimer = null;
    }
    if (storyDialog) {
      storyDialog.showModal();
      document.body.style.overflow = 'hidden';
      if (storyVideo) {
        storyVideo.currentTime = 0;
        storyVideo.muted = false;
        storyVideo.volume = lastStoryVolume > 0 ? lastStoryVolume : 1;
        const playPromise = storyVideo.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Autoplay with sound restricted, retry muted
            storyVideo.muted = true;
            storyVideo.play().catch(() => {});
            updateStoryVolumeUI();
          });
        }
      }
      updateStoryPlayIcons();
      updateStoryVolumeUI();
    }
  }

  function closeStoryModal() {
    if (storyVideo) {
      storyVideo.pause();
      storyVideo.currentTime = 0;
    }
    if (storyDialog && storyDialog.open) {
      storyDialog.close();
    }
    document.body.style.overflow = '';
    if (currentSlide === 0 && bgVideo) {
      bgVideo.play().catch(() => {});
    }
    startAutoplay();
  }

  document.querySelectorAll('.btn-watch-story-trigger').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openStoryModal();
    });
  });

  if (storyCloseBtn) {
    storyCloseBtn.addEventListener('click', (e) => {
      e.preventDefault();
      closeStoryModal();
    });
  }

  if (storyDialog) {
    storyDialog.addEventListener('close', () => {
      closeStoryModal();
    });

    storyDialog.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeStoryModal();
      } else if (e.key === ' ' || e.key === 'k') {
        e.preventDefault();
        if (storyVideo) {
          if (storyVideo.paused) storyVideo.play();
          else storyVideo.pause();
        }
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (storyVideo) storyVideo.currentTime = Math.max(0, storyVideo.currentTime - 10);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (storyVideo) storyVideo.currentTime = Math.min(storyVideo.duration, storyVideo.currentTime + 10);
      }
    });
  }

  // Play / Pause button
  if (storyPlayBtn && storyVideo) {
    storyPlayBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (storyVideo.paused) {
        storyVideo.play();
      } else {
        storyVideo.pause();
      }
    });
  }

  // En Başa Sar (Restart)
  if (storyRestartBtn && storyVideo) {
    storyRestartBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      storyVideo.currentTime = 0;
      storyVideo.play();
    });
  }

  // 10sn Geri
  if (storyRewind10Btn && storyVideo) {
    storyRewind10Btn.addEventListener('click', (e) => {
      e.stopPropagation();
      storyVideo.currentTime = Math.max(0, storyVideo.currentTime - 10);
    });
  }

  // 10sn İleri
  if (storyForward10Btn && storyVideo) {
    storyForward10Btn.addEventListener('click', (e) => {
      e.stopPropagation();
      storyVideo.currentTime = Math.min(storyVideo.duration, storyVideo.currentTime + 10);
    });
  }

  // Ses Aç / Kapat (Mute / Unmute Toggle)
  if (storyVolumeBtn && storyVideo) {
    storyVolumeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (storyVideo.muted || storyVideo.volume === 0) {
        storyVideo.muted = false;
        storyVideo.volume = lastStoryVolume > 0 ? lastStoryVolume : 1;
      } else {
        lastStoryVolume = storyVideo.volume;
        storyVideo.muted = true;
      }
      updateStoryVolumeUI();
    });
  }

  // Ses Seviyesi Slider
  if (storyVolumeSlider && storyVideo) {
    storyVolumeSlider.addEventListener('input', (e) => {
      e.stopPropagation();
      const val = parseFloat(storyVolumeSlider.value);
      if (val === 0) {
        storyVideo.muted = true;
      } else {
        storyVideo.muted = false;
        storyVideo.volume = val;
        lastStoryVolume = val;
      }
      updateStoryVolumeUI();
    });
  }

  if (storyVideo) {
    storyVideo.addEventListener('play', updateStoryPlayIcons);
    storyVideo.addEventListener('pause', updateStoryPlayIcons);
    storyVideo.addEventListener('ended', updateStoryPlayIcons);
    storyVideo.addEventListener('volumechange', updateStoryVolumeUI);
    storyVideo.addEventListener('click', () => {
      if (storyVideo.paused) storyVideo.play();
      else storyVideo.pause();
    });
  }

  // Kick off initial autoplay
  startAutoplay();
}

  // --- Testimonials Interactive Slider Controller ---
  function initTestimonials() {
    const section = document.querySelector('.testimonials-section');
    if (!section || section.dataset.initialized === 'true') return;
    section.dataset.initialized = 'true';

    const slides = section.querySelectorAll('.testimonial-slide');
    const prevBtn = section.querySelector('.testimonials-prev-btn');
    const nextBtn = section.querySelector('.testimonials-next-btn');
    const currentCounter = section.querySelector('.current-slide');
    const totalCounter = section.querySelector('.total-slides');
    const track = section.querySelector('.testimonials-track');

    if (!slides.length || !prevBtn || !nextBtn) return;

    let currentIdx = 0;
    const total = slides.length;

    if (totalCounter) {
      totalCounter.textContent = String(total).padStart(2, '0');
    }

    function updateSlider(newIdx) {
      if (newIdx < 0) newIdx = total - 1;
      if (newIdx >= total) newIdx = 0;

      currentIdx = newIdx;

      slides.forEach((slide, idx) => {
        const isActive = idx === currentIdx;
        slide.classList.toggle('is-active', isActive);
        slide.setAttribute('aria-hidden', (!isActive).toString());
      });

      if (currentCounter) {
        currentCounter.textContent = String(currentIdx + 1).padStart(2, '0');
      }

      if (currentIdx === 0) {
        prevBtn.classList.remove('is-primary');
        nextBtn.classList.add('is-primary');
      } else if (currentIdx === total - 1) {
        prevBtn.classList.add('is-primary');
        nextBtn.classList.remove('is-primary');
      } else {
        prevBtn.classList.add('is-primary');
        nextBtn.classList.add('is-primary');
      }
    }

    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      updateSlider(currentIdx - 1);
    });

    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      updateSlider(currentIdx + 1);
    });

    if (track) {
      let touchStartX = 0;
      let touchStartY = 0;
      let touchEndX = 0;
      let touchEndY = 0;

      track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
      }, { passive: true });

      track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        const diffX = touchEndX - touchStartX;
        const diffY = touchEndY - touchStartY;
        if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
          if (diffX < 0) {
            updateSlider(currentIdx + 1);
          } else {
            updateSlider(currentIdx - 1);
          }
        }
      }, { passive: true });
    }

    section.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        updateSlider(currentIdx - 1);
      } else if (e.key === 'ArrowRight') {
        updateSlider(currentIdx + 1);
      }
    });

    const videoPlayBtn = section.querySelector('.testimonial-video-play-btn');
    if (videoPlayBtn) {
      videoPlayBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const storyDialog = document.querySelector('#story-dialog');
        if (storyDialog) {
          const storyTrigger = document.querySelector('.btn-watch-story-trigger');
          if (storyTrigger) {
            storyTrigger.click();
          } else {
            storyDialog.showModal();
          }
        }
      });
    }

    updateSlider(0);
  }

  // Initialize on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initHeader();
      initHero();
      initTestimonials();
    });
  } else {
    initHeader();
    initHero();
    initTestimonials();
  }
  // URL Param Test Automation Hook for Visual Verification
  const urlParams = new URLSearchParams(window.location.search);
  const testState = urlParams.get('test');

  function applyTestState() {
    if (testState === 'products-megamenu') {
      const prodItem = document.querySelector('.nav-item.has-mega-menu');
      if (prodItem) {
        prodItem.classList.add('is-open');
        const trigger = prodItem.querySelector('.nav-link');
        if (trigger) trigger.setAttribute('aria-expanded', 'true');
      }
    } else if (testState === 'search') {
      const searchTrigger = document.querySelector('.nav-search-btn');
      if (searchTrigger) searchTrigger.click();
      const input = document.querySelector('#site-search-input');
      if (input) {
        input.value = 'marble';
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
    } else if (testState === 'slide2') {
      const bar2 = document.querySelectorAll('.slide-bar')[1];
      if (bar2) bar2.click();
    } else if (testState === 'slide3') {
      const bar3 = document.querySelectorAll('.slide-bar')[2];
      if (bar3) bar3.click();
    } else if (testState === 'mobile-menu') {
      const mobileToggle = document.querySelector('.nav-mobile-toggle');
      if (mobileToggle) mobileToggle.click();
      const firstAccordion = document.querySelector('.mobile-menu-item .mobile-link');
      if (firstAccordion) firstAccordion.click();
    } else if (testState === 'about-menu') {
      const items = document.querySelectorAll('.nav-item.has-mega-menu');
      if (items[3]) {
        items[3].classList.add('is-open');
        const trigger = items[3].querySelector('.nav-link');
        if (trigger) trigger.setAttribute('aria-expanded', 'true');
      }
    } else if (testState === 'showrooms-menu') {
      const items = document.querySelectorAll('.nav-item.has-mega-menu');
      if (items[4]) {
        items[4].classList.add('is-open');
        const trigger = items[4].querySelector('.nav-link');
        if (trigger) trigger.setAttribute('aria-expanded', 'true');
      }
    } else if (testState === 'scroll') {
      window.scrollTo(0, 650);
      const header = document.querySelector('.site-header');
      if (header) header.classList.add('is-scrolled');
    }
  }
  applyTestState();
  window.addEventListener('DOMContentLoaded', applyTestState);
  window.addEventListener('load', applyTestState);

  if (testState === 'products-megamenu') {
    setTimeout(() => {
      const prodItem = document.querySelector('.nav-item.has-mega-menu');
      if (prodItem) {
        prodItem.classList.add('is-open');
        const trigger = prodItem.querySelector('.nav-link');
        if (trigger) trigger.setAttribute('aria-expanded', 'true');
      }
    }, 200);
  } else if (testState === 'search') {
    setTimeout(() => {
      const searchTrigger = document.querySelector('.nav-search-btn');
      if (searchTrigger) searchTrigger.click();
      const input = document.querySelector('#site-search-input');
      if (input) {
        input.value = 'marble';
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }, 200);
  } else if (testState === 'slide2') {
    setTimeout(() => {
      const bar2 = document.querySelectorAll('.slide-bar')[1];
      if (bar2) bar2.click();
    }, 200);
  } else if (testState === 'slide3') {
    setTimeout(() => {
      const bar3 = document.querySelectorAll('.slide-bar')[2];
      if (bar3) bar3.click();
    }, 200);
  } else if (testState === 'scroll') {
    setTimeout(() => {
      window.scrollTo(0, 500);
    }, 200);
  }

})();
