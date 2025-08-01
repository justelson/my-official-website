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
 * - Theme toggle functionality
 */
document.addEventListener('DOMContentLoaded', () => {

    // --- DOM Element Selection ---
    const header = document.querySelector('.site-header');
    const scrollProgress = document.querySelector('.scroll-progress');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mainNav = document.querySelector('.main-nav');
    const mobileBackdrop = document.querySelector('.mobile-menu-backdrop');
    const pageElements = document.querySelectorAll('.page-transition');
    const contactForm = document.getElementById('contactForm');
    const themeToggle = document.getElementById('themeToggle');
    const themeIcons = {
        dark: document.querySelector('.theme-icon-dark'),
        light: document.querySelector('.theme-icon-light')
    };

    
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
            
            // Toggle backdrop
            if (mobileBackdrop) {
                mobileBackdrop.classList.toggle('active', isExpanded);
            }
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


    // --- Theme Functions ---

    /**
     * Toggles between light and dark themes
     */
    const toggleTheme = () => {
        const isLight = document.documentElement.classList.toggle('light-theme');
        const theme = isLight ? 'light' : 'dark';
        
        // Save preference to localStorage
        localStorage.setItem('theme', theme);
        
        // Dispatch custom event for any other scripts that might need to know about theme changes
        document.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
    };

    /**
     * Initializes the theme based on user preference or system settings
     */
    const initTheme = () => {
        // Check for saved theme preference or use system preference
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        // Apply theme
        if (savedTheme === 'light' || (!savedTheme && !prefersDark)) {
            document.documentElement.classList.add('light-theme');
        } else {
            document.documentElement.classList.remove('light-theme');
        }
    };

    // --- Initialization & Event Listeners ---

    // Initial setup
    initTheme();
    handleScroll();
    createPageTransitionObserver();

    // Attach event listeners
    window.addEventListener('scroll', throttle(handleScroll, 100)); // Throttled for performance
    
    // Theme toggle button
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        // Only apply system theme if user hasn't explicitly set a preference
        if (!localStorage.getItem('theme')) {
            if (e.matches) {
                document.documentElement.classList.remove('light-theme');
                if (themeIcon) themeIcon.textContent = '🌙';
            } else {
                document.documentElement.classList.add('light-theme');
                if (themeIcon) themeIcon.textContent = '🌞';
            }
        }
    });

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

    // Close mobile menu when clicking backdrop
    if (mobileBackdrop) {
        mobileBackdrop.addEventListener('click', () => {
            if (mainNav && mainNav.classList.contains('active')) {
                toggleMobileMenu();
            }
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (mainNav && mainNav.classList.contains('active') && 
            !mainNav.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            toggleMobileMenu();
        }
    });

    // Handle focus management for mobile menu and auto-close on link click
    if (mainNav) {
        const navLinks = mainNav.querySelectorAll('a');
        navLinks.forEach((link, index) => {
            // Auto-close mobile menu when clicking navigation links
            link.addEventListener('click', () => {
                if (mainNav.classList.contains('active')) {
                    toggleMobileMenu();
                }
            });
            
            link.addEventListener('keydown', (e) => {
                if (e.key === 'Tab' && mainNav.classList.contains('active')) {
                    // Trap focus within mobile menu
                    if (e.shiftKey && index === 0) {
                        e.preventDefault();
                        navLinks[navLinks.length - 1].focus();
                    } else if (!e.shiftKey && index === navLinks.length - 1) {
                        e.preventDefault();
                        navLinks[0].focus();
                    }
                }
            });
        });
    }
});
// -- Download Popup Functions ---

/**
 * Shows the download popup for a specific project
 * @param {string} projectId - The ID of the project
 */
function showDownloadPopup(projectId) {
    const popup = document.getElementById('downloadPopup');
    if (!popup) return;

    // Project configurations
    const projects = {
        'shop-pal': {
            title: 'Download Shop-pal',
            description: 'To download and run Shop-pal locally, follow these steps:',
            repoUrl: 'https://github.com/justelson/Shop-pal.git',
            folderName: 'Shop-pal',
            runTitle: 'Open in Browser',
            runInstructions: 'Simply open <code>index.html</code> in your preferred web browser. No installation required!',
            note: '<strong>Note:</strong> Shop-pal runs entirely in your browser with no server setup needed. All data is stored locally.'
        },
        'organizer': {
            title: 'Download Unified File Organizer',
            description: 'To download and run the Unified File Organizer, follow these steps:',
            repoUrl: 'https://github.com/justelson/The-organizer-apps.git',
            folderName: 'The-organizer-apps',
            runTitle: 'Run the Application',
            runInstructions: 'Install Python 3.8+ and required dependencies, then run <code>python UNIFIED_organizer.py</code>',
            note: '<strong>Note:</strong> This is a Python desktop application. Check the README for detailed installation instructions.'
        }
    };

    const project = projects[projectId];
    if (!project) return;

    // Update popup content
    document.getElementById('popupTitle').textContent = project.title;
    document.getElementById('popupDescription').textContent = project.description;
    document.getElementById('cloneCommand').textContent = `git clone ${project.repoUrl}`;
    document.getElementById('cdCommand').textContent = `cd ${project.folderName}`;
    document.getElementById('runTitle').textContent = project.runTitle;
    document.getElementById('runInstructions').innerHTML = project.runInstructions;
    document.getElementById('popupNote').innerHTML = project.note;

    // Store current project for copy functions
    window.currentProject = project;

    popup.classList.add('show');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

/**
 * Closes the download popup
 */
function closeDownloadPopup() {
    const popup = document.getElementById('downloadPopup');
    if (popup) {
        popup.classList.remove('show');
        document.body.style.overflow = ''; // Restore scrolling
    }
}

/**
 * Copies the clone command to clipboard
 */
function copyCloneCommand() {
    const text = document.getElementById('cloneCommand').textContent;
    copyToClipboard(text, 'cloneCopyBtn');
}

/**
 * Copies the cd command to clipboard
 */
function copyCdCommand() {
    const text = document.getElementById('cdCommand').textContent;
    copyToClipboard(text, 'cdCopyBtn');
}

/**
 * Copies text to clipboard
 * @param {string} text - The text to copy
 * @param {string} buttonId - The ID of the button that was clicked
 */
function copyToClipboard(text, buttonId) {
    navigator.clipboard.writeText(text).then(() => {
        // Show temporary feedback
        const btn = document.getElementById(buttonId);
        if (btn) {
            const originalText = btn.textContent;
            btn.textContent = 'Copied!';
            btn.style.background = 'var(--success-color)';
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '';
            }, 2000);
        }
    }).catch(err => {
        console.error('Failed to copy text: ', err);
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
    });
}

// Close popup when clicking outside of it
document.addEventListener('click', (e) => {
    const popup = document.getElementById('downloadPopup');
    if (popup && e.target === popup) {
        closeDownloadPopup();
    }
});

// Close popup with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeDownloadPopup();
    }
});

// Make functions globally available
window.showDownloadPopup = showDownloadPopup;
window.closeDownloadPopup = closeDownloadPopup;
window.copyToClipboard = copyToClipboard;
window.copyCloneCommand = copyCloneCommand;
window.copyCdCommand = copyCdCommand;