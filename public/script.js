/* ============================================
   CleverFox Landing Page — JavaScript + Anime.js v4
   ============================================ */
const SUPABASE_URL = 'https://iajssmaunqnfofooxssm.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_RlVYlXhBEV2e1XE_Fw2Bhg_-giI1QqU';

const isMobile = window.matchMedia('(max-width: 768px)').matches;

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initHeroAnimations();
  initEmailForm();
  if (!isMobile) initGridAnimation();
  initSurveys();
  initScrollAnimations();
  initSmoothScroll();
  initParticles();
});

/* --- Navbar scroll effect --- */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

/* --- Mobile menu --- */
function initMobileMenu() {
  const toggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');
  if (!toggle || !navLinks) return;

  // Create overlay
  const overlay = document.createElement('div');
  overlay.classList.add('nav-overlay');
  document.body.appendChild(overlay);

  function closeMenu() {
    toggle.classList.remove('active');
    navLinks.classList.remove('open');
    overlay.classList.remove('show');
    document.body.style.overflow = '';
  }

  function openMenu() {
    toggle.classList.add('active');
    navLinks.classList.add('open');
    overlay.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  toggle.addEventListener('click', () => {
    if (navLinks.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  overlay.addEventListener('click', closeMenu);

  // Close menu when a link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

/* --- Hero entrance animation with Anime.js Timeline --- */
function initHeroAnimations() {
  const tl = anime.createTimeline({
    defaults: { duration: 800, ease: 'outExpo' }
  });

  tl.add('.hero-badge', {
    opacity: [0, 1],
    translateY: [30, 0],
  }, 0)

  .add('.stagger-title .word', {
    opacity: [0, 1],
    translateY: [50, 0],
    delay: anime.stagger(150),
  }, 100)

  .add('.hero p', {
    opacity: [0, 1],
    translateY: [30, 0],
  }, 250)

  .add('.email-form', {
    opacity: [0, 1],
    translateY: [30, 0],
  }, 400)

  .add('.hero-stats .stat', {
    opacity: [0, 1],
    translateY: [40, 0],
    delay: anime.stagger(100),
  }, 500)

  .add('.phone-mockup', {
    opacity: [0, 1],
    translateX: [80, 0],
    rotate: [5, 0],
    duration: 1200,
  }, 300)

  .add('.float-element', {
    opacity: [0, 1],
    scale: [0, 1],
    delay: anime.stagger(200),
    duration: 800,
    ease: 'spring(1, 80, 10, 0)',
  }, 800);

  // Animated counters in stats
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const obj = { val: 0 };

    anime.animate(obj, {
      val: target,
      duration: 2000,
      delay: 800,
      ease: 'outExpo',
      modifier: v => Math.round(v),
      onUpdate: () => {
        el.textContent = obj.val.toLocaleString() + suffix;
      }
    });
  });

  updateWaitlistCount();
}

/* --- Floating particles background --- */
function initParticles() {
  const hero = document.querySelector('.hero');
  const particleCount = isMobile ? 6 : 20;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    particle.style.cssText = `
      position: absolute;
      width: ${Math.random() * 8 + 4}px;
      height: ${Math.random() * 8 + 4}px;
      background: rgba(59, 130, 246, ${Math.random() * 0.15 + 0.05});
      border-radius: 50%;
      pointer-events: none;
      z-index: 0;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
    `;
    hero.appendChild(particle);

    anime.animate(particle, {
      translateX: () => anime.utils.random(-80, 80),
      translateY: () => anime.utils.random(-80, 80),
      opacity: [
        { to: [0, Math.random() * 0.5 + 0.2], duration: 1000 },
        { to: 0, duration: 1000 }
      ],
      scale: [
        { to: [0.5, 1.5], duration: 2000 },
        { to: 0.5, duration: 2000 }
      ],
      duration: () => anime.utils.random(4000, 8000),
      loop: true,
      ease: 'inOutSine',
      delay: () => anime.utils.random(0, 3000),
    });
  }
}

/* --- Email waitlist form --- */
function initEmailForm() {
  const form = document.getElementById('emailForm');
  const input = document.getElementById('emailInput');
  const successMsg = document.getElementById('emailSuccess');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = input.value.trim();

    if (!isValidEmail(email)) {
      // Shake animation with anime.js
      anime.animate(input, {
        translateX: [0, -10, 10, -10, 10, -5, 5, 0],
        duration: 500,
        ease: 'inOutSine'
      });
      input.style.borderColor = '#EF4444';
      setTimeout(() => { input.style.borderColor = ''; }, 2000);
      return;
    }

    // Guardar en localStorage para evitar reenvíos
    const emails = JSON.parse(localStorage.getItem('cleverfox_emails') || '[]');
    if (!emails.includes(email)) {
      emails.push(email);
      localStorage.setItem('cleverfox_emails', JSON.stringify(emails));
    }

    updateWaitlistCount();

    // Enviar a Supabase silenciosamente
    fetch(`${SUPABASE_URL}/rest/v1/waitlist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({ email: email })
    }).catch(err => console.error('Error enviando a Supabase:', err));

    // Animate form out and success in
    anime.animate(form, {
      opacity: [1, 0],
      translateY: [0, -10],
      duration: 300,
      ease: 'inQuad',
      onComplete: () => {
        form.style.display = 'none';
        successMsg.classList.add('show');

        anime.animate(successMsg, {
          opacity: [0, 1],
          translateY: [20, 0],
          scale: [0.95, 1],
          duration: 800,
          ease: 'spring(1, 80, 10, 0)'
        });

        setTimeout(() => {
          anime.animate(successMsg, {
            opacity: [1, 0],
            duration: 300,
            onComplete: () => {
              successMsg.classList.remove('show');
              form.style.display = 'flex';
              form.style.opacity = '1';
              form.style.transform = '';
              input.value = '';
            }
          });
        }, 4000);
      }
    });
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function updateWaitlistCount() {
  const emails = JSON.parse(localStorage.getItem('cleverfox_emails') || '[]');
  const countEl = document.getElementById('waitlistCount');
  if (countEl) {
    countEl.textContent = (1247 + emails.length).toLocaleString() + '+';
  }
}

/* --- Surveys --- */
function initSurveys() {
  initPriceSurvey();
  initFeatureSurvey();
}

function initPriceSurvey() {
  const form = document.getElementById('priceSurveyForm');
  const input = document.getElementById('priceInput');
  const thankYou = document.getElementById('priceThankYou');
  if (!form || !input || !thankYou) return;

  const already = localStorage.getItem('cleverfox_price_voted_text');
  if (already) {
    form.style.display = 'none';
    thankYou.classList.add('show');
    return;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = input.value.trim();
    if (!val) return;

    localStorage.setItem('cleverfox_price_voted_text', 'true');
    const existing = JSON.parse(localStorage.getItem('cleverfox_price_feedbacks') || '[]');
    existing.push(val);
    localStorage.setItem('cleverfox_price_feedbacks', JSON.stringify(existing));

    // Enviar a Supabase silenciosamente
    fetch(`${SUPABASE_URL}/rest/v1/price_feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({ price_suggestion: val })
    }).catch(err => console.error('Error enviando a Supabase:', err));

    const btn = form.querySelector('.survey-btn');
    anime.animate(btn, {
      scale: [1, 0.95, 1],
      duration: 600,
      ease: 'spring(1, 100, 10, 0)',
      onComplete: () => {
        anime.animate(form, {
          opacity: [1, 0],
          translateY: [0, -10],
          duration: 300,
          ease: 'inQuad',
          onComplete: () => {
            form.style.display = 'none';
            thankYou.classList.add('show');
            anime.animate(thankYou, {
              opacity: [0, 1],
              translateY: [20, 0],
              scale: [0.95, 1],
              duration: 800,
              ease: 'spring(1, 80, 10, 0)'
            });
          }
        });
      }
    });
  });
}

function initFeatureSurvey() {
  const form = document.getElementById('featureSurveyForm');
  const input = document.getElementById('featureInput');
  const thankYou = document.getElementById('featureThankYou');
  if (!form || !input || !thankYou) return;

  const already = localStorage.getItem('cleverfox_feature_voted_text');
  if (already) {
    form.style.display = 'none';
    thankYou.classList.add('show');
    return;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = input.value.trim();
    if (!val) return;

    localStorage.setItem('cleverfox_feature_voted_text', 'true');
    const existing = JSON.parse(localStorage.getItem('cleverfox_feature_feedbacks') || '[]');
    existing.push(val);
    localStorage.setItem('cleverfox_feature_feedbacks', JSON.stringify(existing));

    // Enviar a Supabase silenciosamente
    fetch(`${SUPABASE_URL}/rest/v1/feature_feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({ features_requested: val })
    }).catch(err => console.error('Error enviando a Supabase:', err));

    const btn = form.querySelector('.survey-btn');
    anime.animate(btn, {
      scale: [1, 0.95, 1],
      duration: 600,
      ease: 'spring(1, 100, 10, 0)',
      onComplete: () => {
        anime.animate(form, {
          opacity: [1, 0],
          translateY: [0, -10],
          duration: 300,
          ease: 'inQuad',
          onComplete: () => {
            form.style.display = 'none';
            thankYou.classList.add('show');
            anime.animate(thankYou, {
              opacity: [0, 1],
              translateY: [20, 0],
              scale: [0.95, 1],
              duration: 800,
              ease: 'spring(1, 80, 10, 0)'
            });
          }
        });
      }
    });
  });
}

/* --- Advanced Grid Animation --- */
function initGridAnimation() {
  const container = document.querySelector('.surveys-section');
  if (!container) return;

  const bg = document.createElement('div');
  bg.classList.add('stagger-grid-bg');
  container.prepend(bg);

  const cols = Math.floor(window.innerWidth / 60);
  const rows = Math.floor(container.offsetHeight / 60) || 12;
  const total = cols * rows;

  bg.style.setProperty('--cols', cols);
  bg.style.setProperty('--rows', rows);

  for (let i = 0; i < total; i++) {
    const el = document.createElement('div');
    el.classList.add('grid-item');
    bg.appendChild(el);
  }

  anime.animate('.grid-item', {
    scale: [
      { to: 0.1, ease: 'inOutSine', duration: 1500 },
      { to: 1, ease: 'inOutSine', duration: 1500 }
    ],
    delay: anime.stagger(150, { grid: [cols, rows], from: 'center' }),
    loop: true
  });
}

/* --- Scroll Animations with Anime.js --- */
function initScrollAnimations() {
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;

        if (el.classList.contains('reveal-left')) {
          anime.animate(el, {
            opacity: [0, 1],
            translateX: [-60, 0],
            duration: 900,
            ease: 'outExpo'
          });
        } else if (el.classList.contains('reveal-right')) {
          anime.animate(el, {
            opacity: [0, 1],
            translateX: [60, 0],
            duration: 900,
            ease: 'outExpo'
          });
        } else {
          anime.animate(el, {
            opacity: [0, 1],
            translateY: [50, 0],
            duration: 800,
            ease: 'outExpo'
          });
        }

        el.classList.add('visible');
        observer.unobserve(el);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => observer.observe(el));

  // Feature images — hover zoom animation
  document.querySelectorAll('.feature-image-wrapper img').forEach(img => {
    img.addEventListener('mouseenter', () => {
      anime.animate(img, {
        scale: 1.05,
        rotate: 1,
        duration: 400,
        ease: 'outBack'
      });
    });
    img.addEventListener('mouseleave', () => {
      anime.animate(img, {
        scale: 1,
        rotate: 0,
        duration: 400,
        ease: 'outQuad'
      });
    });
  });

  // Survey cards — hover lift with springs
  document.querySelectorAll('.survey-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      anime.animate(card, {
        translateY: -6,
        duration: 800,
        ease: 'spring(1, 80, 10, 0)'
      });
    });
    card.addEventListener('mouseleave', () => {
      anime.animate(card, {
        translateY: 0,
        duration: 800,
        ease: 'spring(1, 80, 10, 0)'
      });
    });
  });
}

/* --- Smooth scroll for nav links --- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}
