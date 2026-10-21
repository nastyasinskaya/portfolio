/* ============================================
   Before / after phone compare slider
   ============================================ */
(function initCompare() {
  const blocks = document.querySelectorAll('.compare-block');
  if (!blocks.length) return;

  blocks.forEach(block => {
    const compare = block.querySelector('.compare');
    const divider = block.querySelector('.compare__divider');
    const phones  = block.querySelectorAll('.phone');
    let dragging = false;

    function setDivider(clientX) {
      const rect = compare.getBoundingClientRect();
      let x = clientX - rect.left;
      x = Math.max(0, Math.min(rect.width, x));

      divider.style.left = x + 'px';

      const dividerAbsX = rect.left + x;
      phones.forEach(phone => {
        const pRect = phone.getBoundingClientRect();
        let pct = ((dividerAbsX - pRect.left) / pRect.width) * 100;
        pct = Math.max(0, Math.min(100, pct));
        const after = phone.querySelector('.phone__screen--after');
        if (after) after.style.clipPath = `inset(0 0 0 ${pct}%)`;
      });
    }

    function centerDivider() {
      const rect = compare.getBoundingClientRect();
      setDivider(rect.left + rect.width / 2);
    }

    requestAnimationFrame(centerDivider);
    window.addEventListener('resize', centerDivider, { passive: true });

    compare.addEventListener('dragstart', e => e.preventDefault());

    compare.addEventListener('pointerdown', e => {
      e.preventDefault();
      dragging = true;
      compare.setPointerCapture(e.pointerId);
      setDivider(e.clientX);
    });
    compare.addEventListener('pointermove', e => {
      if (dragging) setDivider(e.clientX);
    });
    compare.addEventListener('pointerup', () => { dragging = false; });
    compare.addEventListener('pointercancel', () => { dragging = false; });
  });
})();

/* ============================================
   Chaos badges — fall in from above on scroll
   ============================================ */
(function initChaosBadges() {
  const containers = document.querySelectorAll('.chaos-badges');
  if (!containers.length) return;

  if (!('IntersectionObserver' in window)) {
    containers.forEach(c => c.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  containers.forEach(c => observer.observe(c));
})();

/* ============================================
   Image lightbox
   ============================================ */
(function initLightbox() {
  const triggers = document.querySelectorAll('.method-card__img, .js-zoomable');
  const lightbox  = document.getElementById('lightbox');
  if (!triggers.length || !lightbox) return;

  const lightboxImg   = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');

  function open(src, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    lightboxImg.src = '';
  }

  /* Images open themselves; any other element (e.g. the easter-egg badge)
     opens the picture from data-lightbox-src */
  triggers.forEach(el => {
    const src = el.dataset.lightboxSrc || el.src;
    const alt = el.dataset.lightboxAlt || el.alt;
    el.addEventListener('click', () => open(src, alt));
    if (el.dataset.lightboxSrc) {
      el.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(src, alt); }
      });
    }
  });

  lightboxClose.addEventListener('click', close);

  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) close();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) close();
  });
})();

/* ============================================
   Phases timeline: scroll progress + active phase
   ============================================ */
(function initPhaseTimeline() {
  const timeline = document.querySelector('.js-phase-timeline');
  if (!timeline) return;

  const progress = timeline.querySelector('.phase-timeline__progress');
  const phases   = timeline.querySelectorAll('.phase');
  let ticking = false;

  function update() {
    ticking = false;
    const vh   = window.innerHeight;
    const rect = timeline.getBoundingClientRect();

    /* Line fills from when the timeline top passes 70% of the viewport
       until its bottom passes 50% */
    const start = vh * 0.7;
    const end   = vh * 0.5;
    const total = rect.height + start - end;
    const p = Math.min(Math.max((start - rect.top) / total, 0), 1);

    progress.style.height  = (p * rect.height) + 'px';
    progress.style.opacity = p > 0 ? '1' : '0';

    /* A phase is active while it overlaps the top 40% of the viewport */
    phases.forEach(phase => {
      const r = phase.getBoundingClientRect();
      phase.classList.toggle('is-active', r.top < vh * 0.4 && r.bottom > 0);
    });
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
})();

/* ============================================
   Demo presentations: tabs + slideshow per tab
   ============================================ */
(function initDemo() {
  const demo = document.querySelector('.demo');
  if (!demo) return;

  /* --- Slideshows (arrows, dots, counter, swipe, keyboard) --- */
  demo.querySelectorAll('.slideshow').forEach(show => {
    const track  = show.querySelector('.slideshow__track');
    const slides = track.children;
    const total  = slides.length;
    let index = 0;

    const prev = document.createElement('button');
    prev.className = 'slideshow__btn slideshow__btn--prev';
    prev.setAttribute('aria-label', 'Предыдущий слайд');
    prev.textContent = '←';
    const next = document.createElement('button');
    next.className = 'slideshow__btn slideshow__btn--next';
    next.setAttribute('aria-label', 'Следующий слайд');
    next.textContent = '→';
    show.append(prev, next);

    const bar   = document.createElement('div');
    bar.className = 'slideshow__bar';
    const dots  = document.createElement('div');
    dots.className = 'slideshow__dots';
    const count = document.createElement('span');
    count.className = 'slideshow__count';
    for (let i = 0; i < total; i++) {
      const dot = document.createElement('button');
      dot.className = 'slideshow__dot';
      dot.setAttribute('aria-label', 'Слайд ' + (i + 1));
      dot.addEventListener('click', () => go(i));
      dots.append(dot);
    }
    bar.append(dots, count);
    show.after(bar);

    function go(i) {
      index = Math.min(Math.max(i, 0), total - 1);
      track.style.transform = `translateX(${-index * 100}%)`;
      prev.disabled = index === 0;
      next.disabled = index === total - 1;
      [...dots.children].forEach((d, n) => d.classList.toggle('is-active', n === index));
      count.textContent = `${index + 1} / ${total}`;
    }

    prev.addEventListener('click', () => go(index - 1));
    next.addEventListener('click', () => go(index + 1));

    /* Keyboard ← → when the slideshow is focused */
    show.tabIndex = 0;
    show.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft')  go(index - 1);
      if (e.key === 'ArrowRight') go(index + 1);
    });

    /* Swipe / drag */
    let startX = null, dx = 0;
    show.addEventListener('pointerdown', e => {
      if (e.target.closest('.slideshow__btn')) return;
      startX = e.clientX; dx = 0;
      show.classList.add('is-dragging');
      show.setPointerCapture(e.pointerId);
    });
    show.addEventListener('pointermove', e => {
      if (startX === null) return;
      dx = e.clientX - startX;
      track.style.transform = `translateX(calc(${-index * 100}% + ${dx}px))`;
    });
    function end() {
      if (startX === null) return;
      show.classList.remove('is-dragging');
      const threshold = show.offsetWidth * 0.15;
      if (dx < -threshold) go(index + 1);
      else if (dx > threshold) go(index - 1);
      else go(index);
      startX = null;
    }
    show.addEventListener('pointerup', end);
    show.addEventListener('pointercancel', end);

    go(0);
  });

  /* --- Tabs --- */
  const tabs = [...demo.querySelectorAll('.demo-tab')];

  function select(tab) {
    tabs.forEach(t => {
      const on = t === tab;
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-selected', on);
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
  }

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(tab));
    tab.addEventListener('keydown', e => {
      const dir = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!dir) return;
      const nextTab = tabs[(i + dir + tabs.length) % tabs.length];
      select(nextTab);
      nextTab.focus();
    });
  });
})();

/* ============================================
   Colleague reviews: horizontal slider buttons
   ============================================ */
(function initReviews() {
  const track = document.querySelector('.reviews__grid');
  if (!track) return;
  const prev = document.querySelector('.reviews__btn--prev');
  const next = document.querySelector('.reviews__btn--next');

  function step() {
    const card = track.querySelector('.review');
    const gap  = parseFloat(getComputedStyle(track).columnGap) || 0;
    return card ? card.offsetWidth + gap : track.clientWidth;
  }

  function update() {
    const max = track.scrollWidth - track.clientWidth - 2;
    prev.disabled = track.scrollLeft <= 2;
    next.disabled = track.scrollLeft >= max;
  }

  prev.addEventListener('click', () => track.scrollBy({ left: -step() }));
  next.addEventListener('click', () => track.scrollBy({ left:  step() }));
  track.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
})();
