(() => {
  const loading = document.querySelector('.loading');
  if (loading) {
    let seen = false;
    try { seen = sessionStorage.getItem('kit-loading') === '1'; sessionStorage.setItem('kit-loading', '1'); } catch (e) { /* 保存できない設定でも動く */ }
    if (window.__kitCheck || seen || matchMedia('(prefers-reduced-motion: reduce)').matches) loading.remove();
  }

  const header = document.querySelector('.header');
  const fv = document.querySelector('.fv');
  const onScroll = () => header.classList.toggle('is-scrolled', !fv || window.scrollY > fv.offsetHeight - header.offsetHeight);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const btn = document.querySelector('.menu-btn');
  const drawer = document.querySelector('.drawer');
  if (btn && drawer) {
    const set = (open) => {
      drawer.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', String(open));
      btn.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
      document.documentElement.classList.toggle('is-locked', open);
    };
    const subs = [...drawer.querySelectorAll('.drawer__pm')];
    const setSub = (pm, open) => {
      pm.setAttribute('aria-expanded', String(open));
      pm.closest('.drawer__has-sub')?.classList.toggle('is-sub-open', open);
      const label = pm.getAttribute('aria-label') || '';
      pm.setAttribute('aria-label', open ? label.replace(/開く$/, '閉じる') : label.replace(/閉じる$/, '開く'));
    };
    subs.forEach((pm) => pm.addEventListener('click', () => setSub(pm, pm.getAttribute('aria-expanded') !== 'true')));
    btn.addEventListener('click', () => { const open = !drawer.classList.contains('is-open'); if (!open) subs.forEach((pm) => setSub(pm, false)); set(open); });
    drawer.addEventListener('click', (e) => { if (e.target.closest('a')) { subs.forEach((pm) => setSub(pm, false)); set(false); } });
    window.addEventListener('keydown', (e) => { if (e.key === 'Escape') { subs.forEach((pm) => setSub(pm, false)); set(false); } });
  }

  const enHeads = [...new Set([...document.querySelectorAll('.mask')].map((m) => m.parentElement))];
  enHeads.forEach((t) => [...t.children].filter((c) => c.classList.contains('mask')).forEach((m, i) => m.style.setProperty('--m', i)));

  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const el = en.target;
      if (el.classList.contains('rv')) {
        const sibs = [...el.parentElement.children].filter((c) => c.classList.contains('rv'));
        el.style.setProperty('--rv-delay', `${sibs.indexOf(el) * 0.12}s`);
      }
      el.classList.add('is-on');
      io.unobserve(el);
    });
  }, { rootMargin: '0px 0px -10% 0px' });
  document.querySelectorAll('.rv, .ttl__en').forEach((el) => io.observe(el));
  enHeads.forEach((el) => io.observe(el));

  document.querySelectorAll('form[data-todo]').forEach((f) => f.addEventListener('submit', (e) => e.preventDefault()));



  document.querySelectorAll('.h2, .rec-band__ttl, .sh__ttl, .svc__ttl, .ttl2__ja').forEach((h) => {
    let n = 0;
    const walk = (el) => [...el.childNodes].forEach((c) => {
      if (c.nodeType === 3) {
        const f = document.createElement('span'); f.className = 'seg';
        [...c.textContent].forEach((t) => { const sp = document.createElement('span'); sp.className = 'ch'; sp.style.setProperty('--i', n++); sp.textContent = t; f.appendChild(sp); });
        c.replaceWith(f);
      } else if (c.nodeType === 1 && c.tagName !== 'BR' && c.tagName !== 'WBR') walk(c);
    });
    walk(h);
    if (window.__kitCheck) h.classList.add('ch-on');
    else if (!h.classList.contains('rv')) io.observe(h);
  });
  const pbar = document.querySelector('.progress');
  const fls = [...document.querySelectorAll('.fl')];
  const onSc = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    if (pbar) pbar.style.setProperty('--p', max > 0 ? (scrollY / max).toFixed(4) : 0);
    fls.forEach((f, k) => { const r = f.parentElement.getBoundingClientRect(); f.style.setProperty('--py', `${((r.top + r.height / 2 - innerHeight / 2) * (0.08 + (k % 3) * 0.05)).toFixed(1)}px`); });
  };
  if (!window.__kitCheck) { window.addEventListener('scroll', onSc, { passive: true }); onSc(); }
  const cur = document.querySelector('.cursor');
  if (cur && !window.__kitCheck && matchMedia('(min-width: 960px) and (hover: hover) and (pointer: fine)').matches) {
    let x = 0, y = 0, cx = 0, cy = 0;
    window.addEventListener('mousemove', (e) => { x = e.clientX; y = e.clientY; cur.classList.add('is-on'); cur.classList.toggle('is-link', !!e.target.closest('a, button')); });
    const loop = () => { cx += (x - cx) * 0.18; cy += (y - cy) * 0.18; cur.style.transform = `translate(${cx}px, ${cy}px)`; requestAnimationFrame(loop); };
    loop();
  }

  const pio = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-on'); pio.unobserve(e.target); } }), { rootMargin: '0px 0px -15% 0px' });
  document.querySelectorAll('.pipes').forEach((el) => window.__kitCheck ? el.classList.add('is-on') : pio.observe(el));

  const slides = [...document.querySelectorAll('.fv__slide')];
  const bar = document.querySelector('.fv__bar');
  const nos = [...document.querySelectorAll('.fv__no')];
  const pause = document.querySelector('.fv__pause');
  if (slides.length > 1 && bar && !window.__kitCheck) {
    const INT = 6000;
    let cur = 0, timer = 0;
    document.documentElement.style.setProperty('--fv-int', `${INT / 1000}s`);
    const run = () => { bar.classList.remove('is-run'); void bar.offsetWidth; bar.classList.add('is-run'); timer = setTimeout(next, INT); };
    const next = () => {
      slides[cur].classList.remove('is-cur');
      cur = (cur + 1) % slides.length;
      slides[cur].classList.add('is-cur');
      nos[0].textContent = String(cur + 1).padStart(2, '0');
      nos[1].textContent = String(((cur + 1) % slides.length) + 1).padStart(2, '0');
      run();
    };
    const wait = document.querySelector('.loading') ? 2000 : 0;
    setTimeout(run, wait);
    pause?.addEventListener('click', () => {
      const stop = pause.getAttribute('aria-pressed') !== 'true';
      pause.setAttribute('aria-pressed', String(stop));
      pause.setAttribute('aria-label', stop ? '写真の切り替えを再開する' : '写真の切り替えを止める');
      if (stop) { clearTimeout(timer); bar.classList.remove('is-run'); } else run();
    });
  }
})();

(() => {
  const flips = [...document.querySelectorAll('.flip')];
  if (window.__kitCheck) { flips.forEach((el) => el.classList.add('is-on')); }
  else {
    const fio = new IntersectionObserver((es) => {
      const ins = es.filter((e) => e.isIntersecting).map((e) => e.target)
        .sort((a, b) => (a.getBoundingClientRect().top - b.getBoundingClientRect().top) || (a.getBoundingClientRect().left - b.getBoundingClientRect().left));
      ins.forEach((el, k) => { el.style.setProperty('--d', `${k * 0.09}s`); el.classList.add('is-on'); fio.unobserve(el); });
    }, { rootMargin: '0px 0px -8% 0px' });
    flips.forEach((el) => fio.observe(el));
  }
  document.querySelectorAll('.info--co, .ct__form, .anc__list').forEach((box) => [...box.children].forEach((c, i) => c.style.setProperty('--i', i)));
})();
