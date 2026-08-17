/* ============================================================
   EZTELLE UNIVERSITY — script.js
   Handles: ambient starfield canvas, mobile nav toggle,
   header scroll state, scroll-reveal, back-to-top button,
   and the newsletter form.
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------
     1. Footer year
  --------------------------------------------------------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------------------------------------------------
     2. Mobile nav toggle
  --------------------------------------------------------- */
  var navToggle = document.getElementById('navToggle');
  var mainNav = document.getElementById('mainNav');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function () {
      var isOpen = mainNav.classList.toggle('open');
      navToggle.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      navToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    });

    // Close the mobile menu after a nav link is tapped
    mainNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mainNav.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Open menu');
      });
    });
  }

  /* ---------------------------------------------------------
     3. Header background state on scroll
  --------------------------------------------------------- */
  var header = document.getElementById('siteHeader');
  var toTopBtn = document.getElementById('toTop');

  function onScroll() {
    var scrolled = window.scrollY > 40;
    if (header) header.classList.toggle('scrolled', scrolled);
    if (toTopBtn) toTopBtn.classList.toggle('visible', window.scrollY > 600);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  if (toTopBtn) {
    toTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  }

  /* ---------------------------------------------------------
     4. Scroll-reveal for course cards and why-cards
  --------------------------------------------------------- */
  var revealTargets = document.querySelectorAll('.course-card, .why-card');

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealTargets.forEach(function (el) { el.style.opacity = 1; });
  } else {
    revealTargets.forEach(function (el) {
      el.style.opacity = 0;
      el.style.transform = 'translateY(22px)';
      el.style.transition = 'opacity .6s ease, transform .6s ease';
    });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = 1;
          entry.target.style.transform = 'none';
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealTargets.forEach(function (el) { io.observe(el); });
  }

  /* ---------------------------------------------------------
     5. Newsletter ("Stay in orbit") form
  --------------------------------------------------------- */
  var signalForm = document.getElementById('signalForm');
  var signalEmail = document.getElementById('signalEmail');
  var signalMsg = document.getElementById('signalMsg');

  if (signalForm) {
    signalForm.addEventListener('submit', function (e) {
      e.preventDefault();
      signalEmail.classList.add('touched');

      if (!signalEmail.checkValidity()) {
        signalMsg.textContent = 'That email doesn\u2019t look right \u2014 double-check it and try again.';
        signalMsg.style.color = '#E07A5F';
        return;
      }

      signalMsg.textContent = 'You\u2019re on the list \u2014 we\u2019ll send new cohort dates to ' + signalEmail.value + '.';
      signalMsg.style.color = '';
      signalForm.reset();
      signalEmail.classList.remove('touched');
    });

    signalEmail.addEventListener('input', function () {
      if (signalEmail.classList.contains('touched')) {
        signalMsg.textContent = '';
      }
    });
  }

  /* ---------------------------------------------------------
     6. Ambient starfield canvas
     A quiet field of slow-twinkling stars behind the page,
     denser toward the bottom (deep space) than the top (ocean
     surface) to mirror the light-to-dark scroll of the page.
  --------------------------------------------------------- */
  var canvas = document.getElementById('starfield');
  if (!canvas) return;

  var ctx = canvas.getContext('2d');
  var stars = [];
  var width, height, dpr;

  function starCount() {
    var area = window.innerWidth * window.innerHeight;
    return Math.round(area / 9000);
  }

  function buildStars() {
    stars = [];
    var count = starCount();
    for (var i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.3 + 0.3,
        baseAlpha: Math.random() * 0.5 + 0.15,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.015 + 0.006
      });
    }
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = document.documentElement.scrollHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    buildStars();
  }

  var t = 0;
  function draw() {
    ctx.clearRect(0, 0, width, height);

    // Stars grow denser/whiter deeper into the page (galaxy zone)
    var galaxyStart = height * 0.32;

    for (var i = 0; i < stars.length; i++) {
      var s = stars[i];
      if (s.y < galaxyStart * 0.6) continue; // keep the ocean-surface band clear of stars

      var depthFactor = Math.min(1, (s.y - galaxyStart * 0.6) / (height - galaxyStart * 0.6));
      var twinkle = prefersReducedMotion ? 0 : Math.sin(t * s.speed * 60 + s.phase) * 0.35;
      var alpha = Math.max(0, (s.baseAlpha + twinkle) * (0.25 + depthFactor * 0.9));

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(252, 231, 184,' + alpha.toFixed(3) + ')';
      ctx.fill();
    }

    t += 1;
    if (!prefersReducedMotion) {
      requestAnimationFrame(draw);
    }
  }

  resize();
  draw();

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 150);
  });

  // Recompute canvas height if content height changes (e.g. font load)
  window.addEventListener('load', resize);
});