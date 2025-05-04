// DOM Elements
const header = document.querySelector('.site-header');
const scrollProgress = document.querySelector('.scroll-progress');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mainNav = document.querySelector('.main-nav');
const faqItems = document.querySelectorAll('.faq-item');

// Scroll Progress and Header Animation
function handleScroll() {
    const scrollPosition = window.scrollY;
    const totalHeight = document.body.scrollHeight - window.innerHeight;
    const scrollPercentage = (scrollPosition / totalHeight) * 100;

    scrollProgress.style.width = `${scrollPercentage}%`;

    if (scrollPosition > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}

// Mobile Menu Toggle
function toggleMobileMenu() {
    mainNav.classList.toggle('active');
    mobileMenuBtn.classList.toggle('active');
    document.body.classList.toggle('menu-open');
    
    // Toggle aria-expanded
    const isExpanded = mainNav.classList.contains('active');
    mobileMenuBtn.setAttribute('aria-expanded', isExpanded);
    
    // Prevent body scrolling when menu is open
    if (isExpanded) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

// Enhanced FAQ Functionality with Accessibility
function initFAQ() {
    faqItems.forEach((item, index) => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const toggle = item.querySelector('.faq-toggle');
        
        // Set up ARIA attributes
        question.setAttribute('id', `faq-question-${index}`);
        answer.setAttribute('id', `faq-answer-${index}`);
        question.setAttribute('aria-controls', `faq-answer-${index}`);
        question.setAttribute('aria-expanded', 'false');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all other FAQs
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                    otherItem.querySelector('.faq-toggle').textContent = '+';
                    otherItem.querySelector('.faq-answer').style.maxHeight = '0';
                    otherItem.querySelector('.faq-answer').style.opacity = '0';
                }
            });
            
            // Toggle current FAQ
            item.classList.toggle('active');
            question.setAttribute('aria-expanded', !isActive);
            
            // Update toggle symbol
            if (toggle) {
                toggle.textContent = isActive ? '+' : '−';
            }

            // Animate answer height and opacity
            if (!isActive) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
                answer.style.opacity = '1';
            } else {
                answer.style.maxHeight = '0';
                answer.style.opacity = '0';
            }
        });

        // Enable keyboard navigation
        question.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                question.click();
            }
        });
    });
}

// Smooth Scroll Implementation
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = anchor.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close mobile menu if open
                mainNav.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
                document.body.classList.remove('menu-open');
                document.body.style.overflow = '';
                
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // Update URL without jumping
                history.pushState(null, null, targetId);
            }
        });
    });
}

// Page Transition Effects
function initPageTransitions() {
    const pageElements = document.querySelectorAll('.page-transition');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '50px'
    });
    
    pageElements.forEach(element => {
        observer.observe(element);
    });
}

// Initialize all functionality
document.addEventListener('DOMContentLoaded', () => {
    initFAQ();
    initSmoothScroll();
    initPageTransitions();
    
    // Set up event listeners
    window.addEventListener('scroll', handleScroll);
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    
    // Handle escape key for accessibility
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mainNav.classList.contains('active')) {
            toggleMobileMenu();
        }
    });
    
    // Initialize scroll progress on page load
    handleScroll();
});

// Handle prefers-reduced-motion
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function updateMotionPreference() {
    const root = document.documentElement;
    if (prefersReducedMotion.matches) {
        root.style.setProperty('--transition', 'none');
        document.body.classList.add('reduce-motion');
    } else {
        root.style.setProperty('--transition', 'all 0.3s ease');
        document.body.classList.remove('reduce-motion');
    }
}

prefersReducedMotion.addEventListener('change', updateMotionPreference);
updateMotionPreference();