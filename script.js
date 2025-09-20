// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Portfolio website loaded!');
    
    initSlider();
    initNavigation();
    initScrollAnimations();
    initSkillBars();
    initSmoothScrolling();
    initActiveSection();
    initMemoryGallery();
    initMobileMenu();
    
    // Test navigation
    console.log('Navigation links found:', document.querySelectorAll('.sidebar nav ul li a').length);
    console.log('Sections found:', document.querySelectorAll('section[id]').length);
});

// Slider functionality
function initSlider() {
    const slides = document.querySelectorAll('.slide');
    const dotsContainer = document.querySelector('.dots');
    
    if (!slides.length || !dotsContainer) return;
    
    let currentIndex = 0;
    
    // Create dots
    slides.forEach((_, index) => {
        const dot = document.createElement('span');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => showSlide(index));
        dotsContainer.appendChild(dot);
    });
    
    const dots = document.querySelectorAll('.dots span');
    
    function showSlide(index) {
        slides[currentIndex].classList.remove('active');
        dots[currentIndex].classList.remove('active');
        
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        
        currentIndex = index;
    }
    
    // Auto Slide
    setInterval(() => {
        let nextIndex = (currentIndex + 1) % slides.length;
        showSlide(nextIndex);
    }, 4000);
}

// Navigation functionality
function initNavigation() {
    const navLinks = document.querySelectorAll('.sidebar nav ul li a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Get target section
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                console.log('Scrolling to:', targetId, targetSection);
                
                // Simple scroll to section
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            } else {
                console.log('Section not found:', targetId);
            }
        });
    });
}

// Enhanced smooth scroll function
function scrollToSection(targetSection) {
    const headerOffset = 20;
    const elementPosition = targetSection.offsetTop;
    const offsetPosition = elementPosition - headerOffset;
    
    // Try modern smooth scrolling first
    if ('scrollBehavior' in document.documentElement.style) {
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    } else {
        // Fallback for older browsers
        smoothScrollTo(offsetPosition, 800);
    }
}

// Fallback smooth scroll for older browsers
function smoothScrollTo(targetPosition, duration) {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animation);
}

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe elements for animations
    const animatedElements = document.querySelectorAll([
        '.about-text',
        '.about-image',
        '.skill-category',
        '.timeline-item',
        '.experience-card',
        '.research-card',
        '.certificate-card',
        '.memory-item'
    ].join(', '));
    
    animatedElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

// Skill bars animation
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const width = progressBar.getAttribute('data-width');
                
                setTimeout(() => {
                    progressBar.style.width = width;
                }, 500);
                
                skillObserver.unobserve(progressBar);
            }
        });
    }, { threshold: 0.5 });
    
    skillBars.forEach(bar => {
        skillObserver.observe(bar);
    });
}

// Smooth scrolling
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Active section highlighting
function initActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.sidebar nav ul li a');
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeId = entry.target.getAttribute('id');
                
                navLinks.forEach(link => link.classList.remove('active'));
                
                const activeLink = document.querySelector(`.sidebar nav ul li a[href="#${activeId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '-100px 0px -100px 0px'
    });
    
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
}

// Memory gallery functionality
function initMemoryGallery() {
    const memoryItems = document.querySelectorAll('.memory-item');
    
    memoryItems.forEach(item => {
        item.addEventListener('click', function() {
            const modal = document.createElement('div');
            modal.className = 'memory-modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <span class="modal-close">&times;</span>
                    <img src="${this.querySelector('img').src}" alt="${this.querySelector('h3').textContent}">
                    <div class="modal-text">
                        <h3>${this.querySelector('h3').textContent}</h3>
                        <p>${this.querySelector('p').textContent}</p>
                    </div>
                </div>
            `;
            
            const modalStyles = `
                .memory-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.9);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10000;
                    animation: fadeIn 0.3s ease;
                }
                
                .modal-content {
                    position: relative;
                    max-width: 80%;
                    max-height: 80%;
                    background: white;
                    border-radius: 15px;
                    overflow: hidden;
                    animation: scaleIn 0.3s ease;
                }
                
                .modal-content img {
                    width: 100%;
                    height: auto;
                    max-height: 60vh;
                    object-fit: cover;
                }
                
                .modal-text {
                    padding: 20px;
                }
                
                .modal-close {
                    position: absolute;
                    top: 15px;
                    right: 20px;
                    font-size: 30px;
                    color: white;
                    cursor: pointer;
                    z-index: 1;
                    background: rgba(0, 0, 0, 0.5);
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes scaleIn {
                    from { transform: scale(0.8); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
            `;
            
            const styleSheet = document.createElement('style');
            styleSheet.textContent = modalStyles;
            document.head.appendChild(styleSheet);
            document.body.appendChild(modal);
            
            const closeModal = () => {
                modal.remove();
                styleSheet.remove();
            };
            
            modal.querySelector('.modal-close').addEventListener('click', closeModal);
            modal.addEventListener('click', function(e) {
                if (e.target === modal) closeModal();
            });
        });
    });
}

// Mobile menu functionality
function initMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const navLinks = document.querySelectorAll('.sidebar nav ul li a');
    
    if (mobileToggle && sidebar) {
        mobileToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            sidebar.classList.toggle('active');
        });
        
        // Close sidebar when clicking on nav links (mobile)
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    mobileToggle.classList.remove('active');
                    sidebar.classList.remove('active');
                }
            });
        });
        
        // Close sidebar when clicking outside (mobile)
        document.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                if (!sidebar.contains(e.target) && !mobileToggle.contains(e.target)) {
                    mobileToggle.classList.remove('active');
                    sidebar.classList.remove('active');
                }
            }
        });
    }
}

// Test function - can be called from browser console
function testNavigation() {
    const sections = ['home', 'about', 'skills', 'education', 'experience', 'research', 'certificates', 'memories'];
    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            console.log(`Section ${sectionId} found at position:`, section.offsetTop);
        } else {
            console.log(`Section ${sectionId} NOT FOUND`);
        }
    });
}

// Make test function available globally
window.testNavigation = testNavigation;

