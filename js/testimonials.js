/**
 * Armina Stone - Testimonials Interactive Slider Controller
 * Synchronized multi-slide transition, counter updates, touch swipe & video preview
 */
(function() {
  'use strict';

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
    let isAnimating = false;

    if (totalCounter) {
      totalCounter.textContent = String(total).padStart(2, '0');
    }

    function updateCounter() {
      if (currentCounter) {
        currentCounter.textContent = String(currentIdx + 1).padStart(2, '0');
      }
    }

    function updateStackState() {
      slides.forEach((slide, idx) => {
        slide.classList.remove('is-active', 'is-next', 'is-behind', 'is-exiting', 'is-entering-prev');
        if (idx === currentIdx) {
          slide.classList.add('is-active');
          slide.setAttribute('aria-hidden', 'false');
        } else if (idx === (currentIdx + 1) % total) {
          slide.classList.add('is-next');
          slide.setAttribute('aria-hidden', 'true');
        } else {
          slide.classList.add('is-behind');
          slide.setAttribute('aria-hidden', 'true');
        }
      });
      updateCounter();
    }

    function goToNext() {
      if (isAnimating) return;
      isAnimating = true;

      const currentSlide = slides[currentIdx];
      const nextIdx = (currentIdx + 1) % total;
      const behindIdx = (currentIdx + 2) % total;

      // 1. Current active slide slides 20px up while fading out
      currentSlide.classList.remove('is-active');
      currentSlide.classList.add('is-exiting');

      // 2. Next card moves up to active position (Y: 0, scale: 1)
      slides[nextIdx].classList.remove('is-next', 'is-behind');
      slides[nextIdx].classList.add('is-active');
      slides[nextIdx].setAttribute('aria-hidden', 'false');

      // 3. Behind card moves up to next position (Y: 16px, scale: 0.96)
      slides[behindIdx].classList.remove('is-behind');
      slides[behindIdx].classList.add('is-next');
      slides[behindIdx].setAttribute('aria-hidden', 'true');

      currentIdx = nextIdx;
      updateCounter();

      // 4. Once exit animation completes, move dismissed card to behind position at bottom of stack
      setTimeout(() => {
        currentSlide.classList.remove('is-exiting');
        currentSlide.classList.add('is-behind');
        currentSlide.setAttribute('aria-hidden', 'true');
        isAnimating = false;
      }, 420);
    }

    function goToPrev() {
      if (isAnimating) return;
      isAnimating = true;

      const prevIdx = (currentIdx - 1 + total) % total;
      const targetSlide = slides[prevIdx];
      const currentSlide = slides[currentIdx];
      const nextSlideEl = slides[(currentIdx + 1) % total];

      // 1. Target slide was behind; prepare it above with entering class
      targetSlide.classList.remove('is-behind', 'is-next');
      targetSlide.classList.add('is-entering-prev');

      // Force DOM reflow so transition executes
      void targetSlide.offsetHeight;

      // 2. Animate target down to active position
      targetSlide.classList.remove('is-entering-prev');
      targetSlide.classList.add('is-active');
      targetSlide.setAttribute('aria-hidden', 'false');

      // 3. Current active slides down to next position
      currentSlide.classList.remove('is-active');
      currentSlide.classList.add('is-next');
      currentSlide.setAttribute('aria-hidden', 'true');

      // 4. Next slide moves to behind position
      nextSlideEl.classList.remove('is-next');
      nextSlideEl.classList.add('is-behind');
      nextSlideEl.setAttribute('aria-hidden', 'true');

      currentIdx = prevIdx;
      updateCounter();

      setTimeout(() => {
        isAnimating = false;
      }, 450);
    }

    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      goToPrev();
    });

    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      goToNext();
    });

    // Touch Swipe on mobile
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
            goToNext();
          } else {
            goToPrev();
          }
        }
      }, { passive: true });
    }

    // Keyboard Navigation when section in view or focused
    section.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        goToPrev();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      }
    });

    // Interactive Play Button on Video Slide triggers the YouTube cinema player
    const videoPlayBtn = section.querySelector('.testimonial-video-play-btn');
    const ytDialog = document.querySelector('#youtube-dialog');
    const ytCloseBtn = document.querySelector('#youtube-dialog-close');
    const ytIframe = document.querySelector('#youtube-dialog-iframe');

    function closeYouTubeModal() {
      if (ytIframe) ytIframe.src = '';
      if (ytDialog && ytDialog.open) ytDialog.close();
      document.body.style.overflow = '';
    }

    if (ytCloseBtn) {
      ytCloseBtn.addEventListener('click', (e) => {
        e.preventDefault();
        closeYouTubeModal();
      });
    }

    if (ytDialog) {
      ytDialog.addEventListener('close', closeYouTubeModal);
      ytDialog.addEventListener('click', (e) => {
        if (e.target === ytDialog) closeYouTubeModal();
      });
    }

    if (videoPlayBtn) {
      videoPlayBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (ytDialog && ytIframe) {
          ytIframe.src = 'https://www.youtube-nocookie.com/embed/s1V_N50dyiE?autoplay=1&rel=0';
          ytDialog.showModal();
          document.body.style.overflow = 'hidden';
        } else {
          window.open('https://www.youtube.com/watch?v=s1V_N50dyiE', '_blank', 'noopener');
        }
      });
    }

    function repositionNav() {
      const isMobile = window.innerWidth <= 1060;
      const nav = section.querySelector('.testimonials-nav');
      const actionsRow = section.querySelector('.testimonials-actions-row');
      const showcase = section.querySelector('.testimonials-showcase');

      if (!nav || !actionsRow || !showcase) return;

      if (isMobile) {
        if (nav.parentElement !== showcase) {
          showcase.appendChild(nav);
        }
      } else {
        if (nav.parentElement !== actionsRow) {
          actionsRow.appendChild(nav);
        }
      }
    }

    window.addEventListener('resize', repositionNav);
    repositionNav();
    updateStackState();
  }

  if (typeof window !== 'undefined') {
    window.initTestimonials = initTestimonials;
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initTestimonials);
    } else {
      initTestimonials();
    }
  }
})();
