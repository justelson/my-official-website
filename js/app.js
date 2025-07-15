document.addEventListener('DOMContentLoaded', () => {

    // --- DOM Elements ---
    const header = document.querySelector('.site-header');
    const scrollProgress = document.querySelector('.scroll-progress');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mainNav = document.querySelector('.main-nav');
    const pageElements = document.querySelectorAll('.page-transition');
    const scrambleElements = document.querySelectorAll('[data-scramble-text]');
    const contactForm = document.getElementById('contactForm');

    // --- Text Scramble Effect ---
    class TextScrambler {
        constructor(el) {
            this.el = el;
            this.chars = '!<>-_\\/[]{}—=+*^?#________';
            this.update = this.update.bind(this);
        }

        setText(newText) {
            const oldText = this.el.innerText;
            const length = Math.max(oldText.length, newText.length);
            this.queue = [];
            for (let i = 0; i < length; i++) {
                const from = oldText[i] || '';
                const to = newText[i] || '';
                const start = Math.floor(Math.random() * 40);
                const end = start + Math.floor(Math.random() * 40);
                this.queue.push({ from, to, start, end });
            }
            cancelAnimationFrame(this.frameRequest);
            this.frame = 0;
            this.update();
        }

        update() {
            let output = '';
            let complete = 0;
            for (let i = 0, n = this.queue.length; i < n; i++) {
                let { from, to, start, end, char } = this.queue[i];
                if (this.frame >= end) {
                    complete++;
                    output += to;
                } else if (this.frame >= start) {
                    if (!char || Math.random() < 0.28) {
                        char = this.randomChar();
                        this.queue[i].char = char;
                    }
                    output += `<span class="scramble-char">${char}</span>`;
                } else {
                    output += from;
                }
            }
            this.el.innerHTML = output;
            if (complete === this.queue.length) {
                // Done
            } else {
                this.frameRequest = requestAnimationFrame(this.update);
                this.frame++;
            }
        }
        randomChar() {
            return this.chars[Math.floor(Math.random() * this.chars.length)];
        }
    }

    // --- Event Handlers ---
    const handleScroll = () => {
        const scrollPosition = window.scrollY;
        const totalHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercentage = totalHeight > 0 ? (scrollPosition / totalHeight) * 100 : 0;

        if (scrollProgress) {
            scrollProgress.style.width = `${scrollPercentage}%`;
        }

        if (header) {
            header.classList.toggle('scrolled', scrollPosition > 50);
        }
    };

    const toggleMobileMenu = () => {
        if (mainNav && mobileMenuBtn) {
            mainNav.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
            document.body.classList.toggle('menu-open');
            const isExpanded = mainNav.classList.contains('active');
            mobileMenuBtn.setAttribute('aria-expanded', isExpanded);
        }
    };
    
    // --- Intersection Observers ---
    const createPageTransitionObserver = () => {
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
    
    const createScrambleObserver = () => {
        const scramblers = Array.from(scrambleElements).map(el => ({ el, fx: new TextScrambler(el) }));
        
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const scrambler = scramblers.find(s => s.el === entry.target);
                    if (scrambler) {
                        const targetText = entry.target.getAttribute('data-scramble-text');
                        scrambler.fx.setText(targetText);
                    }
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        scrambleElements.forEach(element => observer.observe(element));
    };


    // --- Contact Form ---
    const handleContactForm = async (e) => {
        e.preventDefault();
        const form = e.target;
        const statusDiv = document.getElementById('formStatus');
        const submitButton = form.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;

        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        statusDiv.style.display = 'none';

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                statusDiv.textContent = 'Message sent successfully!';
                statusDiv.className = 'success';
                form.reset();
            } else {
                throw new Error('Server responded with an error.');
            }
        } catch (error) {
            statusDiv.textContent = 'Failed to send message. Please try again later.';
            statusDiv.className = 'error';
        } finally {
            submitButton.textContent = originalButtonText;
            submitButton.disabled = false;
            statusDiv.style.display = 'block';
        }
    };


    // --- Initialization ---
    handleScroll(); // Initial call
    createPageTransitionObserver();
    
    if (scrambleElements.length > 0) {
        createScrambleObserver();
    }
    
    window.addEventListener('scroll', handleScroll);

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mainNav && mainNav.classList.contains('active')) {
            toggleMobileMenu();
        }
    });

    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
});