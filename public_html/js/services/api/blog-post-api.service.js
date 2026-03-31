import httpClient from '/js/http-client.js';
import BlogPost from '/js/models/blog/blog-post.model.js';
import BlogPostDTO from '/js/models/blog/blog-post.dto.model.js';
import BlogPostSchedule from '/js/models/blog/blog-post-schedule.model.js';
import Pagination from '/js/models/blog/pagination.model.js';

export { blogPostApiService as default };

class BlogPostApiService {
    #httpClient;
    #api = {
        draft: 'blog/draft',
        post: 'blog/post',
        posts: 'blog/posts'
    };

    constructor() {
        this.#httpClient = httpClient;
    }

    /**
     * @param {number} id 
     * @returns {Promise<([number, Date]|false)>}
     */
    async deleteBlogPost(id) {
        const response = await this.#httpClient.delete(this.#api.post, id);

        if (!response.success)
            return false;

        if (!response.value)
            throw new Error('Delete failed to return blog post data');

        return [
            Number(response.value.id),
            new Date(response.value.modifiedOn.date + response.value.modifiedOn.timezone)
        ];
    }

    /**
     * @param {number} id 
     * @returns {Promise<(BlogPost|false)>}
     */
    async getBlogPost(id) {
        const response = await this.#httpClient.get(this.#api.post, id);

        if (!response.success)
            return false;

        if (!response.value)
            throw new Error('Get blog post failed to return blog post data');

        return new BlogPost(response.value);
    }

    /**
     * @param {number} page 
     * @param {number} pageSize 
     * @returns {Promise<{blogPosts: BlogPost[], pagination: Pagination}>}  */
    async getBlogPosts(page, pageSize) {
        const response = await this.#httpClient.get(this.#api.posts, page, pageSize);

        if (!response.success)
            return response;

        return {
            blogPosts: response.value.blogPosts.map(post => new BlogPost(post)),
            pagination: new Pagination(response.value.pagination)
        };
    }

    /**
     * @param {BlogPostDTO} blogPostDTO
     * @returns {Promise<({errors: object, value: { blogPost: BlogPost, schedule: BlogPostSchedule }})>} 
     */
    async postBlogPost(blogPostDTO) {
        const response = await this.#httpClient.post(this.#api.post, blogPostDTO);

        if (!response.success)
            return response;

        if (!response.value.id)
            throw new Error('Create blog post failed to return data');

        if (blogPostDTO.scheduledOn)
            response.value = { schedule: new BlogPostSchedule(response.value) };
        else
            response.value = { blogPost: new BlogPost(response.value) };

        return response;
    }

    /**
     * @param {BlogPostDTO} blogPostDTO 
     * @returns {Promise<({success: boolean, errors: object|undefined, value: BlogPost|undefined})>}
     */
    async postDraft(blogPostDTO) {
        const response = await this.#httpClient.post(this.#api.draft, blogPostDTO);

        if (!response.success)
            return response;

        if (!response.value.id)
            throw new Error('Post draft failed to return data');

        response.value = new BlogPost(response.value);

        return response;
    }

    /**
     * @param {BlogPostDTO} blogPostDTO 
     * @returns {Promise<({success: boolean, errors: object|undefined, value: BlogPost|undefined})>}
     */
    async updateDraft(blogPostDTO) {
        const response = await this.#httpClient.put(this.#api.draft, blogPostDTO);

        if (!response.success)
            return response;

        if (!response.value.id)
            throw new Error('Update draft failed to return data');

        response.value = new BlogPost(response.value);

        return response;
    }
}
const blogPostApiService = new BlogPostApiService();