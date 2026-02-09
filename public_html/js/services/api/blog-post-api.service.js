import httpClient from '../../http-client.js';
import BlogPost from '../../models/blog-post.js';

export { blogPostApiService as default };

class BlogPostApiService {
    #httpClient;

    constructor() {
        this.#httpClient = httpClient;
    }

    /** @returns {BlogPost[]}  */
    async getBlogPosts() {
        const response = await this.#httpClient.get('blog/posts');

        if (!response.success)
            return response;

        response.value = response.value.map(post => new BlogPost(post));

        return response;
    }
}
const blogPostApiService = new BlogPostApiService();