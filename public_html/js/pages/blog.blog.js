import BlogPostApiService from "../services/api/blog-post-api.service.js";

const blogPostApiService = new BlogPostApiService();

const output = document.querySelector('main');
const template = output.querySelector('template');

const blogPosts = await blogPostApiService.getBlogPosts();

blogPosts.forEach(post => {
    const cloneNode = template.content.cloneNode(true);
    cloneNode.querySelector('article > h2').innerHTML = `<a href="/blog${post.permalink}">` + post.title + '</a>';
    const byline = cloneNode.querySelector('article-byline');
    byline.querySelector('date-created').textContent = post.createdOn.toLocaleString();
    
    if (post.modifiedOn)
        byline.querySelector('date-modified').textContent = '– Last modified ' + post.modifiedOn.toLocaleString();
    else
        byline.querySelector('date-modified').remove();

    cloneNode.querySelector('article-content').innerHTML = post.content +
        (post.content.match('(.*(?<=<!--[ ]*SPLIT[ ]*-->))')
            ? `<a href="/blog${post.permalink}">Read more...</a>`
            : '');

    output.appendChild(cloneNode);
});