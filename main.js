/* ════════════════════════════════════════════════════════════
   FALCON VERACITY GROUP LTD — Main JavaScript
   ════════════════════════════════════════════════════════════ */

'use strict';

/* ─── PRELOADER ─────────────────────────────────────────── */
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;
  setTimeout(() => {
    preloader.classList.add('hidden');
    document.body.style.overflow = '';
    // Trigger hero animations after preloader
    document.querySelectorAll('.hero .reveal-up, .hero .reveal-left, .hero .reveal-right').forEach(el => {
      el.classList.add('revealed');
    });
    // Start counter
    startCounters();
  }, 2200);
});
document.body.style.overflow = 'hidden';

/* ─── NAVBAR SCROLL ─────────────────────────────────────── */
const navbar  = document.getElementById('navbar');
const backTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  const sy = window.scrollY;
  navbar.classList.toggle('scrolled', sy > 60);
  backTop.classList.toggle('visible', sy > 400);
}, { passive: true });

backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ─── HAMBURGER / MOBILE MENU ───────────────────────────── */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
});

document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
  });
});

/* ─── SMOOTH SCROLL ─────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = navbar.offsetHeight + 20;
    window.scrollTo({
      top: target.getBoundingClientRect().top + window.scrollY - offset,
      behavior: 'smooth'
    });
  });
});

/* ─── SCROLL REVEAL ─────────────────────────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => {
  // Don't observe hero elements — they're triggered by preloader
  if (!el.closest('.hero')) revealObserver.observe(el);
});

/* ─── ANIMATED COUNTERS ─────────────────────────────────── */
function startCounters() {
  document.querySelectorAll('.stat-number[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count, 10);
    const duration = 2000;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out expo
      const eased = 1 - Math.pow(2, -10 * progress);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target;
    }
    requestAnimationFrame(update);
  });
}

/* ─── GALLERY FILTER ────────────────────────────────────── */
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    galleryItems.forEach(item => {
      const cat = item.dataset.category;
      if (filter === 'all' || cat === filter) {
        item.classList.remove('hidden');
        item.style.animation = 'fadeIn 0.5s ease forwards';
      } else {
        item.classList.add('hidden');
      }
    });
  });
});

// Add keyframe
const style = document.createElement('style');
style.textContent = '@keyframes fadeIn { from { opacity:0; transform:scale(0.95); } to { opacity:1; transform:scale(1); } }';
document.head.appendChild(style);

/* ─── TESTIMONIAL SLIDER ────────────────────────────────── */
const slides = document.querySelectorAll('.testimonial-slide');
const dots   = document.querySelectorAll('.t-dot');
let current  = 0;
let autoTimer;

function goToSlide(index) {
  slides[current].classList.remove('active');
  dots[current].classList.remove('active');
  current = (index + slides.length) % slides.length;
  slides[current].classList.add('active');
  dots[current].classList.add('active');
}

dots.forEach(dot => {
  dot.addEventListener('click', () => {
    clearInterval(autoTimer);
    goToSlide(parseInt(dot.dataset.index, 10));
    startAuto();
  });
});

function startAuto() {
  autoTimer = setInterval(() => goToSlide(current + 1), 5500);
}
startAuto();

// Pause on hover
const track = document.getElementById('testimonialTrack');
if (track) {
  track.addEventListener('mouseenter', () => clearInterval(autoTimer));
  track.addEventListener('mouseleave', startAuto);
}

/* ─── CONTACT FORM ──────────────────────────────────────── */
const contactForm   = document.getElementById('contactForm');
const formSuccess   = document.getElementById('formSuccess');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const btn = contactForm.querySelector('button[type="submit"]');
    btn.textContent = 'Sending…';
    btn.disabled = true;

    // Simulate API call
    setTimeout(() => {
      contactForm.style.display = 'none';
      formSuccess.classList.add('show');
    }, 1500);
  });
}

/* ─── ACTIVE NAV LINK ON SCROLL ─────────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach(link => {
        link.style.color = link.getAttribute('href') === `#${id}`
          ? 'var(--gold)'
          : '';
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

/* ─── PARALLAX HERO ─────────────────────────────────────── */
const heroBg = document.querySelector('.hero-bg');
if (heroBg) {
  window.addEventListener('scroll', () => {
    const sy = window.scrollY;
    if (sy < window.innerHeight) {
      heroBg.style.transform = `translateY(${sy * 0.35}px)`;
    }
  }, { passive: true });
}

/* ─── SERVICE CARD TILT ─────────────────────────────────── */
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 8;
    card.style.transform = `perspective(800px) rotateY(${x}deg) rotateX(${-y}deg) translateZ(4px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.5s ease';
  });
  card.addEventListener('mouseenter', () => {
    card.style.transition = 'transform 0.1s ease';
  });
});

/* ─── GALLERY ITEM CURSOR ───────────────────────────────── */
document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('click', () => {
    // Lightbox placeholder — could be wired to a real lightbox library
    const title = item.querySelector('h3')?.textContent || 'Project';
    console.info(`Gallery: ${title} selected`);
  });
});

/* ─── METRIC RINGS ANIMATE ON ENTER ────────────────────────
   The SVG circles have static stroke-dashoffset values baked in.
   We do a CSS-based animation when they enter the viewport.
──────────────────────────────────────────────────────────── */
const metricObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('circle:last-child').forEach(circle => {
        const final = circle.getAttribute('stroke-dashoffset');
        circle.style.strokeDashoffset = '264';
        circle.style.transition = 'stroke-dashoffset 1.5s cubic-bezier(0.16,1,0.3,1)';
        requestAnimationFrame(() => {
          circle.style.strokeDashoffset = final;
        });
      });
      metricObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.metric-card').forEach(card => metricObserver.observe(card));

/* ─── CONSOLE BRANDING ───────────────────────────────────── */
console.log(
  '%cFalcon Veracity Group Ltd\n%cConstructing Rwanda\'s Green Future',
  'color:#D4AF37;font-size:1.2rem;font-weight:bold;',
  'color:#2E8B57;font-size:0.9rem;'
);
