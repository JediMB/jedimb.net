import BlogPost from "/js/models/blog-post.js";
import BlogPostDTO from "/js/models/blog-post.dto.js";
import blogPostApiService from "/js/services/api/blog-post-api.service.js";
import Emitter from "/js/utilities/emitter.js";


export { blogPostService as default };

class BlogPostService {
    /** @type {Emitter<BlogPost[]>} */
    #blogPosts = new Emitter([]);
    #service = blogPostApiService;

    constructor() {}

    /**
     * @param {BlogPostDTO} blogPostDTO 
     */
    async createBlogPost(blogPostDTO) {
        const post = await this.#service.postBlogPost(blogPostDTO);

        console.log(post);
    }

    /**
     * @param {number} id
     * @param {(value: BlogPost|undefined) => void} next 
     * @returns {void}
     */
    async getBlogPost(id, next) {
        const blogPosts = this.#blogPosts.getValue();
        const cachedPost = blogPosts.find(b => b.id === id);

        if (cachedPost)
            return next.call(this, cachedPost);

        const fetchedPost = await this.#service.getBlogPost(id);

        if (!fetchedPost)
            throw new Error('Blog post not found');

        blogPosts.push(fetchedPost);
        this.#blogPosts.setValue([...blogPosts]);

        next.call(this, fetchedPost);
    }
}
const blogPostService = new BlogPostService();