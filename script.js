/* =========================================================
   ADMIN: EDIT WORKSHOP DETAILS HERE ONLY
   ========================================================= */
const CONFIG = {
  date: 'Mon – Sat',                        // days you take calls
  time: '10 AM – 7 PM',                     // call hours
  price: '₹199',                            // consultation fee
  seats: 5,                                 // slots per day
  eventStart: '',                           // leave empty to hide the countdown
  checkoutUrl: 'YOUR_BOOKING_LINK',         // Calendly or payment + booking link
  youtubeId: 'YOUR_VIDEO_ID',
  videoMp4: ''
};


/* ================= FILL CONFIG INTO PAGE ================= */
document.querySelectorAll('[data-cfg]').forEach(el => {
  const v = CONFIG[el.dataset.cfg];
  if (v !== undefined) el.textContent = v;
});
document.querySelectorAll('.js-cta').forEach(a => a.setAttribute('href', CONFIG.checkoutUrl));
document.getElementById('year').textContent = new Date().getFullYear();

/* ================= REVEAL ON SCROLL ================= */
document.querySelectorAll('[data-stagger]').forEach(group => {
  group.querySelectorAll(':scope > [data-reveal]').forEach((el, i) => el.style.setProperty('--d', `${i * 0.1}s`));
});
const revealIO = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in');
    e.target.querySelectorAll('.mark').forEach(m => m.classList.add('in'));
    revealIO.unobserve(e.target);
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('[data-reveal]').forEach(el => revealIO.observe(el));

/* ================= COUNTERS (200+) ================= */
const countIO = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target, end = +el.dataset.count, t0 = performance.now(), dur = 1600;
    const tick = now => {
      const p = Math.min((now - t0) / dur, 1);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    countIO.unobserve(el);
  });
}, { threshold: 0.5 });
document.querySelectorAll('.count').forEach(el => countIO.observe(el));

/* ================= ENERGY DRAIN (problem section) ================= */
const drain = document.getElementById('drain');
const drainPct = document.getElementById('drainPct');
if (drain) {
  new IntersectionObserver((entries, obs) => {
    if (!entries[0].isIntersecting) return;
    let v = 60;
    const t = setInterval(() => {
      v -= 1;
      drain.style.width = v + '%';
      drainPct.textContent = v;
      if (v <= 5) clearInterval(t);
    }, 45);
    obs.disconnect();
  }, { threshold: 0.4 }).observe(drain);
      let v = 90;
            if (v <= 20) clearInterval(t);
}

/* ================= VSL VIDEO ================= */
const vsl = document.getElementById('vsl');
if (vsl) {
  vsl.addEventListener('click', () => {
    if (CONFIG.videoMp4) {
      vsl.innerHTML = `<video src="${CONFIG.videoMp4}" controls autoplay playsinline></video>`;
    } else {
      vsl.innerHTML = `<iframe src="https://www.youtube.com/embed/${CONFIG.youtubeId}?autoplay=1&rel=0&modestbranding=1&playsinline=1"
        title="Workshop video" allow="autoplay; encrypted-media; fullscreen; picture-in-picture" allowfullscreen></iframe>`;
    }
  }, { once: true });
}

/* ================= TESTIMONIAL READ MORE ================= */
document.querySelectorAll('.tcard__more').forEach(btn => {
  btn.addEventListener('click', () => {
    const card = btn.closest('.tcard');
    card.classList.toggle('open');
    btn.textContent = card.classList.contains('open') ? 'Show less' : 'Read more';
  });
});

/* ================= TESTIMONIAL SLIDER ================= */
const track = document.getElementById('track');
const dotsWrap = document.getElementById('dots');
if (track) {
  const cards = [...track.children];
  const perView = () => Math.max(1, Math.round(track.clientWidth / cards[0].offsetWidth));
  const pages = () => Math.ceil(cards.length / perView());
  const buildDots = () => {
    dotsWrap.innerHTML = '';
    for (let i = 0; i < pages(); i++) {
      const b = document.createElement('button');
      b.setAttribute('aria-label', `Go to slide ${i + 1}`);
      b.onclick = () => go(i);
      dotsWrap.appendChild(b);
    }
    setDot();
  };
  const current = () => Math.round(track.scrollLeft / (cards[0].offsetWidth + 14) / perView());
  const go = i => {
    const n = pages();
    i = (i + n) % n;
    track.scrollTo({ left: cards[Math.min(i * perView(), cards.length - 1)].offsetLeft - track.offsetLeft, behavior: 'smooth' });
  };
  const setDot = () => [...dotsWrap.children].forEach((d, i) => d.classList.toggle('on', i === current()));
  document.getElementById('prev').onclick = () => go(current() - 1);
  document.getElementById('next').onclick = () => go(current() + 1);
  track.addEventListener('scroll', () => requestAnimationFrame(setDot), { passive: true });
  window.addEventListener('resize', buildDots);
  buildDots();

  // auto-slide, pauses on hover/touch
  let auto = setInterval(() => go(current() + 1), 5000);
  ['mouseenter', 'touchstart'].forEach(ev => track.addEventListener(ev, () => clearInterval(auto), { passive: true }));
}

/* ================= FAQ: one open at a time ================= */
const faqs = document.querySelectorAll('.faq details');
faqs.forEach(d => d.addEventListener('toggle', () => {
  if (d.open) faqs.forEach(o => { if (o !== d) o.open = false; });
}));

/* ================= COUNTDOWN ================= */
const cd = document.getElementById('countdown');
if (cd) {
  const end = new Date(CONFIG.eventStart).getTime();
  const pad = n => String(n).padStart(2, '0');
  const run = () => {
    const diff = end - Date.now();
    if (diff <= 0) { cd.style.display = 'none'; cd.closest('.batch').classList.add('no-cd'); return clearInterval(timer); }
    document.getElementById('cdD').textContent = pad(Math.floor(diff / 864e5));
    document.getElementById('cdH').textContent = pad(Math.floor(diff / 36e5) % 24);
    document.getElementById('cdM').textContent = pad(Math.floor(diff / 6e4) % 60);
    document.getElementById('cdS').textContent = pad(Math.floor(diff / 1e3) % 60);
  };
  const timer = setInterval(run, 1000);
  run();
}

/* ================= TOPBAR, PROGRESS, STICKY BAR ================= */
const topbar = document.getElementById('topbar');
const progress = document.getElementById('progress');
const sticky = document.getElementById('sticky');
const hero = document.getElementById('hero');
const finalSec = document.getElementById('register');
const onScroll = () => {
  const y = window.scrollY;
  const h = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = (y / h) * 100 + '%';
  topbar.classList.toggle('scrolled', y > 30);
  const pastHero = y > hero.offsetHeight * 0.8;
  const atFinal = finalSec.getBoundingClientRect().top < window.innerHeight * 0.6;
  sticky.classList.toggle('show', pastHero && !atFinal);
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();




/* ================= TESTIMONIALS ================= */
document.querySelectorAll('.rv__more').forEach(btn => {
  btn.addEventListener('click', () => {
    const card = btn.closest('.rv__card');
    card.classList.toggle('open');
    btn.textContent = card.classList.contains('open') ? 'Show less ↑' : 'Read full story ↓';
  });
});
const rvAll = document.getElementById('rvAll');
if (rvAll) {
  rvAll.addEventListener('click', () => {
    const grid = document.querySelector('.rv');
    grid.classList.add('all');
    grid.querySelectorAll('.rv__card--extra').forEach(c => c.classList.add('in'));
    rvAll.remove();
  });
}












/* ================= TESTIMONIALS: MOBILE CAROUSEL ================= */
(() => {
  const rv = document.querySelector('.rv');
  const dotsWrap = document.getElementById('rvDots');
  const count = document.getElementById('rvCount');
  if (!rv || !dotsWrap) return;

  const mq = window.matchMedia('(max-width:599px)');
  const cards = [...rv.querySelectorAll('.rv__card')];
  let current = -1, auto = null, built = false;

  const setActive = i => {
    if (i === current) return;
    current = i;
    cards.forEach((c, k) => c.classList.toggle('is-active', k === i));
    [...dotsWrap.children].forEach((d, k) => d.classList.toggle('on', k === i));
    count.textContent = `${i + 1} / ${cards.length}`;
  };

  const go = i => {
    const c = cards[(i + cards.length) % cards.length];
    rv.scrollTo({ left: c.offsetLeft - (rv.clientWidth - c.clientWidth) / 2, behavior: 'smooth' });
  };

  // find the card closest to the centre
  const onScroll = () => {
    const mid = rv.scrollLeft + rv.clientWidth / 2;
    let best = 0, dist = Infinity;
    cards.forEach((c, i) => {
      const d = Math.abs(c.offsetLeft + c.clientWidth / 2 - mid);
      if (d < dist) { dist = d; best = i; }
    });
    setActive(best);
  };

  const start = () => {
    if (!built) {
      cards.forEach((_, i) => {
        const b = document.createElement('button');
        b.setAttribute('aria-label', `Story ${i + 1}`);
        b.onclick = () => go(i);
        dotsWrap.appendChild(b);
      });
      built = true;
    }
    cards.forEach(c => c.classList.add('in'));
    rv.classList.add('rv--on');
    rv.addEventListener('scroll', onScroll, { passive: true });
    current = -1;
    onScroll();
    clearInterval(auto);
    auto = setInterval(() => go(current + 1), 5000);
  };

  const stop = () => {
    rv.classList.remove('rv--on');
    rv.removeEventListener('scroll', onScroll);
    clearInterval(auto);
  };

  ['touchstart', 'pointerdown'].forEach(ev =>
    rv.addEventListener(ev, () => clearInterval(auto), { passive: true }));

  mq.matches ? start() : stop();
  mq.addEventListener('change', e => (e.matches ? start() : stop()));
})();
