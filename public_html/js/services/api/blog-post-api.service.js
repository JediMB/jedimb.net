import HttpClient from '../../http-client.js';
import BlogPost from '../../classes/blog-post.js';

export default class BlogPostApiService {
    constructor(httpClient = HttpClient.httpClient) {
        this.httpClient = httpClient;
    }

    async getBlogPosts() {
        const data = await this.httpClient.get('blog/posts');
        const blogPosts = [];

        data?.forEach(post => {
            blogPosts.push(new BlogPost(post));
        });

        return blogPosts;
    }
}