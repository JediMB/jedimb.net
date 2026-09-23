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

    /** @type {{published: '0'|'1'|'2', visibility: '0'|'1'|'2'}} */ #statuses = {};

    constructor() { super(); }

    connectedCallback() {
        const statusRow = this.querySelector('.admin__blog-post__status-row');
        this.#statusForm = statusRow.querySelector('#admin__blog-post__status-form');
        this.#itemCounters.start = statusRow.querySelector('#admin__blog-post__items-start');
        this.#itemCounters.end = statusRow.querySelector('#admin__blog-post__items-end');
        this.#itemCounters.total = statusRow.querySelector('#admin__blog-post__items-total');

        this.#list = this.querySelector('#admin__blog-post__list');
        this.#template = this.querySelector('#admin__blog-post__template');
        this.#pagination = this.querySelector('#admin__blog-post__pagination');

        this.#statusForm.addEventListener('change', event => {
            this.#statuses[event.target.name] = event.target.value;

            this.#loadPageContent();
        });

        const actionButtons = this.#list.querySelectorAll('[post-action]');
        this.#assignButtonActions(actionButtons);

        this.#pagination.onDataUpdate = data => {
            const counters = this.#itemCounters;
            counters.start.textContent = data.offset + 1;
            counters.end.textContent = data.offset + Number(this.#list.childElementCount);
            counters.total.textContent = data.itemCount;
        };

        this.#pagination.onPageChange = (page, updateHistory = true, next = undefined) => {
            this.#list.innerHTML = `<li>${MarkupConstants.loadingSpinner}</li>`;

            this.#loadPageContent(page, updateHistory, next);
        };
    }

    connectedMoveCallback() {}

    disconnectedCallback() {}

    /**
     * @param {HTMLButtonElement[]} buttons 
     * @param {number} [id=null] 
     */
    #assignButtonActions(buttons, id = null) {
        for (const button of buttons) {
            const postId = id ?? Number(button.dataset.id);
            
            if (isNaN(postId)) {
                console.error('Post ID for button is not a number', button);
                continue;
            }

            switch (button.getAttribute('post-action')) {
                case 'delete':
                    // TODO: Use a modal web component instead of confirm()
                    button.addEventListener('click', () => {
                        const message = button.dataset.prompt ?? 'Permanently delete this post?';

                        if (confirm(message)) {
                            button.toggleAttribute('btn-loading', true);
                            blogPostService.deleteBlogPost(postId,
                                next => {
                                    // TODO: Success notification
                                    this.#loadPageContent();
                                },
                                error => {
                                    // TODO: Error notification
                                    button.toggleAttribute('btn-loading', false);
                                }
                            );
                        }
                    });
                    break;

                case 'hide':
                    button.addEventListener('click', () => {
                        button.toggleAttribute('btn-loading', true);
                        blogPostService.hideBlogPost(postId,
                            () => {
                                // TODO: Success notification
                                this.#loadPageContent();
                            },
                            error => {
                                // TODO: Error notification
                                button.toggleAttribute('btn-loading', false);
                            }
                        );
                    });
                    break;

                case 'pin':
                    button.addEventListener('click', () => {
                        button.toggleAttribute('btn-loading', true);
                        blogPostService.pinBlogPost(postId,
                            () => {
                                // TODO: Success notification
                                this.#loadPageContent();
                            },
                            error => {
                                // TODO: Error notification
                                button.toggleAttribute('btn-loading', false);
                            }
                        );
                    });
                    break;

                case 'publish':
                    // TODO: Use a modal web component instead of confirm()
                    button.addEventListener('click', () => {
                        const message = button.dataset.prompt ?? 'Publish this post?';
                        
                        if (confirm(message)) {
                            button.toggleAttribute('btn-loading', true);
                            blogPostService.publishBlogPost(postId,
                                () => {
                                    // TODO: Success notification
                                    this.#loadPageContent();
                                },
                                error => {
                                    // TODO: Error notification
                                    button.toggleAttribute('btn-loading', false);
                                }
                            );
                        }
                    });
                    break;

                case 'unhide':
                    button.addEventListener('click', () => {
                        button.toggleAttribute('btn-loading', true);
                        blogPostService.unhideBlogPost(postId,
                            () => {
                                // TODO: Success notification
                                this.#loadPageContent();
                            },
                            error => {
                                // TODO: Error notification
                                button.toggleAttribute('btn-loading', false);
                            }
                        );
                    });
                    break;

                case 'unpin':
                    button.addEventListener('click', () => {
                        button.toggleAttribute('btn-loading', true);
                        blogPostService.unpinBlogPost(postId,
                            () => {
                                // TODO: Success notification
                                this.#loadPageContent();
                            },
                            error => {
                                // TODO: Error notification
                                button.toggleAttribute('btn-loading', false);
                            }
                        );
                    });
                    break;
            }

            button.removeAttribute('btn-loading');
        }
    }

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
            const postAction = button.getAttribute('post-action');

            if (postAction === 'hide' && newBlogPost.isHidden) {
                button.parentElement.remove();
                continue;
            }

            if (postAction === 'pin' && newBlogPost.isPinned) {
                button.parentElement.remove();
                continue;
            }

            if (postAction === 'publish') {
                if (newBlogPost.publishedOn) {
                    button.remove();
                    continue;
                }

                button.nextElementSibling?.remove();
            }

            if (postAction === 'unhide' && !newBlogPost.isHidden) {
                button.parentElement.remove();
                continue;
            }

            if (postAction === 'unpin' && !newBlogPost.isPinned) {
                button.parentElement.remove();
                continue;
            }

            button.dataset.id = id;
        }
        this.#assignButtonActions(buttons, id);

        return clone;
    }

    /**
     * @param {number} page 
     * @param {boolean} updateHistory
     * @param {() =>  void} next 
     */
    #loadPageContent(page = this.#pagination.getData().page, updateHistory = true, next = undefined) {
        blogPostService.getBlogPostsAdminData(page, this.#pagination.getData().pageSize, this.#statuses,
            (blogPosts, paginationData) => {
                const templateItems = blogPosts.map(post => this.#createBlogPostItem(post));
                this.#list.replaceChildren(...templateItems);
                this.#pagination.setData(paginationData, updateHistory);
                next?.call(this);
            }
        );
    }
}

customElements.define('blog-post-administration-component', BlogPostAdministrationComponent);
