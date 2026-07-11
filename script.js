document.addEventListener('DOMContentLoaded', () => {
  emailjs.init('98tA3GrZ8CKCHsRoe');
  initHeroCanvas();
  initTyping();
  initMobileMenu();
  initNavHighlight();
  initScrollAnimations();
  initCounters();
  initProjectFilter();
  initMemoryModal();
  initContactForm();
});

/* ===== HERO CANVAS PARTICLES ===== */
function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let W, H;

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.r = Math.random() * 1.8 + 0.4;
      this.dx = (Math.random() - 0.5) * 0.4;
      this.dy = (Math.random() - 0.5) * 0.4;
      this.alpha = Math.random() * 0.5 + 0.1;
    }
    update() {
      this.x += this.dx; this.y += this.dy;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(108,99,255,${this.alpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < 100; i++) particles.push(new Particle());

  // Draw gradient background orbs
  function drawOrbs() {
    const g1 = ctx.createRadialGradient(W * 0.2, H * 0.3, 0, W * 0.2, H * 0.3, W * 0.35);
    g1.addColorStop(0, 'rgba(108,99,255,0.12)');
    g1.addColorStop(1, 'rgba(108,99,255,0)');
    ctx.fillStyle = g1; ctx.fillRect(0, 0, W, H);

    const g2 = ctx.createRadialGradient(W * 0.8, H * 0.7, 0, W * 0.8, H * 0.7, W * 0.3);
    g2.addColorStop(0, 'rgba(0,212,255,0.08)');
    g2.addColorStop(1, 'rgba(0,212,255,0)');
    ctx.fillStyle = g2; ctx.fillRect(0, 0, W, H);
  }

  // Connect nearby particles
  function connect() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(108,99,255,${0.15 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    drawOrbs();
    connect();
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }
  animate();
}

/* ===== TYPING ANIMATION ===== */
function initTyping() {
  const el = document.getElementById('typed-text');
  if (!el) return;
  const texts = [
    'Full-Stack Developer',
    'UI/UX Enthusiast',
    'Problem Solver',
    'Spring Boot + React Dev',
    'Open Source Contributor'
  ];
  let ti = 0, ci = 0, deleting = false;

  function tick() {
    const current = texts[ti];
    if (!deleting) {
      el.textContent = current.slice(0, ci + 1);
      ci++;
      if (ci === current.length) { deleting = true; setTimeout(tick, 1800); return; }
    } else {
      el.textContent = current.slice(0, ci - 1);
      ci--;
      if (ci === 0) { deleting = false; ti = (ti + 1) % texts.length; }
    }
    setTimeout(tick, deleting ? 60 : 90);
  }
  tick();
}

/* ===== MOBILE MENU ===== */
function initMobileMenu() {
  const toggle = document.getElementById('menuToggle');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  if (!toggle || !sidebar) return;

  const open = () => { toggle.classList.add('active'); sidebar.classList.add('active'); overlay.classList.add('active'); };
  const close = () => { toggle.classList.remove('active'); sidebar.classList.remove('active'); overlay.classList.remove('active'); };

  toggle.addEventListener('click', () => sidebar.classList.contains('active') ? close() : open());
  overlay.addEventListener('click', close);
  document.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', () => { if (window.innerWidth <= 768) close(); }));
}

/* ===== NAV HIGHLIGHT ===== */
function initNavHighlight() {
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = document.getElementById(link.getAttribute('href').slice(1));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        const a = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (a) a.classList.add('active');
      }
    });
  }, { threshold: 0.3, rootMargin: '-80px 0px -80px 0px' });

  document.querySelectorAll('section[id]').forEach(s => observer.observe(s));
}

/* ===== SCROLL ANIMATIONS ===== */
function initScrollAnimations() {
  const sel = [
    '.expertise-card', '.timeline-content', '.experience-card',
    '.certificate-card', '.memory-item', '.contact-item',
    '.about-text', '.about-image'
  ].join(',');

  const els = document.querySelectorAll(sel);
  els.forEach(el => el.classList.add('fade-in'));

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  els.forEach(el => observer.observe(el));
}

/* ===== COUNTER ANIMATION ===== */
function initCounters() {
  const counters = document.querySelectorAll('.stat-num[data-target]');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        let current = 0;
        const step = Math.ceil(target / 40);
        const timer = setInterval(() => {
          current += step;
          if (current >= target) { el.textContent = target + '+'; clearInterval(timer); }
          else el.textContent = current;
        }, 40);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => observer.observe(c));
}

/* ===== PROJECT FILTER ===== */
function initProjectFilter() {
  const btns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.experience-card');

  const style = document.createElement('style');
  style.textContent = `@keyframes cardIn{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}`;
  document.head.appendChild(style);

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      cards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        if (match) {
          card.classList.remove('hidden');
          card.style.animation = 'none';
          requestAnimationFrame(() => { card.style.animation = 'cardIn 0.4s ease forwards'; });
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

/* ===== MEMORY MODAL ===== */
function initMemoryModal() {
  document.querySelectorAll('.memory-item').forEach(item => {
    item.addEventListener('click', () => {
      const src   = item.querySelector('img').src;
      const title = item.querySelector('h3').textContent;
      const desc  = item.querySelector('p').textContent;

      const modal = document.createElement('div');
      modal.className = 'mem-modal';
      modal.innerHTML = `
        <div class="mem-inner">
          <button class="mem-close"><i class="fas fa-times"></i></button>
          <img src="${src}" alt="${title}" />
          <div class="mem-info"><h3>${title}</h3><p>${desc}</p></div>
        </div>`;

      const st = document.createElement('style');
      st.textContent = `
        .mem-modal{position:fixed;inset:0;background:rgba(0,0,0,0.88);z-index:10000;display:flex;align-items:center;justify-content:center;padding:20px;animation:mfade .3s ease}
        .mem-inner{position:relative;max-width:680px;width:100%;background:#1c1c2e;border-radius:16px;overflow:hidden;border:1px solid rgba(108,99,255,0.3);animation:mscale .3s ease}
        .mem-inner img{width:100%;max-height:420px;object-fit:cover;display:block}
        .mem-info{padding:18px 22px}
        .mem-info h3{color:#fff;font-size:17px;margin-bottom:5px}
        .mem-info p{color:#8888aa;font-size:13px}
        .mem-close{position:absolute;top:10px;right:10px;width:34px;height:34px;background:rgba(0,0,0,0.55);border:none;border-radius:50%;color:#fff;font-size:13px;cursor:pointer;display:flex;align-items:center;justify-content:center;z-index:1;transition:.2s}
        .mem-close:hover{background:#6c63ff}
        @keyframes mfade{from{opacity:0}to{opacity:1}}
        @keyframes mscale{from{transform:scale(.86);opacity:0}to{transform:scale(1);opacity:1}}
      `;
      document.head.appendChild(st);
      document.body.appendChild(modal);

      const close = () => { modal.remove(); st.remove(); };
      modal.querySelector('.mem-close').addEventListener('click', close);
      modal.addEventListener('click', e => { if (e.target === modal) close(); });
      document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); }, { once: true });
    });
  });
}

/* ===== CONTACT FORM ===== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const name    = this.name.value.trim();
    const email   = this.email.value.trim();
    const subject = this.subject.value.trim();
    const message = this.message.value.trim();

    if (!name || !email || !subject || !message) { showNotification('Please fill in all fields.', 'error'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showNotification('Please enter a valid email.', 'error'); return; }

    const btn = this.querySelector('.submit-btn');
    const orig = btn.innerHTML;
    btn.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';
    btn.disabled = true;

    emailjs.sendForm('service_0fe7u5s', 'template_a11y5na', this, '98tA3GrZ8CKCHsRoe')
      .then(() => { showNotification("Message sent! I'll get back to you soon.", 'success'); form.reset(); })
      .catch(() => { showNotification('Something went wrong. Please try again.', 'error'); })
      .finally(() => { btn.innerHTML = orig; btn.disabled = false; });
  });
}

/* ===== NOTIFICATIONS ===== */
function showNotification(message, type = 'success') {
  let container = document.getElementById('notification-container');
  if (!container) { container = document.createElement('div'); container.id = 'notification-container'; document.body.appendChild(container); }

  const n = document.createElement('div');
  n.className = `notification ${type}`;
  n.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i> ${message}`;
  container.appendChild(n);

  setTimeout(() => {
    n.style.animation = 'slideOut 0.4s ease forwards';
    setTimeout(() => n.remove(), 400);
  }, 4000);
}
