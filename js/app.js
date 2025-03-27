document.addEventListener('DOMContentLoaded', () => {
    const readMoreBtn = document.getElementById('read-more-btn');
    const fullBlogContent = document.getElementById('full-blog-content');
    const blogPreview = document.querySelector('.blog-preview');

    readMoreBtn.addEventListener('click', () => {
        const fullBlogText = `
            <p>Technology has solved old economic problems by giving us new psychological problems"</p>

            <p>This line is short but tall in the matter of its depth. Considering the length of this video, it explains why we have become more depressed and lonelier despite the rise of social media has made us connected more than ever.</p>

            <p>We are tired, and being tired affects how we respond to our environment and nature, also known as emotions.</p>

            <div class="blog-continuation">
                <p>Want to read the full in-depth analysis? <a href="#" class="full-article-link">Continue Reading</a></p>
            </div>
        `;

        fullBlogContent.innerHTML = fullBlogText;
        fullBlogContent.style.display = 'block';
        blogPreview.style.display = 'none';
    });
});