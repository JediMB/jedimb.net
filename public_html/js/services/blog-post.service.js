import BlogPost from "/js/models/blog/blog-post.model.js";
import BlogPostDTO from "/js/models/blog/blog-post.dto.model.js";
import BlogPostSchedule from "/js/models/blog/blog-post-schedule.model.js";
import Emitter from "/js/utilities/emitter.js";
import Pagination from "/js/models/blog/pagination.model.js";
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
     * @param {(value: BlogPost) => void} next 
     * @param {(errors: string[]) => void} error
     * @returns {Promise<void>}
     */
    async deleteBlogPost(id, next, error) {
        const response = await this.#service.deleteBlogPost(id);

        if (!response.success)
            return error?.call(this, response.errors);

        next?.call(this, response.value);
    }

    /**
     * @param {number} id
     * @param {(value: BlogPost|undefined) => void} next 
     * @returns {Promise<void>}
     */
    async getBlogPost(id, next) {
        const post = await this.#service.getBlogPost(id);

        if (!post)
            throw new Error('Blog post not found');

        next?.call(this, post);
    }

    /**
     * @param {number} page 
     * @param {number} pageSize 
     * @param {(blogPosts: BlogPost[], pagination: Pagination) => void} next
     * @returns {Promise<void>}
     */
    async getBlogPosts(page, pageSize, next) {
        const { blogPosts, pagination } = await this.#service.getBlogPosts(page, pageSize);

        next?.call(this, blogPosts, pagination);
    }

    /**
     * @param {number} id 
     * @param {() => void} next 
     * @param {(errors: string[]) => void} error 
     * @returns {Promise<void>}
     */
    async hideBlogPost(id, next, error) {
        const result = await this.#service.hideBlogPost(id);

        if (!result.success)
            error?.call(this, result.errors);

        next?.call(this);
    }

    /**
     * @param {number} id 
     * @param {() => void} next 
     * @param {(errors: string[]) => void} error 
     * @returns {Promise<void>}
     */
    async pinBlogPost(id, next, error) {
        const result = await this.#service.pinBlogPost(id);

        if (!result.success)
            error?.call(this, result.errors);

        next?.call(this);
    }

    /**
     * 
     * @param {BlogPostDTO} blogPostDTO 
     * @param {(value: BlogPost) => void} next 
     * @param {(errors: string[]|object[]) => void} error 
     * @returns {Promise<void>}
     */
    async publishDraft(blogPostDTO, next, error) {
        const response = await this.#service.publishDraft(blogPostDTO);

        if (!response.success)
            return error?.call(this, response.errors);

        next?.call(this, response.value);
    }

    /**
     * 
     * @param {BlogPostDTO} blogPostDTO 
     * @param {(value: BlogPostSchedule) => void} next 
     * @param {(errors: string[]|object[]) => void} error 
     * @returns {Promise<void>}
     */
    async scheduleDraft(blogPostDTO, next, error) {
        const response = await this.#service.scheduleDraft(blogPostDTO);

        if (!response.success)
            return error?.call(this, response.errors);

        next?.call(this, response.value);
    }

    /**
     * @param {number} id 
     * @param {() => void} next 
     * @param {(errors: string[]) => void} error 
     * @returns {Promise<void>}
     */
    async unhideBlogPost(id, next, error) {
        const result = await this.#service.unhideBlogPost(id);

        if (!result.success)
            error?.call(this, result.errors);

        next?.call(this);
    }

    /**
     * @param {number} id 
     * @param {() => void} next 
     * @param {(errors: string[]) => void} error 
     * @returns {Promise<void>}
     */
    async unpinBlogPost(id, next, error) {
        const result = await this.#service.unpinBlogPost(id);

        if (!result.success)
            error?.call(this, result.errors);

        next?.call(this);
    }

    /**
     * 
     * @param {BlogPostDTO} blogPostDTO 
     * @param {(value: BlogPost) => void} next 
     * @param {(errors: string[]|object[]) => void} error 
     * @returns {Promise<void>}
     */
    async updateBlogPost(blogPostDTO, next, error) {
        const response = await this.#service.updateBlogPost(blogPostDTO);

        if (!response.success)
            return error?.call(this, response.errors);

        next?.call(this, response.value);
    }

    /**
     * 
     * @param {BlogPostDTO} blogPostDTO 
     * @param {(value: BlogPost) => void} next 
     * @param {(errors: string[]|object[]) => void} error 
     * @returns {Promise<void>}
     */
    async saveDraft(blogPostDTO, next, error) {
        const response = blogPostDTO.id
            ? await this.#service.updateDraft(blogPostDTO)
            : await this.#service.postDraft(blogPostDTO);

        if (!response.success)
            return error?.call(this, response.errors);

        next?.call(this, response.value);
    }
}
const blogPostService = new BlogPostService();