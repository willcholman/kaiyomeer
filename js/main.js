(() => {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- NAV: solid on scroll ---------------- */
  const nav = document.querySelector('[data-nav]');
  const setNavState = () => {
    if (window.scrollY > 40) nav.classList.add('is-solid');
    else nav.classList.remove('is-solid');
  };
  setNavState();
  window.addEventListener('scroll', setNavState, { passive: true });

  /* ---------------- MOBILE NAV ---------------- */
  const mobileNav = document.querySelector('[data-mobile-nav]');
  document.querySelector('[data-menu-open]')?.addEventListener('click', () => {
    mobileNav.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  });
  const closeMobileNav = () => {
    mobileNav.classList.remove('is-open');
    document.body.style.overflow = '';
  };
  document.querySelector('[data-menu-close]')?.addEventListener('click', closeMobileNav);
  document.querySelectorAll('[data-menu-link]').forEach(link => {
    link.addEventListener('click', closeMobileNav);
  });

  /* ---------------- SEARCH OVERLAY ---------------- */
  const searchOverlay = document.querySelector('[data-search]');
  const searchInput = document.getElementById('site-search');
  document.querySelector('[data-search-open]')?.addEventListener('click', () => {
    searchOverlay.classList.add('is-open');
    setTimeout(() => searchInput?.focus(), 300);
  });
  const closeSearch = () => searchOverlay.classList.remove('is-open');
  document.querySelector('[data-search-close]')?.addEventListener('click', closeSearch);

  /* ---------------- CART DRAWER ---------------- */
  const cart = document.querySelector('[data-cart]');
  const cartOverlay = document.querySelector('[data-cart-overlay]');
  const openCart = () => {
    cart.classList.add('is-open');
    cartOverlay.classList.add('is-open');
  };
  const closeCart = () => {
    cart.classList.remove('is-open');
    cartOverlay.classList.remove('is-open');
  };
  document.querySelector('[data-cart-open]')?.addEventListener('click', openCart);
  document.querySelector('[data-cart-close]')?.addEventListener('click', closeCart);
  cartOverlay?.addEventListener('click', closeCart);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeSearch();
      closeCart();
      closeMobileNav();
    }
  });

  /* ---------------- NEWSLETTER ---------------- */
  const newsletterForm = document.querySelector('[data-newsletter]');
  const newsletterNote = document.querySelector('[data-newsletter-note]');
  newsletterForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = newsletterForm.querySelector('input[type="email"]');
    if (input.checkValidity() && input.value.trim() !== '') {
      newsletterNote.textContent = "You're on the list — welcome to Kaiyo Meer.";
      input.value = '';
    } else {
      newsletterNote.textContent = 'Enter a valid email to join.';
    }
  });

  /* ---------------- PRODUCT GALLERIES ---------------- */
  document.querySelectorAll('[data-gallery]').forEach((gallery) => {
    const slides = Array.from(gallery.querySelectorAll('[data-slide]'));
    const dots = Array.from(gallery.querySelectorAll('[data-dot]'));
    const thumbs = Array.from(gallery.querySelectorAll('[data-thumb]'));
    const prevBtn = gallery.querySelector('[data-prev]');
    const nextBtn = gallery.querySelector('[data-next]');
    let current = 0;

    const show = (index) => {
      current = (index + slides.length) % slides.length;

      slides.forEach((slide, i) => {
        const isActive = i === current;
        slide.classList.toggle('is-active', isActive);
        const video = slide.querySelector('video');
        if (video) {
          if (isActive) video.play().catch(() => {});
          else { video.pause(); video.currentTime = 0; }
        }
      });

      dots.forEach((dot, i) => dot.classList.toggle('is-active', i === current));
      thumbs.forEach((thumb, i) => thumb.classList.toggle('is-active', i === current));
    };

    prevBtn?.addEventListener('click', () => show(current - 1));
    nextBtn?.addEventListener('click', () => show(current + 1));
    dots.forEach((dot, i) => dot.addEventListener('click', () => show(i)));
    thumbs.forEach((thumb, i) => thumb.addEventListener('click', () => show(i)));

    gallery.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') show(current - 1);
      if (e.key === 'ArrowRight') show(current + 1);
    });

    /* touch swipe */
    let touchStartX = null;
    const frame = gallery.querySelector('.gallery-frame');
    frame.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
    frame.addEventListener('touchend', (e) => {
      if (touchStartX === null) return;
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 40) show(current + (dx < 0 ? 1 : -1));
      touchStartX = null;
    }, { passive: true });

    show(0);
  });

  /* ---------------- SCROLL REVEAL ---------------- */
  const revealEls = document.querySelectorAll('.reveal');
  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(el => el.classList.add('is-visible'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(el => io.observe(el));
  }
})();
