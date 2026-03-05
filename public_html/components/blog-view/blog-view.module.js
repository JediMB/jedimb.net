import blogPostService from "/js/services/blog-post.service.js";

customElements.define('blog-view-component', class BlogViewComponent extends HTMLElement {
    #baseRoute;
    #currentPage;

    constructor() {
        super();
        this.#baseRoute = this.getAttribute('base-route');
        this.#currentPage = Number(this.getAttribute('start-page'));
    }

    connectedCallback() {
        const blogPosts = this.querySelector('blog-posts');

        blogPostService.subscription.subscribe(newBlogPost => {
            if (this.#currentPage !== 1)
                return;
        });
    }

    disconnectedCallback() {}

    connectedMoveCallback() {}
});
