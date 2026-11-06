/**
 * Armina Stone - Hero Multi-Slide Controller
 * Handles synchronized slide transitions, pagination controls, keyboard & touch swipe, and autoplay with pause.
 */

export function initHero() {
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

  function updateStoryPlayIcons() {
    if (!storyVideo || !storyPlayBtn) return;
    const isPlaying = !storyVideo.paused && !storyVideo.ended;
    const playIcon = storyPlayBtn.querySelector('.icon-play');
    const pauseIcon = storyPlayBtn.querySelector('.icon-pause');
    if (playIcon) playIcon.style.display = isPlaying ? 'none' : 'block';
    if (pauseIcon) pauseIcon.style.display = isPlaying ? 'block' : 'none';
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
        const playPromise = storyVideo.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Autoplay with sound restricted, retry muted
            storyVideo.muted = true;
            storyVideo.play().catch(() => {});
          });
        }
      }
      updateStoryPlayIcons();
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

  if (storyVideo) {
    storyVideo.addEventListener('play', updateStoryPlayIcons);
    storyVideo.addEventListener('pause', updateStoryPlayIcons);
    storyVideo.addEventListener('ended', updateStoryPlayIcons);
    storyVideo.addEventListener('click', () => {
      if (storyVideo.paused) storyVideo.play();
      else storyVideo.pause();
    });
  }

  // Kick off initial autoplay
  startAutoplay();
}
