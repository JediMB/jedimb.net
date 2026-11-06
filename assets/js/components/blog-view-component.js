import blogPostService from "/js/services/blog-post.service.js";
import BlogPostShortComponent from "/js/components/blog/blog-post-short-component.js";
import MarkupConstants from "/js/constants/markup-constants.js";
import PageSelectorComponent from "/js/components/page-selector-component.js";
import PageStatsComponent from "/js/components/page-stats-component.js";
import sessionService from "/js/services/session.service.js";
import { UserRole } from "/js/enums/user-role.enum.js";

export default class BlogViewComponent extends HTMLElement {
    #editingPermissions = false;

    /** @type {PageStatsComponent} */ #pageStats;
    /** @type {HTMLElement} */ #blogPosts;
    /**@type {PageSelectorComponent} */ #pageSelector;
    /** @type {HTMLTemplateElement} */ #template;

    constructor() {
        super();
    }

    connectedCallback() {
        sessionService.user.subscribe({
            next: user => {
                // TODO: Proper permission checks
                const editingPermissions = user && (user.role === UserRole.Administrator || user.role === UserRole.Contributor);
                this.#editingPermissions = editingPermissions;

                this.querySelectorAll('article-toolbar').forEach(toolbar => toolbar.toggleAttribute('hidden', !editingPermissions));
            }
        }, { getCurrent: true });

        this.#pageStats = this.querySelector(customElements.getName(PageStatsComponent));

        this.#blogPosts = this.querySelector('blog-posts');
        this.#template = this.querySelector('template');

        this.#pageSelector = this.querySelector(customElements.getName(PageSelectorComponent));

        const pageNumber = this.#pageSelector.getData().page;
        /** @type {NodeListOf<BlogPostShortComponent>} */
        const blogPostShortComponents = this.#blogPosts.querySelectorAll(customElements.getName(BlogPostShortComponent));
        blogPostShortComponents.forEach(component => {
            component.ondelete = (_) => {
                this.#loadPageContent(pageNumber, false);
            };
            component.onupdate = (_) => {
                this.#loadPageContent(pageNumber, false);
            };
        });

        this.#pageSelector.onDataUpdate = data =>  {
            this.#pageStats.updateStats(data, this.#blogPosts.childElementCount);
        };

        this.#pageSelector.onPageChange = (page, doUpdateHistory = true, next = undefined) => {
            this.#blogPosts.innerHTML = MarkupConstants.loadingSpinner;

            this.#loadPageContent(page, doUpdateHistory, next);
        };

        blogPostService.subscription.subscribe({
            next: newBlogPost => {
                const paginationData = this.#pageSelector.getData();
                paginationData.itemCount++;

                if (paginationData.page !== 1) {
                    paginationData.offset++;
                    this.#pageSelector.setData(paginationData, false);
                    return;
                }
                
                this.#blogPosts.prepend(this.#template.content.cloneNode(true));
                /** @type {BlogPostShortComponent} */
                const blogPostShortComponent = this.#blogPosts.firstElementChild;
                blogPostShortComponent.setup(newBlogPost);

                if (this.#blogPosts.childElementCount > paginationData.pageSize) {
                    this.#blogPosts.lastElementChild.remove();
                    paginationData.pageCount = Math.ceil(paginationData.itemCount / paginationData.pageSize);
                }

                this.#pageSelector.setData(paginationData, false);
            }
        });
    }

    connectedMoveCallback() {}

    disconnectedCallback() {}

    /**
     * @param {number} page 
     * @param {boolean} doUpdateHistory
     * @param {() =>  void} next 
     */
    #loadPageContent(page = this.#pageSelector.getData().page, doUpdateHistory = true, next = undefined) {
        blogPostService.getBlogPosts(page, this.#pageSelector.getData().pageSize,
            (blogPosts, paginationData) => {
                const templateItems = blogPosts.map(_ => this.#template.content.cloneNode(true));
                this.#blogPosts.replaceChildren(...templateItems);

                /** @type {BlogPostShortComponent[]} */
                const blogPostShortComponents = Array.from(this.#blogPosts.children);
                blogPostShortComponents.forEach((component, index) => {
                    component.setup(blogPosts[index], this.#editingPermissions);
                    component.ondelete = (_) => {
                        this.#loadPageContent(page, false);
                    };
                    component.onupdate =  (_) => {
                        this.#loadPageContent(page, false);
                    };
                });

                this.#pageSelector.setData(paginationData, doUpdateHistory);
                next?.call(this);
            }
        );
    }
}

customElements.define('blog-view-component', BlogViewComponent);