import PaginationComponent from "/js/components/pagination/pagination.module.js";
import MarkupConstants from "/js/constants/markup-constants.js";
import BlogPost from "/js/models/blog/blog-post.model.js";
import blogPostService from "/js/services/blog-post.service.js";

export default class BlogPostAdministrationComponent extends HTMLElement {
    /** @type {HTMLFormElement} */ #statusForm;
    /** @type {{start: HTMLSpanElement, end: HTMLSpanElement, total: HTMLSpanElement}} */ #itemCounters = {};
    /** @type {HTMLUListElement} */ #list;
    /** @type {HTMLTemplateElement} */ #template;
    /** @type {PaginationComponent} */ #pagination;

    constructor() { super(); }

    connectedCallback() {
        const statusRow = this.querySelector('#admin__blog-post__status-row');
        this.#statusForm = statusRow.querySelector('#admin__blog-post__status-form');
        this.#itemCounters.start = statusRow.querySelector('#admin__blog-post__items-start');
        this.#itemCounters.end = statusRow.querySelector('#admin__blog-post__items-end');
        this.#itemCounters.total = statusRow.querySelector('#admin__blog-post__items-total');

        this.#list = this.querySelector('#admin__blog-post__list');
        this.#template = this.querySelector('#admin__blog-post__template');
        this.#pagination = this.querySelector('#admin__blog-post__pagination');

        this.#pagination.onPageChange = (page, updateHistory = true, next = undefined) => {
            this.#list.innerHTML = `<li>${MarkupConstants.loadingSpinner}</li>`;

            this.#loadPageContent(page, updateHistory, next);
        };
    }

    connectedMoveCallback() {}

    disconnectedCallback() {}

    /**
     * @param {BlogPost} newBlogPost 
     * @returns {DocumentFragment} */
    #createBlogPostItem(newBlogPost) {
        /** @type {DocumentFragment} */
        const clone = this.#template.content.cloneNode(true);

        const id = newBlogPost.id;

        /** @type {HTMLAnchorElement} */
        const link = clone.querySelector('.admin__blog-post__link');
        link.href += id;
        link.prepend(document.createTextNode(newBlogPost.title));

        /** @type {HTMLDivElement} */
        const description = clone.querySelector('.admin__blog-post__description');
        description.textContent = newBlogPost.description;

        const buttons = clone.querySelectorAll('button');
        for (const button of buttons) {
            button.dataset.id = id;
        }

        return clone;
    }

    /**
     * @param {number} page 
     * @param {boolean} updateHistory
     * @param {() =>  void} next 
     */
    #loadPageContent(page = this.#pagination.getData().page, updateHistory = true, next = undefined) {
        blogPostService.getBlogPostsAdminData(page, this.#pagination.getData().pageSize,
            (blogPosts, paginationData) => {
                const templateItems = blogPosts.map(post => this.#createBlogPostItem(post));
                this.#list.replaceChildren(...templateItems);
                this.#pagination.setData(paginationData, updateHistory);
            } // TODO: statuses
        );
    }
}

customElements.define('blog-post-administration-component', BlogPostAdministrationComponent);
