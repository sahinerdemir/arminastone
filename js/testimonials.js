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
            updateSlider(currentIdx + 1);
          } else {
            updateSlider(currentIdx - 1);
          }
        }
      }, { passive: true });
    }

    // Keyboard Navigation when section in view or focused
    section.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        updateSlider(currentIdx - 1);
      } else if (e.key === 'ArrowRight') {
        updateSlider(currentIdx + 1);
      }
    });

    // Interactive Play Button on Slide 2 triggers the fullscreen cinema player
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

  if (typeof window !== 'undefined') {
    window.initTestimonials = initTestimonials;
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initTestimonials);
    } else {
      initTestimonials();
    }
  }
})();
