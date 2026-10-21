/* ============================================
   Адвент-календарь — сборка страницы из advent-data.js
   ============================================ */
(function () {
  const ISSUES = window.ADVENT_ISSUES || [];
  const MEDIA = window.ADVENT_MEDIA || {};

  /* ---------- Утилиты ---------- */
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  /* Неразрывный пробел после коротких слов, чтобы не было висячих предлогов */
  const SHORT = /(^|[\s«(—])([а-яёА-ЯЁ]{1,3}|[0-9]+)\s(?=\S)/g;
  const typo = (s) => s.replace(SHORT, '$1$2 ').replace(SHORT, '$1$2 ').replace(/\s—/g, ' —');

  /* Медиа или подписанный плейсхолдер */
  function media(m, extraClass = '') {
    const ratio = m.ratio ? ` style="aspect-ratio:${m.ratio}"` : '';
    const cls = `adv-media ${extraClass}`.trim();
    if (!m.src) {
      return `<figure class="${cls} adv-ph"${ratio}>
        <span class="adv-ph__icon" aria-hidden="true">${m.type === 'video' ? '▶' : '✦'}</span>
        <span class="adv-ph__label">${esc(m.label)}</span>
        ${m.path ? `<span class="adv-ph__path">${esc(m.path)}</span>` : ''}
      </figure>`;
    }
    if (m.type === 'video') {
      /* autoplay: без звука и по кругу, играет только на экране; иначе — по нажатию */
      const attrs = m.autoplay ? 'muted loop playsinline preload="metadata" data-autoplay' : 'preload="none" controls playsinline';
      return `<figure class="${cls}"${ratio}>
        <video src="${esc(m.src)}" ${m.poster ? `poster="${esc(m.poster)}"` : ''} ${attrs} aria-label="${esc(m.label)}"></video>
      </figure>`;
    }
    return `<figure class="${cls}"${ratio}>
      <img src="${esc(m.src)}" alt="${esc(m.alt || m.label)}" loading="lazy" class="js-zoomable">
      ${m.caption ? `<figcaption class="adv-caption">${esc(m.caption)}</figcaption>` : ''}
    </figure>`;
  }

  const paragraphs = (arr) => arr.map((p) => `<p class="adv-text">${esc(typo(p))}</p>`).join('');

  const head = (it, light) => `
    <p class="adv-eyebrow${light ? ' adv-eyebrow--light' : ''}">Выпуск ${it.num} · ${esc(it.category)}</p>
    <h2 class="adv-title">${esc(typo(it.title))}</h2>`;

  /* Плейсхолдер для текстового списка из выпуска */
  const listPh = (label) => `
    <div class="adv-list-ph" aria-label="${esc(label)}: список из выпуска">
      <span></span><span></span><span></span>
      <p class="adv-ph__path">Список — из исходного выпуска</p>
    </div>`;

  /* Слайдер видео внутри мокапа ноутбука */
  function laptopSlider(items) {
    const single = items.length === 1;
    const slides = items.map((m, i) => `
      <div class="adv-slide${i === 0 ? ' is-active' : ''}" role="group" aria-roledescription="слайд" aria-label="${i + 1} из ${items.length}: ${esc(m.label)}"${i === 0 ? '' : ' aria-hidden="true"'}>
        ${m.src
          ? `<video src="${esc(m.src)}" ${m.poster ? `poster="${esc(m.poster)}"` : ''} muted loop playsinline preload="${i === 0 ? 'metadata' : 'none'}" aria-label="${esc(m.label)}"></video>`
          : `<div class="adv-ph adv-slide__ph"><span class="adv-ph__icon" aria-hidden="true">▶</span><span class="adv-ph__label">${esc(m.label)}</span><span class="adv-ph__path">${esc(m.path)}</span></div>`}
      </div>`).join('');

    return `
      <div class="adv-lslider${single ? ' adv-lslider--single' : ''}" ${single ? `aria-label="${esc(items[0].label)}"` : 'aria-roledescription="карусель" aria-label="Результаты теста"'}>
        <div class="adv-laptop">
          <div class="adv-laptop__lid">
            <span class="adv-laptop__cam" aria-hidden="true"></span>
            <div class="adv-laptop__display">${slides}</div>
          </div>
          <div class="adv-laptop__base" aria-hidden="true"></div>
        </div>
        ${single ? '' : `<div class="adv-lslider__bar">
          <button class="adv-lslider__btn" type="button" data-dir="-1" aria-label="Предыдущий результат">←</button>
          <div class="adv-lslider__info">
            <p class="adv-lslider__label" aria-live="polite">${esc(items[0].label)}</p>
            <div class="adv-lslider__dots">
              ${items.map((m, i) => `<button class="adv-lslider__dot${i === 0 ? ' is-active' : ''}" type="button" data-to="${i}" aria-label="Результат ${i + 1}: ${esc(m.label)}"${i === 0 ? ' aria-current="true"' : ''}></button>`).join('')}
            </div>
          </div>
          <button class="adv-lslider__btn" type="button" data-dir="1" aria-label="Следующий результат">→</button>
        </div>`}
      </div>`;
  }

  /* ---------- Композиции выпусков ---------- */
  const LAYOUTS = {
    test(it) {
      const m = it.media;
      return `
      <div class="adv-wrap adv-issue__grid adv-issue__grid--test">
        <div>
          ${head(it)}
          ${paragraphs(it.body)}
        </div>
        <div class="adv-devices">
          ${laptopSlider(m.results)}
          <div class="adv-phone">${media(m.video)}</div>
        </div>
      </div>`;
    },

    library(it) {
      return `
      <div class="adv-wrap adv-issue__grid adv-issue__grid--library">
        <div>
          ${head(it)}
          ${paragraphs(it.body)}
        </div>
        ${laptopSlider([it.media.screen])}
      </div>`;
    },

    gallery(it) {
      return `
      <div class="adv-wrap adv-issue__grid adv-issue__grid--library adv-issue__grid--mirror">
        ${laptopSlider([it.media.screen])}
        <div>
          ${head(it)}
          ${paragraphs(it.body)}
        </div>
      </div>`;
    },

    picks(it) {
      return `
      <div class="adv-wrap adv-issue__grid adv-issue__grid--library">
        <div>
          ${head(it)}
          ${paragraphs(it.body)}
        </div>
        ${laptopSlider([it.media.screen])}
      </div>`;
    },

    patronus(it) {
      const m = it.media;
      return `
      <div class="adv-patronus">
        ${m.bg ? `<video class="adv-patronus__bg" src="${esc(m.bg.src)}" poster="${esc(m.bg.poster)}" muted loop playsinline autoplay preload="metadata" aria-hidden="true"></video>` : ''}
        <div class="adv-wrap adv-issue__grid adv-issue__grid--patronus">
          <div>
            ${head(it, true)}
            ${paragraphs(it.body)}
          </div>
          <div class="adv-phone">${media(m.video)}</div>
        </div>
      </div>
      <div class="adv-wrap adv-patronus__more">
        <div class="adv-gallery adv-gallery--patronus">${m.gallery.map((x) => media(x, 'adv-media--glow')).join('')}</div>
      </div>`;
    },

    gifts(it) {
      return `
      <div class="adv-wrap adv-split">
        <div>${head(it)}</div>
        <div>${paragraphs(it.body)}</div>
      </div>
      <div class="adv-wrap">
        ${laptopSlider([it.media.screen])}
      </div>`;
    },

    tree(it) {
      return `
      <div class="adv-wrap adv-issue__grid adv-issue__grid--library">
        <div>
          ${head(it)}
          ${paragraphs(it.body)}
        </div>
        ${laptopSlider([it.media.screen])}
      </div>`;
    }
  };

  /* ---------- Дверцы ---------- */
  function doors(open) {
    const list = ISSUES.map((it, i) => ({ href: `#${it.id}`, num: String(i + 1), label: it.door, title: it.doorTitle || it.title }));
    return list.map((d, i) => `
      <${open ? 'div' : 'a'} class="adv-door adv-door--${(i % 4) + 1}${open ? ' is-open' : ''}" ${open ? '' : `href="${d.href}"`}>
        <span class="adv-door__inside">
          <span class="adv-door__label">${esc(d.label)}</span>
          ${open ? '' : `<span class="adv-door__title">${esc(typo(d.title))}</span>`}
        </span>
        <span class="adv-door__front"><span class="adv-door__num">${d.num}</span></span>
      </${open ? 'div' : 'a'}>`).join('');
  }

  const $ = (id) => document.getElementById(id);

  if ($('advDoors')) $('advDoors').innerHTML = doors(false);
  if ($('advHeroLaptop')) $('advHeroLaptop').innerHTML = laptopSlider([
    { type: 'video', src: 'images/advent/hero/main.mp4', poster: 'images/advent/hero/main-poster.jpg', label: 'Адвент-календарь целиком в Figma' }
  ]);
  /* Украшения вокруг ноутбука на обложке — координаты в % от ноутбука, сняты с макета */
  const heroLaptop = document.querySelector('#advHeroLaptop .adv-laptop');
  if (heroLaptop) heroLaptop.insertAdjacentHTML('beforeend', `
    <img class="adv-deco adv-deco--heart" src="images/advent/hero/heart.png" alt="" aria-hidden="true">
    <img class="adv-deco adv-deco--bells" src="images/advent/hero/bells.png" alt="" aria-hidden="true">
    <img class="adv-deco adv-deco--deer" src="images/advent/hero/deer.png" alt="" aria-hidden="true">
    <img class="adv-deco adv-deco--call" src="images/advent/hero/call.png" alt="" aria-hidden="true">`);

  if ($('advIssues')) {
    $('advIssues').innerHTML = ISSUES.map((it) => `
      <section class="adv-section adv-issue adv-issue--${it.layout}" id="${it.id}" aria-label="Выпуск ${it.num}: ${esc(it.title)}">
        <span class="adv-issue__num" aria-hidden="true">${it.num}</span>
        ${(LAYOUTS[it.layout] || LAYOUTS.picks)(it)}
      </section>`).join('');
  }



  /* ---------- Кнопка «пауза / играть» поверх видео ---------- */
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Фоновое видео с драконом: без анимаций — стоит на первом кадре */
  if (reduceMotion) document.querySelectorAll('.adv-patronus__bg').forEach((v) => { v.autoplay = false; v.pause(); });
  const ICON_PAUSE = '<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><rect x="3.5" y="2.5" width="3" height="11" rx="1" fill="currentColor"/><rect x="9.5" y="2.5" width="3" height="11" rx="1" fill="currentColor"/></svg>';
  const ICON_PLAY = '<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M5 2.8v10.4a.8.8 0 0 0 1.2.7l8.3-5.2a.8.8 0 0 0 0-1.4L6.2 2.1A.8.8 0 0 0 5 2.8Z" fill="currentColor"/></svg>';

  /* host — куда положить кнопку; getVideo — текущее видео; onToggle(paused) — сообщить о выборе пользователя */
  function addPlayToggle(host, getVideo, onToggle) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'adv-vbtn';
    const render = () => {
      const v = getVideo();
      const playing = v && !v.paused;
      btn.innerHTML = playing ? ICON_PAUSE : ICON_PLAY;
      btn.setAttribute('aria-label', playing ? 'Поставить видео на паузу' : 'Включить видео');
      btn.hidden = !v;
    };
    const toggle = () => {
      const v = getVideo();
      if (!v) return;
      if (v.paused) { onToggle(false); v.play().catch(() => {}); }
      else { onToggle(true); v.pause(); }
    };
    btn.addEventListener('click', (e) => { e.stopPropagation(); toggle(); });
    host.addEventListener('click', (e) => { if (e.target.tagName === 'VIDEO') toggle(); });
    host.querySelectorAll('video').forEach((v) => {
      v.addEventListener('play', render);
      v.addEventListener('pause', render);
    });
    host.appendChild(btn);
    render();
    return render;
  }

  /* ---------- Слайдер в ноутбуке ---------- */

  document.querySelectorAll('.adv-lslider').forEach((slider) => {
    const slides = [...slider.querySelectorAll('.adv-slide')];
    const dots = [...slider.querySelectorAll('.adv-lslider__dot')];
    const label = slider.querySelector('.adv-lslider__label');
    let current = 0;
    let inView = false;
    let userPaused = false;
    let renderToggle = () => {};

    /* При отключённых анимациях — без автозапуска, с обычными контролами */
    if (reduceMotion) slider.querySelectorAll('video').forEach((v) => { v.controls = true; });
    else {
      renderToggle = addPlayToggle(
        slider.querySelector('.adv-laptop__display'),
        () => slides[current].querySelector('video'),
        (paused) => { userPaused = paused; }
      );
    }

    const sync = () => {
      slides.forEach((s, i) => {
        const v = s.querySelector('video');
        if (!v) return;
        if (i === current && inView && !reduceMotion && !userPaused) {
          v.preload = 'auto';
          v.play().catch(() => {});
        } else {
          v.pause();
        }
      });
    };

    const go = (i) => {
      current = (i + slides.length) % slides.length;
      slides.forEach((s, k) => {
        s.classList.toggle('is-active', k === current);
        if (k === current) s.removeAttribute('aria-hidden'); else s.setAttribute('aria-hidden', 'true');
      });
      dots.forEach((d, k) => {
        d.classList.toggle('is-active', k === current);
        if (k === current) d.setAttribute('aria-current', 'true'); else d.removeAttribute('aria-current');
      });
      const v = slides[current].querySelector('video');
      if (v) v.currentTime = 0;
      userPaused = false; /* новый слайд — снова играет */
      renderToggle();
      if (label) label.textContent = slides[current].getAttribute('aria-label').replace(/^\d+ из \d+: /, '');
      sync();
    };

    slider.querySelectorAll('[data-dir]').forEach((b) => b.addEventListener('click', () => go(current + Number(b.dataset.dir))));
    dots.forEach((d) => d.addEventListener('click', () => go(Number(d.dataset.to))));
    slider.addEventListener('keydown', (e) => {
      if (slides.length < 2) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); go(current + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(current - 1); }
    });

    /* Свайп на телефоне */
    let x0 = null;
    const display = slider.querySelector('.adv-laptop__display');
    display.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
    display.addEventListener('touchend', (e) => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 40) go(current + (dx < 0 ? 1 : -1));
      x0 = null;
    });

    /* Играет только видимое видео */
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([e]) => { inView = e.isIntersecting; sync(); }, { threshold: 0.35 }).observe(slider);
    }
  });

  /* Висячие предлоги в статичном тексте */
  document.querySelectorAll('.adv-text, .adv-lead, .adv-title, .adv-quote, .adv-role p, .adv-note').forEach((el) => {
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    let n;
    while ((n = walker.nextNode())) n.nodeValue = typo(n.nodeValue);
  });

  /* ---------- Появление при скролле ---------- */
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealEls = document.querySelectorAll('.adv-section .adv-wrap > *, .adv-door');
  if (!reduce && 'IntersectionObserver' in window) {
    revealEls.forEach((el) => el.classList.add('adv-reveal'));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach((el) => io.observe(el));
  }

  /* ---------- Лайтбокс ---------- */
  const box = $('advLightbox');
  if (box) {
    const img = box.querySelector('img');
    const closeBtn = box.querySelector('.adv-lightbox__close');
    let lastFocus = null;

    const open = (src, alt) => {
      lastFocus = document.activeElement;
      img.src = src;
      img.alt = alt || '';
      box.hidden = false;
      document.body.style.overflow = 'hidden';
      closeBtn.focus();
    };
    const close = () => {
      box.hidden = true;
      img.src = '';
      document.body.style.overflow = '';
      if (lastFocus) lastFocus.focus();
    };

    document.addEventListener('click', (e) => {
      const t = e.target.closest('.js-zoomable');
      if (t) open(t.currentSrc || t.src, t.alt);
    });
    document.querySelectorAll('.js-zoomable').forEach((el) => {
      el.tabIndex = 0;
      el.setAttribute('role', 'button');
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(el.currentSrc || el.src, el.alt); }
      });
    });
    closeBtn.addEventListener('click', close);
    box.addEventListener('click', (e) => { if (e.target === box) close(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !box.hidden) close(); });
  }

  /* Видео: ставим на паузу, когда уходят с экрана */
  if ('IntersectionObserver' in window) {
    const vio = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (!e.isIntersecting && !e.target.paused) e.target.pause(); });
    });
    document.querySelectorAll('.adv video:not(.adv-slide video):not([data-autoplay])').forEach((v) => vio.observe(v));

    /* Видео с автозапуском: играют, пока видны */
    const aio = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && !e.target.dataset.userPaused) e.target.play().catch(() => {});
        else e.target.pause();
      });
    }, { threshold: 0.3 });
    document.querySelectorAll('.adv video[data-autoplay]').forEach((v) => {
      if (reduceMotion) { v.controls = true; return; }
      addPlayToggle(v.parentElement, () => v, (paused) => {
        if (paused) v.dataset.userPaused = '1'; else delete v.dataset.userPaused;
      });
      aio.observe(v);
    });
  }
})();
