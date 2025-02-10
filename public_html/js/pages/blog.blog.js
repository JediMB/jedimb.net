import BlogPostApiService from "../services/api/blog-post-api.service.js";

const blogPostApiService = new BlogPostApiService();

const output = document.querySelector('main');
const template = output.querySelector('template');

const blogPosts = await blogPostApiService.getBlogPosts();

blogPosts.forEach(post => {
    const cloneNode = template.content.cloneNode(true);
    cloneNode.querySelector('section > h2').innerHTML = `<a href="/blog${post.permalink}">` + post.title + '</a>';
    cloneNode.querySelector('section-byline').textContent = post.created_on;
    cloneNode.querySelector('section-content').innerHTML = post.content +
        (post.content.match('(.*(?<=<!--[ ]*SPLIT[ ]*-->))')
            ? `<a href="/blog${post.permalink}">Read more...</a>`
            : '');

    output.appendChild(cloneNode);
});