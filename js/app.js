/**
 * app.js
 * 
 * Author: Gemini
 * Description: Main JavaScript for the Just Elson website.
 * Features:
 * - Mobile menu toggle
 * - Header styling on scroll
 * - Scroll progress bar
 * - Page element fade-in transitions
 * - Asynchronous contact form submission
 */
document.addEventListener('DOMContentLoaded', () => {

    // --- DOM Element Selection ---
    const header = document.querySelector('.site-header');
    const scrollProgress = document.querySelector('.scroll-progress');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mainNav = document.querySelector('.main-nav');
    const pageElements = document.querySelectorAll('.page-transition');
    const contactForm = document.getElementById('contactForm');

    
    // --- Utility Functions ---

    /**
     * Throttles a function to limit its execution rate.
     * @param {Function} func - The function to throttle.
     * @param {number} limit - The throttle duration in milliseconds.
     * @returns {Function} - The throttled function.
     */
    const throttle = (func, limit) => {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    };


    // --- Event Handlers ---

    /**
     * Handles scroll-related UI updates like the progress bar and header style.
     */
    const handleScroll = () => {
        const scrollPosition = window.scrollY;
        const totalHeight = document.body.scrollHeight - window.innerHeight;
        
        // Update scroll progress bar
        if (scrollProgress && totalHeight > 0) {
            const scrollPercentage = (scrollPosition / totalHeight) * 100;
            scrollProgress.style.width = `${scrollPercentage}%`;
        }
        
        // Add scrolled class to header
        if (header) {
            header.classList.toggle('scrolled', scrollPosition > 50);
        }
    };

    /**
     * Toggles the mobile navigation menu.
     */
    const toggleMobileMenu = () => {
        if (mainNav && mobileMenuBtn) {
            const isExpanded = mainNav.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
            mobileMenuBtn.setAttribute('aria-expanded', isExpanded);
            document.body.classList.toggle('menu-open', isExpanded);
        }
    };

    /**
     * Handles the contact form submission asynchronously.
     * @param {Event} e - The form submission event.
     */
    const handleContactForm = async (e) => {
        e.preventDefault();
        const form = e.target;
        const statusDiv = document.getElementById('formStatus');
        const submitButton = form.querySelector('button[type="submit"]');
        
        if (!statusDiv || !submitButton) return;

        const originalButtonText = submitButton.textContent;
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        statusDiv.style.display = 'none';

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify(Object.fromEntries(new FormData(form)))
            });

            if (response.ok) {
                statusDiv.textContent = 'Message sent successfully!';
                statusDiv.className = 'success';
                form.reset();
            } else {
                const result = await response.json();
                throw new Error(result.message || 'Server responded with an error.');
            }
        } catch (error) {
            statusDiv.textContent = 'Failed to send message. Please try again later.';
            statusDiv.className = 'error';
            console.error('Form Submission Error:', error);
        } finally {
            submitButton.textContent = originalButtonText;
            submitButton.disabled = false;
            statusDiv.style.display = 'block';
        }
    };


    // --- Intersection Observers ---

    /**
     * Sets up an Intersection Observer to animate elements as they enter the viewport.
     */
    const createPageTransitionObserver = () => {
        if (pageElements.length === 0) return;
        
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        pageElements.forEach(element => observer.observe(element));
    };


    // --- Initialization & Event Listeners ---

    // Initial call to set states correctly on page load
    handleScroll();
    createPageTransitionObserver();

    // Attach event listeners
    window.addEventListener('scroll', throttle(handleScroll, 100)); // Throttled for performance

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }

    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
    
    // Close mobile menu with the Escape key for accessibility
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mainNav && mainNav.classList.contains('active')) {
            toggleMobileMenu();
        }
    });
});