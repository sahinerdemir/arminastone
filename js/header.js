/**
 * Armina Stone - Navigation Header & Mega Menu Controller
 * Handles sticky glass navigation, pointer-travel protected mega menus, mobile accordions, and search integration.
 */

import { initSearch } from './search.js';

export function initHeader() {
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

  // 5. Language Switcher (Dropdown & Mobile Compatibility)
  const langDropdown = document.getElementById('navLangDropdown');
  const langTrigger = document.getElementById('navLangTrigger');
  const langCurrentLabel = document.querySelector('.nav-lang-current');
  const langOptions = document.querySelectorAll('.nav-lang-option');
  const mobileLangBtns = document.querySelectorAll('.mobile-lang-switch .lang-btn');

  function setLanguage(targetLang) {
    const langUpper = targetLang.toUpperCase();
    if (langCurrentLabel) {
      langCurrentLabel.textContent = langUpper;
    }

    // Update dropdown options
    langOptions.forEach(opt => {
      const isSelected = opt.getAttribute('data-lang') === targetLang;
      opt.classList.toggle('is-selected', isSelected);
      const parentLi = opt.closest('li');
      if (parentLi) {
        parentLi.setAttribute('aria-selected', isSelected.toString());
      }
    });

    // Update mobile buttons
    mobileLangBtns.forEach(btn => {
      const isActive = btn.getAttribute('data-lang') === targetLang;
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-pressed', isActive.toString());
    });

    // Close dropdown
    if (langDropdown) {
      langDropdown.classList.remove('is-open');
    }
    if (langTrigger) {
      langTrigger.setAttribute('aria-expanded', 'false');
    }
  }

  // Toggle Dropdown
  if (langTrigger && langDropdown) {
    langTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = langDropdown.classList.toggle('is-open');
      langTrigger.setAttribute('aria-expanded', isOpen.toString());
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!langDropdown.contains(e.target)) {
        langDropdown.classList.remove('is-open');
        langTrigger.setAttribute('aria-expanded', 'false');
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && langDropdown.classList.contains('is-open')) {
        langDropdown.classList.remove('is-open');
        langTrigger.setAttribute('aria-expanded', 'false');
        langTrigger.focus();
      }
    });
  }

  // Option Clicks
  langOptions.forEach(opt => {
    opt.addEventListener('click', (e) => {
      e.preventDefault();
      const targetLang = opt.getAttribute('data-lang');
      if (targetLang) setLanguage(targetLang);
    });
  });

  // Mobile drawer clicks
  mobileLangBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetLang = btn.getAttribute('data-lang');
      if (targetLang) setLanguage(targetLang);
    });
  });
}
