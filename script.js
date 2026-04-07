/* ============================================
   CleverFox Landing Page — JavaScript Logic
   ============================================ */
const SUPABASE_URL = 'https://iajssmaunqnfofooxssm.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_RlVYlXhBEV2e1XE_Fw2Bhg_-giI1QqU';

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initScrollAnimations();
  initWaitlistForms();
  initSmoothScroll();
  updateWaitlistDisplay();
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

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    navLinks.classList.toggle('open');
  });
}

/* --- Scroll Animations --- */
function initScrollAnimations() {
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealElements.forEach(el => observer.observe(el));
}

/* --- Waitlist Forms --- */
function initWaitlistForms() {
  const forms = document.querySelectorAll('.email-form');
  const successMsg = document.getElementById('emailSuccess');

  forms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const email = input.value.trim();

      if (!isValidEmail(email)) return;

      // Save to local for UI persistent count
      const emails = JSON.parse(localStorage.getItem('cleverfox_emails') || '[]');
      if (!emails.includes(email)) {
        emails.push(email);
        localStorage.setItem('cleverfox_emails', JSON.stringify(emails));
      }

      updateWaitlistDisplay();

      // Submit to Supabase
      try {
        await fetch(`${SUPABASE_URL}/rest/v1/waitlist`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({ email: email })
        });
      } catch (err) {
        console.error('Supabase Error:', err);
      }

      // Show success
      if (successMsg) {
        successMsg.classList.add('show');
        form.style.display = 'none';
        setTimeout(() => {
          successMsg.classList.remove('show');
          form.style.display = 'flex';
          input.value = '';
        }, 5000);
      } else {
        alert('¡Gracias! Te has unido a la lista.');
        input.value = '';
      }
    });
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function updateWaitlistDisplay() {
  const emails = JSON.parse(localStorage.getItem('cleverfox_emails') || '[]');
  const countEl = document.getElementById('waitlistCount');
  if (countEl) {
    countEl.textContent = (124 + emails.length).toLocaleString() + '+';
  }
}

/* --- Smooth scroll --- */
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
