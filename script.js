/* ─── Particle canvas animation ─── */
// ═══════════════════════════════════════════════════════
// ALEX RIVERA PORTFOLIO — script.js
// ═══════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {

  // ── 1. THEME TOGGLE ─────────────────────────────────
  const htmlEl = document.documentElement;
  const themeBtn = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
  htmlEl.setAttribute('data-theme', savedTheme);

  themeBtn.addEventListener('click', () => {
    const current = htmlEl.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    htmlEl.setAttribute('data-theme', next);
    localStorage.setItem('portfolio-theme', next);
  });

  // ── 2. NAVBAR SCROLL ────────────────────────────────
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
    updateActiveNavLink();
  });

  // ── 3. MOBILE HAMBURGER ──────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
  });
  // Close menu on link click
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  // ── 4. ACTIVE NAV LINK ──────────────────────────────
  const sections = document.querySelectorAll('section[id]');
  function updateActiveNavLink() {
    const scrollY = window.scrollY + 120;
    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');
      const link = document.querySelector(`.nav-link[data-section="${id}"]`);
      if (!link) return;
      if (scrollY >= top && scrollY < top + height) {
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    });
  }
  updateActiveNavLink();

  // ── 5. CURSOR GLOW ──────────────────────────────────
  const cursorGlow = document.getElementById('cursorGlow');
  let mouseX = 0, mouseY = 0;
  window.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY + window.scrollY;
    cursorGlow.style.left = `${e.clientX}px`;
    cursorGlow.style.top = `${e.clientY}px`;
  });

  // ── 6. PARTICLE CANVAS ──────────────────────────────
  const canvas = document.getElementById('particlesCanvas');
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.4;
      this.alpha = Math.random() * 0.5 + 0.1;
      const hues = [265, 185, 325];
      this.hue = hues[Math.floor(Math.random() * hues.length)];
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > canvas.width ||
        this.y < 0 || this.y > canvas.height) this.reset();
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle = `hsl(${this.hue}, 80%, 70%)`;
      ctx.shadowBlur = 6;
      ctx.shadowColor = `hsl(${this.hue}, 80%, 70%)`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  const PARTICLE_COUNT = 80;
  for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    // connect nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.save();
          ctx.globalAlpha = (1 - dist / 100) * 0.12;
          ctx.strokeStyle = `hsl(265, 80%, 70%)`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }
    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  // ── 7. COUNTER ANIMATION ─────────────────────────────
  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'));
    const duration = 2000;
    const start = performance.now();

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target;
    }
    requestAnimationFrame(tick);
  }

  // ── 8. SCROLL REVEAL ─────────────────────────────────
  const revealEls = document.querySelectorAll('.reveal');
  const statNums = document.querySelectorAll('.stat-num');
  const skillFills = document.querySelectorAll('.skill-fill');

  let countersAnimated = false;
  let skillsAnimated = false;

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach(el => revealObserver.observe(el));

  // Stats counter
  const statsObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersAnimated) {
        countersAnimated = true;
        statNums.forEach(n => animateCounter(n));
        statsObserver.disconnect();
      }
    });
  }, { threshold: 0.5 });
  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) statsObserver.observe(heroStats);

  // Skill bar animation
  const skillsObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !skillsAnimated) {
        skillsAnimated = true;
        skillFills.forEach(fill => {
          setTimeout(() => fill.classList.add('animated'), 200);
        });
        skillsObserver.disconnect();
      }
    });
  }, { threshold: 0.3 });
  const skillsCat = document.querySelector('.skills-categories');
  if (skillsCat) skillsObserver.observe(skillsCat);

  // Set data-level for percentage display
  document.querySelectorAll('.skill-pill').forEach(pill => {
    const level = pill.getAttribute('data-level');
    const nameEl = pill.querySelector('.skill-name');
    if (nameEl && level) nameEl.setAttribute('data-level', level);
  });

  // ── 9. PROJECT FILTER ────────────────────────────────
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      projectCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        const show = filter === 'all' || cat === filter;
        card.classList.toggle('hidden', !show);
        if (show) {
          card.style.animation = 'none';
          void card.offsetWidth;
          card.style.animation = 'fade-in-up .4s ease both';
        }
      });
    });
  });

  // ── 10. TESTIMONIALS CAROUSEL ────────────────────────
  const track = document.getElementById('testimonialsTrack');
  const dots = document.querySelectorAll('.dot');
  let current = 0;
  let autoplay;

  if (track && dots.length) {
    function goToSlide(idx) {
      current = idx;
      track.style.transform = `translateX(${-100 * idx}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === idx));
    }

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        goToSlide(i);
        resetAutoplay();
      });
    });

    function nextSlide() { goToSlide((current + 1) % dots.length); }

    function resetAutoplay() {
      clearInterval(autoplay);
      autoplay = setInterval(nextSlide, 5000);
    }
    resetAutoplay();

    let touchStartX = 0;
    track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; });
    track.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) nextSlide();
        else goToSlide((current - 1 + dots.length) % dots.length);
        resetAutoplay();
      }
    });
  }

  // ── 11. CONTACT FORM ─────────────────────────────────
  const form = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');

  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = document.getElementById('formSubmit');

    // Simple validation
    const name = document.getElementById('formName').value.trim();
    const email = document.getElementById('formEmail').value.trim();
    const msg = document.getElementById('formMessage').value.trim();
    if (!name || !email || !msg) return;

    btn.disabled = true;
    btn.querySelector('span').textContent = 'Sending…';

    // Simulate send delay
    setTimeout(() => {
      success.classList.add('visible');
      form.reset();
      btn.disabled = false;
      btn.querySelector('span').textContent = 'Send Message';
      setTimeout(() => success.classList.remove('visible'), 5000);
    }, 1500);
  });

  // ── 12. SMOOTH SCROLL FOR LOGO ───────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});
