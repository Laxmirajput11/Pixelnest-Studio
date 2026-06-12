document.addEventListener('DOMContentLoaded', () => {

  // ── Helper: safe IntersectionObserver creation ──
  const createObserver = (cb, opts) => {
    if (!('IntersectionObserver' in window)) return null;
    try { return new IntersectionObserver(cb, opts); }
    catch (e) { return null; }
  };

  // ── Navbar: floating pill on scroll ──
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const toggleScrolled = () => navbar.classList.toggle('scrolled', window.scrollY > 40);
    toggleScrolled();
    window.addEventListener('scroll', toggleScrolled);
  }

  // ── Mobile nav menu ──
  const navToggle = document.getElementById('navToggle');
  const navMobile = document.getElementById('navMobile');
  if (navToggle && navMobile) {
    const iconMenu = navToggle.querySelector('.icon-menu');
    const iconClose = navToggle.querySelector('.icon-close');

    const setOpen = (open) => {
      navMobile.classList.toggle('open', open);
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (iconMenu) iconMenu.style.display = open ? 'none' : 'block';
      if (iconClose) iconClose.style.display = open ? 'block' : 'none';
    };

    navToggle.addEventListener('click', () => {
      setOpen(!navMobile.classList.contains('open'));
    });

    navMobile.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => setOpen(false));
    });

    document.addEventListener('click', (e) => {
      if (!navMobile.classList.contains('open')) return;
      if (!navMobile.contains(e.target) && !navToggle.contains(e.target)) setOpen(false);
    });
  }

  // ── Scroll reveal ──
  const revealObs = createObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => revealObs ? revealObs.observe(el) : el.classList.add('visible'));

  // ── About: pixel grid ──
  const grid = document.getElementById('pixelGrid');
  if (grid) {
    const COLS = 7, ROWS = 5, TOTAL = COLS * ROWS;
    const activeSet = new Set([0,2,4,7,9,11,14,16,18,20,22,24,26,28,30,32]);
    const semiSet   = new Set([1,8,13,19,25,27,33]);

    grid.innerHTML = '';
    for (let i = 0; i < TOTAL; i++) {
      const p = document.createElement('div');
      p.className = 'pixel' + (activeSet.has(i) ? ' active' : semiSet.has(i) ? ' semi' : '');
      grid.appendChild(p);
    }

    const tick = () => {
      grid.querySelectorAll('.pixel').forEach((p) => {
        if (Math.random() < 0.07) {
          p.classList.toggle('active');
          if (p.classList.contains('active')) p.classList.remove('semi');
        }
      });
    };

    let pixInterval = null;
    const startPix = () => { if (!pixInterval) pixInterval = setInterval(tick, 1000); };
    const stopPix  = () => { if (pixInterval) { clearInterval(pixInterval); pixInterval = null; } };
    startPix();
    document.addEventListener('visibilitychange', () => {
      document.hidden ? stopPix() : startPix();
    });
  }

  // ── Services: interactive list + image preview ──
  const srvItems  = document.querySelectorAll('.srv-item');
  const srvPanels = document.querySelectorAll('.srv-panel');
  const srvBUrl   = document.getElementById('srvBUrl');

  function activateService(item) {
    const targetId = item.dataset.target;
    const url = item.dataset.url;

    srvItems.forEach(i => { i.classList.remove('active'); i.classList.add('inactive'); });
    srvPanels.forEach(p => p.classList.remove('active'));

    item.classList.remove('inactive');
    item.classList.add('active');

    const panel = document.getElementById(targetId);
    if (panel) panel.classList.add('active');
    if (srvBUrl) srvBUrl.textContent = url || '';
  }

  srvItems.forEach(item => {
    item.addEventListener('click',      () => activateService(item));
    item.addEventListener('mouseenter', () => activateService(item));
  });

});