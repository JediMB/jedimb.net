import blogPostService from "/js/services/blog-post.service.js";
import { formatDate } from "/js/utilities/format-date.utility.js";

customElements.define('blog-view-component', class BlogViewComponent extends HTMLElement {
    #baseRoute;
    #currentPage;
    #pageSize;

    constructor() {
        super();
        this.#baseRoute = this.getAttribute('base-route');
        this.#currentPage = Number(this.getAttribute('start-page'));
        this.#pageSize = Number(this.getAttribute('page-size'));
    }

    connectedCallback() {
        const start = this.querySelector('#blog__items-start');
        const end = this.querySelector('#blog__items-end');
        const total = this.querySelector('#blog__items-total');

        const blogPosts = this.querySelector('blog-posts');
        /** @type {HTMLTemplateElement} */
        const blogPostTemplate = this.querySelector('[blog-post-template]');

        const pagination = this.querySelector('#blog__pagination');
        const lnkPrev = pagination.querySelector('#blog__pagination-previous');
        const lnkNext = pagination.querySelector('#blog__pagination-next');
        const lnkLast = pagination.querySelector('#blog__pagination-last');

        const pageList = pagination.querySelector('#blog__pagination-pages');

        blogPostService.subscription.subscribe(newBlogPost => {
            if (this.#currentPage !== 1)
                return;
            
            const clone = blogPostTemplate.content.cloneNode(true);

            clone.querySelector('.title').textContent = newBlogPost.title;

            const createdOn = clone.querySelector('.created-on');
            let dateString = formatDate(newBlogPost.createdOn)
            createdOn.textContent = dateString;
            createdOn.setAttribute('server-time', dateString);
            createdOn.title = dateString;

            /** @type {HTMLElement} */
            const modifiedOn = clone.querySelector('.modified-on');
            if (newBlogPost.modifiedOn) {
                dateString = formatDate(newBlogPost.modifiedOn);
                modifiedOn.textContent = dateString;
                modifiedOn.setAttribute('server-time', dateString);
                modifiedOn.title = dateString;
            }
            else
                modifiedOn.parentElement.remove();

            clone.querySelector('.content').innerHTML = newBlogPost.contentShort;

            blogPosts.prepend(clone);

            if (blogPosts.children.length > this.#pageSize) {
                blogPosts.lastElementChild.remove();
                // TODO: Update pagination if necessary
            }

            // TODO: Update start, end and total values
        });
    }

    disconnectedCallback() {}

    connectedMoveCallback() {}
});
