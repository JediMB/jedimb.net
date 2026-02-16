import httpClient from '/js/http-client.js';
import BlogPost from '/js/models/blog-post.js';
import BlogPostDTO from '/js/models/blog-post.dto.js';

export { blogPostApiService as default };

class BlogPostApiService {
    #httpClient;
    #api = 'blog/posts';

    constructor() {
        this.#httpClient = httpClient;
    }

    /**
     * @param {number} id 
     * @returns {Promise<([number, Date]|false)>}
     */
    async deleteBlogPost(id) {
        const response = await this.#httpClient.delete(this.#api, id);

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
        const response = await this.#httpClient.get(this.#api, id);

        if (!response.success)
            return false;

        if (!response.value)
            throw new Error('Get failed to return blog post data');

        return new BlogPost(response.value);
    }

    /** @returns {Promise<BlogPost[]>}  */
    async getBlogPosts() {
        const response = await this.#httpClient.get(this.#api);

        if (!response.success)
            return response;

        response.value = response.value.map(post => new BlogPost(post));

        return response;
    }

    /**
     * @param {BlogPostDTO} blogPostDTO
     * @returns {Promise<([BlogPost, Date]|false)>} 
     */
    async postBlogPost(blogPostDTO) {
        const response = await this.#httpClient.post(this.#api, blogPostDTO);

        if (!response.success)
            return false;

        if (!response.value.blogPost)
            throw new Error('Create failed to return blog post data');

        if (!response.value.modifiedOn)
            throw new Error('Create failed to return blog post table modified date');

        return [
            new BlogPost(response.value.blogPost),
            new Date(response.value.modifiedOn.date + response.value.modifiedOn.timezone)
        ];
    }
}
const blogPostApiService = new BlogPostApiService();