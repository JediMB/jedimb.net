import BlogPost from "/js/models/blog-post.js";
import BlogPostDTO from "/js/models/blog-post.dto.js";
import blogPostApiService from "/js/services/api/blog-post-api.service.js";
import Emitter from "/js/utilities/emitter.js";


export { blogPostService as default };

class BlogPostService {
    #service = blogPostApiService;
    /** @type {Emitter<BlogPost>} */ #newBlogPost = new Emitter(null);

    constructor() {}

    get subscription() { return this.#newBlogPost; }

    /**
     * @param {BlogPostDTO} blogPostDTO 
     * @param {(value: BlogPost) => void} next 
     * @param {(errors: object) => void} error
     * @returns {Promise<void>}
     */
    async createBlogPost(blogPostDTO, next, error) {
        const response = await this.#service.postBlogPost(blogPostDTO);

        if (!response.success)
            return error?.call(this, response.errors);

        this.#newBlogPost.setValue(response.value.blogPost);
        next?.call(this, response.value.blogPost);
    }

    /**
     * @param {number} id
     * @param {(value: BlogPost|undefined) => void} next 
     * @returns {void}
     */
    async getBlogPost(id, next) {
        const post = await this.#service.getBlogPost(id);

        if (!post)
            throw new Error('Blog post not found');

        next?.call(this, post);
    }
}
const blogPostService = new BlogPostService();