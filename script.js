document.addEventListener('DOMContentLoaded', () => {
  initSlider();
  initMobileMenu();
  initNavHighlight();
  initScrollAnimations();
  initProjectFilter();
  initMemoryModal();
  initContactForm();
});

/* ===== SLIDER ===== */
function initSlider() {
  const slides = document.querySelectorAll('.slide');
  const dotsContainer = document.querySelector('.dots');
  if (!slides.length || !dotsContainer) return;

  let current = 0;

  slides.forEach((_, i) => {
    const dot = document.createElement('span');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  const dots = dotsContainer.querySelectorAll('span');

  function goTo(index) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = index;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  setInterval(() => goTo((current + 1) % slides.length), 5000);
}

/* ===== MOBILE MENU ===== */
function initMobileMenu() {
  const toggle = document.getElementById('menuToggle');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!toggle || !sidebar) return;

  function openMenu() {
    toggle.classList.add('active');
    sidebar.classList.add('active');
    overlay.classList.add('active');
  }

  function closeMenu() {
    toggle.classList.remove('active');
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
  }

  toggle.addEventListener('click', () => {
    sidebar.classList.contains('active') ? closeMenu() : openMenu();
  });

  overlay.addEventListener('click', closeMenu);

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) closeMenu();
    });
  });
}

/* ===== NAV HIGHLIGHT ON SCROLL ===== */
function initNavHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  // Click smooth scroll
  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const id = link.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });

  // Intersection Observer for active state
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { threshold: 0.35, rootMargin: '-80px 0px -80px 0px' });

  sections.forEach(s => observer.observe(s));
}

/* ===== SCROLL ANIMATIONS ===== */
function initScrollAnimations() {
  const elements = document.querySelectorAll([
    '.expertise-card',
    '.timeline-content',
    '.experience-card',
    '.certificate-card',
    '.memory-item',
    '.contact-item',
    '.about-text',
    '.about-image',
    '.stat'
  ].join(','));

  elements.forEach(el => el.classList.add('fade-in'));

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
}

/* ===== PROJECT FILTER ===== */
function initProjectFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.experience-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      cards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        if (match) {
          card.classList.remove('hidden');
          card.style.animation = 'none';
          requestAnimationFrame(() => {
            card.style.animation = 'fadeCardIn 0.4s ease forwards';
          });
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // Inject filter animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeCardIn {
      from { opacity: 0; transform: translateY(20px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);
}

/* ===== MEMORY MODAL ===== */
function initMemoryModal() {
  const items = document.querySelectorAll('.memory-item');

  items.forEach(item => {
    item.addEventListener('click', () => {
      const imgSrc = item.querySelector('img').src;
      const title = item.querySelector('h3').textContent;
      const desc = item.querySelector('p').textContent;

      const modal = document.createElement('div');
      modal.className = 'mem-modal';
      modal.innerHTML = `
        <div class="mem-modal-inner">
          <button class="mem-close"><i class="fas fa-times"></i></button>
          <img src="${imgSrc}" alt="${title}" />
          <div class="mem-info">
            <h3>${title}</h3>
            <p>${desc}</p>
          </div>
        </div>
      `;

      const style = document.createElement('style');
      style.textContent = `
        .mem-modal {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.85);
          z-index: 10000;
          display: flex; align-items: center; justify-content: center;
          padding: 20px;
          animation: fadeIn 0.3s ease;
        }
        .mem-modal-inner {
          position: relative;
          max-width: 700px; width: 100%;
          background: #1e1e35;
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid rgba(108,99,255,0.3);
          animation: scaleIn 0.3s ease;
        }
        .mem-modal-inner img { width: 100%; max-height: 420px; object-fit: cover; display: block; }
        .mem-info { padding: 20px 24px; }
        .mem-info h3 { color: #fff; font-size: 18px; margin-bottom: 6px; }
        .mem-info p { color: #9090b0; font-size: 14px; }
        .mem-close {
          position: absolute; top: 12px; right: 12px;
          width: 36px; height: 36px;
          background: rgba(0,0,0,0.6); border: none;
          border-radius: 50%; color: #fff; font-size: 14px;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          z-index: 1; transition: background 0.2s;
        }
        .mem-close:hover { background: #6c63ff; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { transform: scale(0.85); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      `;
      document.head.appendChild(style);
      document.body.appendChild(modal);

      const close = () => { modal.remove(); style.remove(); };
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

    if (!name || !email || !subject || !message) {
      showNotification('Please fill in all fields.', 'error'); return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showNotification('Please enter a valid email address.', 'error'); return;
    }

    const btn = this.querySelector('.submit-btn');
    const original = btn.innerHTML;
    btn.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';
    btn.disabled = true;

    emailjs.sendForm('service_0fe7u5s', 'template_a11y5na', this, '98tA3GrZ8CKCHsRoe')
      .then(() => {
        showNotification("Message sent! I'll get back to you soon.", 'success');
        form.reset();
      })
      .catch(() => {
        showNotification('Something went wrong. Please try again.', 'error');
      })
      .finally(() => {
        btn.innerHTML = original;
        btn.disabled = false;
      });
  });
}

/* ===== NOTIFICATIONS ===== */
function showNotification(message, type = 'success') {
  let container = document.getElementById('notification-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'notification-container';
    document.body.appendChild(container);
  }

  const notif = document.createElement('div');
  notif.className = `notification ${type}`;
  notif.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i> ${message}`;
  container.appendChild(notif);

  setTimeout(() => {
    notif.style.animation = 'slideOutRight 0.4s ease forwards';
    setTimeout(() => notif.remove(), 400);
  }, 4000);
}
