import PageSelectorComponent from "/js/components/page-selector-component.js";
import PageStatsComponent from "/js/components/page-stats-component.js";
import MarkupConstants from "/js/constants/markup-constants.js";
import BlogPost from "/js/models/blog/blog-post.model.js";
import BlogPostComponent from "/js/components/blog-post-component.js";
import blogPostService from "/js/services/blog-post.service.js";

export default class BlogPostAdministrationComponent extends HTMLElement {
    /** @type {HTMLFormElement} */ #statusForm;
    /** @type {PageStatsComponent} */ #pageStats;
    /** @type {HTMLUListElement} */ #list;
    /** @type {HTMLTemplateElement} */ #template;
    /** @type {PageSelectorComponent} */ #pageSelector;

    /** @type {{published: '0'|'1'|'2', visibility: '0'|'1'|'2'}} */ #statuses = {};

    constructor() { super(); }

    connectedCallback() {
        this.#statusForm = this.querySelector(`#${this.id}__status-form`);
        this.#pageStats = this.querySelector(customElements.getName(PageStatsComponent));
        this.#list = this.querySelector(`#${this.id}__list`);        
        this.#template = this.querySelector(`#${this.id}__template`);
        this.#pageSelector = this.querySelector(customElements.getName(PageSelectorComponent));

        this.#statusForm.addEventListener('change', event => {
            this.#statuses[event.target.name] = event.target.value;

            this.#loadPageContent();
        });

        const pageNumber = this.#pageSelector.getData().page;
        /** @type {NodeListOf<BlogPostComponent>} */
        const blogPostComponents = this.#list.querySelectorAll(customElements.getName(BlogPostComponent));
        blogPostComponents.forEach(component => {
            component.ondelete = (_) => {
                this.#loadPageContent(pageNumber, false);
            };
            component.onupdate = (_) => {
                this.#loadPageContent(pageNumber, false);
            };
        });

        this.#pageSelector.onDataUpdate = data => {
            this.#pageStats.updateStats(data, this.#list.childElementCount);
        };

        this.#pageSelector.onPageChange = (page, doUpdateHistory = true, next = undefined) => {
            this.#list.innerHTML = `<li>${MarkupConstants.loadingSpinner}</li>`;
            this.#loadPageContent(page, doUpdateHistory, next);
        }
    }

    connectedMoveCallback() {}

    disconnectedCallback() {}

    /**
     * @param {BlogPost} newBlogPost 
     * @returns {DocumentFragment} */
    #createBlogPostItem(newBlogPost) {
        /** @type {DocumentFragment} */
        const clone = this.#template.content.cloneNode(true);
        /** @type {BlogPostComponent?} */
        const blogPostComponent = clone?.querySelector(customElements.getName(BlogPostComponent));

        if (!blogPostComponent) {
            console.error('Failed to create new blog post item');
            return;
        }

        blogPostComponent.dataset.id = newBlogPost.id;

        return clone;
    }

    /**
     * @param {number} page 
     * @param {boolean} doUpdateHistory
     * @param {() =>  void} next 
     */
    #loadPageContent(page = this.#pageSelector.getData().page, doUpdateHistory = true, next = undefined) {
        blogPostService.getBlogPostsAdminData(page, this.#pageSelector.getData().pageSize, this.#statuses,
            (blogPosts, paginationData) => {
                const templateItems = blogPosts.map(post => this.#createBlogPostItem(post));
                this.#list.replaceChildren(...templateItems);

                /** @type {NodeListOf<BlogPostComponent>} */
                const blogPostComponents = this.#list.querySelectorAll(customElements.getName(BlogPostComponent));
                blogPostComponents.forEach((component, index) => {
                    component.setup(blogPosts[index]);
                    component.ondelete = (_) => {
                        this.#loadPageContent(page, false);
                    };
                    component.onupdate = (_) => {
                        this.#loadPageContent(page, false);
                    };
                });

                this.#pageSelector.setData(paginationData, doUpdateHistory);
                next?.call(this);
            }
        );
    }
}

customElements.define('blog-post-administration-component', BlogPostAdministrationComponent);
