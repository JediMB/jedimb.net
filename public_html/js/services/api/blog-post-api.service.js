import HttpClient from '../../http-client.js';
import BlogPost from '../../models/blog-post.js';

export default class BlogPostApiService {
    constructor(httpClient = HttpClient.httpClient) {
        this.httpClient = httpClient;
    }

    async getBlogPosts() {
        const response = await this.httpClient.get('blog/posts');
        const blogPosts = [];

        if (!response.success)
            return response;

        response.value?.forEach(post => {
            blogPosts.push(new BlogPost(post));
        });

        return { success: true, value: blogPosts };
    }
}