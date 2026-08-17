/* ==========================================================================
   Eztelle University — script.js
   Handles: mobile nav, scroll behavior, hero canvas (stars + trail + ripple),
   course card rendering, and the course detail modal.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  setFooterYear();
  initNavbarScroll();
  initMobileMenu();
  initSmoothScroll();
  initHeroCanvas();
  initCourses();
});

/* ---------------------------------------------------------------------- */
/* Footer year                                                            */
/* ---------------------------------------------------------------------- */
function setFooterYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

/* ---------------------------------------------------------------------- */
/* Navbar: add background once the page has scrolled                      */
/* ---------------------------------------------------------------------- */
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const updateState = () => {
    navbar.classList.toggle('is-scrolled', window.scrollY > 12);
  };

  updateState();
  window.addEventListener('scroll', updateState, { passive: true });
}

/* ---------------------------------------------------------------------- */
/* Mobile hamburger menu (star-shaped icon rotates into a close state)    */
/* ---------------------------------------------------------------------- */
function initMobileMenu() {
  const btn = document.getElementById('hamburgerBtn');
  const menu = document.getElementById('mobileMenu');
  if (!btn || !menu) return;

  const closeMenu = () => {
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', 'Open menu');
    menu.classList.remove('is-open');
  };

  const openMenu = () => {
    btn.setAttribute('aria-expanded', 'true');
    btn.setAttribute('aria-label', 'Close menu');
    menu.classList.add('is-open');
  };

  btn.addEventListener('click', () => {
    const isOpen = btn.getAttribute('aria-expanded') === 'true';
    isOpen ? closeMenu() : openMenu();
  });

  // Close the menu whenever a link inside it is clicked
  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
}

/* ---------------------------------------------------------------------- */
/* Smooth scrolling for in-page nav links                                 */
/* ---------------------------------------------------------------------- */
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');
  const navbarHeight = 84;

  links.forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - navbarHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ---------------------------------------------------------------------- */
/* Hero canvas: ambient stars + cursor star-trail + click water ripples   */
/* ---------------------------------------------------------------------- */
function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  const hero = document.querySelector('.hero');
  if (!canvas || !hero) return;

  const ctx = canvas.getContext('2d');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let width, height, dpr;
  let stars = [];
  let trail = [];
  let ripples = [];

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = hero.clientWidth;
    height = hero.clientHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    seedStars();
  }

  function seedStars() {
    const count = Math.round((width * height) / 9000);
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.3 + 0.3,
      baseAlpha: Math.random() * 0.5 + 0.25,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
      phase: Math.random() * Math.PI * 2,
    }));
  }

  function drawStars(time) {
    stars.forEach((s) => {
      const alpha = s.baseAlpha + Math.sin(time * s.twinkleSpeed + s.phase) * 0.25;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(244, 248, 255, ${Math.max(alpha, 0.05)})`;
      ctx.fill();
    });
  }

  function drawTrail() {
    trail.forEach((p, i) => {
      const life = 1 - p.age / p.maxAge;
      if (life <= 0) return;
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.beginPath();
      const r = p.r * life;
      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 4);
      gradient.addColorStop(0, `rgba(126, 232, 255, ${0.55 * life})`);
      gradient.addColorStop(1, 'rgba(126, 232, 255, 0)');
      ctx.fillStyle = gradient;
      ctx.arc(p.x, p.y, r * 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      p.age += 1;
    });
    trail = trail.filter((p) => p.age < p.maxAge);
  }

  function drawRipples() {
    ripples.forEach((r) => {
      const life = r.age / r.maxAge;
      if (life >= 1) return;
      const radius = r.maxRadius * easeOutCubic(life);
      const alpha = (1 - life) * 0.5;

      ctx.save();
      ctx.globalCompositeOperation = 'lighter';

      // two concentric rings for a richer ripple
      [1, 0.6].forEach((scale, idx) => {
        ctx.beginPath();
        ctx.arc(r.x, r.y, radius * scale, 0, Math.PI * 2);
        ctx.lineWidth = idx === 0 ? 1.6 : 1;
        ctx.strokeStyle = `rgba(${r.color}, ${alpha})`;
        ctx.stroke();
      });

      ctx.restore();
      r.age += 1;
    });
    ripples = ripples.filter((r) => r.age < r.maxAge);
  }

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function loop(time) {
    ctx.clearRect(0, 0, width, height);
    drawStars(time || 0);
    drawRipples();
    drawTrail();
    requestAnimationFrame(loop);
  }

  // Mouse trail leaves glowing "stars" behind
  let lastTrailTime = 0;
  function handlePointerMove(e) {
    if (reduceMotion) return;
    const now = performance.now();
    if (now - lastTrailTime < 28) return; // throttle for smooth, light-weight trail
    lastTrailTime = now;

    const rect = canvas.getBoundingClientRect();
    trail.push({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      r: Math.random() * 1.5 + 1,
      age: 0,
      maxAge: 40,
    });
    if (trail.length > 120) trail.shift();
  }

  // Click sends a glowing ripple through the "water"
  function handlePointerDown(e) {
    const rect = canvas.getBoundingClientRect();
    const colors = ['79, 216, 255', '139, 111, 214', '182, 243, 255'];
    ripples.push({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      age: 0,
      maxAge: 70,
      maxRadius: 160,
      color: colors[Math.floor(Math.random() * colors.length)],
    });
    if (ripples.length > 12) ripples.shift();
  }

  window.addEventListener('resize', resize);
  canvas.addEventListener('mousemove', handlePointerMove);
  canvas.addEventListener('click', handlePointerDown);
  canvas.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    if (touch) handlePointerDown(touch);
  }, { passive: true });

  resize();
  requestAnimationFrame(loop);
}

/* ---------------------------------------------------------------------- */
/* Course data, card rendering, and detail modal                          */
/* ---------------------------------------------------------------------- */
const COURSES = [
  {
    id: 'fundamentals',
    name: 'Cybersecurity Fundamentals',
    summary: 'A foundational voyage into how systems, networks, and people are attacked — and how to defend them.',
    description: 'Start at the surface and work your way down. This course builds the core mental models every security professional needs: how networks are mapped, how vulnerabilities are found, and how organizations build layered defense. By the end, you will think like both an attacker and a defender.',
    lessons: [
      'Networking & protocol fundamentals',
      'Threat modeling and risk basics',
      'Security policy & access control',
      'Introductory cryptography',
      'Hands-on lab: securing a small network',
    ],
    duration: '8 weeks · Self-paced',
    price: '$1,200',
    icon: 'shield',
  },
  {
    id: 'ethical-hacking',
    name: 'Ethical Hacking & Penetration Testing',
    summary: 'Learn to probe systems the way real adversaries do, under a strict ethical and legal framework.',
    description: 'Go beneath the surface. You will run full penetration tests against sanctioned lab environments — reconnaissance, exploitation, privilege escalation, and reporting — using the same tools and mindset as professional red teams, guided by a strong ethical code throughout.',
    lessons: [
      'Reconnaissance & footprinting',
      'Vulnerability scanning & exploitation',
      'Web application attack techniques',
      'Privilege escalation & lateral movement',
      'Professional reporting & remediation',
    ],
    duration: '10 weeks · Cohort-based',
    price: '$1,650',
    icon: 'target',
  },
  {
    id: 'forensics',
    name: 'Digital Forensics & Incident Response',
    summary: 'Investigate breaches after the tide comes in — trace intrusions, recover evidence, and respond fast.',
    description: 'When defenses fail, someone has to find out what happened. This course trains you to investigate compromised systems, preserve digital evidence, and lead a structured incident response from detection to recovery, drawing on real anonymized case studies.',
    lessons: [
      'Evidence acquisition & chain of custody',
      'Memory & disk forensic analysis',
      'Log analysis & intrusion timelines',
      'Incident response frameworks',
      'Capstone: full breach investigation',
    ],
    duration: '9 weeks · Cohort-based',
    price: '$1,750',
    icon: 'radar',
  },
];

const COURSE_ICONS = {
  shield: '<svg viewBox="0 0 40 40" width="28" height="28"><path d="M20 4 L35 12 V22 C35 30 28 36 20 38 C12 36 5 30 5 22 V12 Z" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M14 20 L18 25 L27 14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  target: '<svg viewBox="0 0 40 40" width="28" height="28"><circle cx="20" cy="20" r="15" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="20" cy="20" r="8.5" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="20" cy="20" r="2.5" fill="currentColor"/></svg>',
  radar: '<svg viewBox="0 0 40 40" width="28" height="28"><circle cx="20" cy="20" r="15" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M20 20 L20 7 A13 13 0 0 1 30 12 Z" fill="currentColor" opacity="0.35"/><circle cx="20" cy="20" r="2.5" fill="currentColor"/></svg>',
};

function initCourses() {
  const grid = document.getElementById('courseGrid');
  if (!grid) return;

  grid.innerHTML = COURSES.map((course, index) => `
    <article class="course-card">
      <span class="course-card__index">0${index + 1} · Program</span>
      <h3 class="course-card__title">${course.name}</h3>
      <p class="course-card__desc">${course.summary}</p>
      <ul class="course-card__lessons">
        ${course.lessons.slice(0, 3).map((l) => `<li>${l}</li>`).join('')}
      </ul>
      <div class="course-card__footer">
        <span class="course-card__price">${course.price}<span>Full program</span></span>
        <button type="button" class="view-course-btn" data-course-id="${course.id}">View Course</button>
      </div>
    </article>
  `).join('');

  grid.querySelectorAll('.view-course-btn').forEach((btn) => {
    btn.addEventListener('click', () => openCourseModal(btn.dataset.courseId));
  });

  initModal();
}

let modalTriggerEl = null;

function initModal() {
  const overlay = document.getElementById('modalOverlay');
  const closeBtn = document.getElementById('modalClose');
  if (!overlay || !closeBtn) return;

  closeBtn.addEventListener('click', closeCourseModal);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeCourseModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('is-open')) {
      closeCourseModal();
    }
  });
}

function openCourseModal(courseId) {
  const course = COURSES.find((c) => c.id === courseId);
  const overlay = document.getElementById('modalOverlay');
  if (!course || !overlay) return;

  modalTriggerEl = document.activeElement;

  document.getElementById('modalIcon').innerHTML = COURSE_ICONS[course.icon] || '';
  document.getElementById('modalDuration').textContent = course.duration;
  document.getElementById('modalTitle').textContent = course.name;
  document.getElementById('modalDesc').textContent = course.description;
  document.getElementById('modalLessons').innerHTML =
    course.lessons.map((l) => `<li>${l}</li>`).join('');
  document.getElementById('modalPrice').textContent = course.price;

  overlay.classList.add('is-open');
  document.body.style.overflow = 'hidden';

  // Move focus into the dialog for accessibility
  document.getElementById('modalClose').focus();
}

function closeCourseModal() {
  const overlay = document.getElementById('modalOverlay');
  if (!overlay) return;

  overlay.classList.remove('is-open');
  document.body.style.overflow = '';

  if (modalTriggerEl && typeof modalTriggerEl.focus === 'function') {
    modalTriggerEl.focus();
  }
}