document.addEventListener('DOMContentLoaded', () => {
    // Simple, focused functionality for the blog "Read More" button
    const readMoreBtn = document.getElementById('read-more-btn');
    
    if (readMoreBtn) {
        readMoreBtn.addEventListener('click', () => {
            const fullBlogContent = document.getElementById('full-blog-content');
            const blogPreview = document.querySelector('.blog-preview');
            
            if (fullBlogContent && blogPreview) {
                const fullBlogText = `
                    <p>"Technology has solved old economic problems by giving us new psychological problems"</p>

                    <p>This line is short but tall in the matter of its depth. It explains why we have become more depressed and lonelier despite social media connecting us more than ever.</p>

                    <p>We are tired, and being tired affects how we respond to our environment - our emotions.</p>

                    <div class="blog-continuation">
                        <p>Want to read the full in-depth analysis? <a href="https://open.substack.com/pub/justelsoninsights/p/digital-dopamine?utm_campaign=post&utm_medium=web" class="full-article-link" target="_blank">Continue Reading</a></p>
                    </div>
                `;

                fullBlogContent.innerHTML = fullBlogText;
                fullBlogContent.style.display = 'block';
                blogPreview.style.display = 'none';
            }
        });
    }
    
    // Animation trigger with IntersectionObserver
    const animatedElements = document.querySelectorAll('.app-card, .featured-blog-post, .newsletter-promo, .faq-item, h2, .social-links a');
    
    // Only set up observer if there are elements to animate
    if (animatedElements.length > 0) {
        // Reset animations so they can be triggered by scroll
        animatedElements.forEach(el => {
            el.style.animationPlayState = 'paused';
            el.style.opacity = '0';
        });
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // When element is in view
                if (entry.isIntersecting) {
                    // Play animation
                    entry.target.style.animationPlayState = 'running';
                    entry.target.style.opacity = '1';
                    
                    // Stop observing once animated
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1, // 10% of the element visible
            rootMargin: '0px 0px -50px 0px' // Slightly above the bottom of viewport
        });
        
        // Observe all elements
        animatedElements.forEach(el => {
            observer.observe(el);
        });
    }
});