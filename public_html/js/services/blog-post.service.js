import BlogPost from "/js/models/blog/blog-post.model.js";
import BlogPostDTO from "/js/models/blog/blog-post.dto.model.js";
import BlogPostSchedule from "/js/models/blog/blog-post-schedule.model.js";
import Emitter from "/js/utilities/emitter.js";
import blogPostApiService from "/js/services/api/blog-post-api.service.js";

export { blogPostService as default };

class BlogPostService {
    #service = blogPostApiService;
    /** @type {Emitter<BlogPost>} */ #newBlogPost = new Emitter(null);

    constructor() {}

    get subscription() { return this.#newBlogPost; }

    /**
     * @param {BlogPostDTO} blogPostDTO 
     * @param {(value: { blogPost: BlogPost, schedule: BlogPostSchedule }) => void} next 
     * @param {(errors: object) => void} error
     * @returns {Promise<void>}
     */
    async createBlogPost(blogPostDTO, next, error) {
        const response = await this.#service.postBlogPost(blogPostDTO);

        if (!response.success)
            return error?.call(this, response.errors);

        if (response.value.blogPost)
            this.#newBlogPost.setValue(response.value.blogPost);

        next?.call(this, response.value);
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