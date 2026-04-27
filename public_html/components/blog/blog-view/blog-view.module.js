import PaginationComponent from "/js/components/pagination/pagination.module.js";
import BlogPost from "/js/models/blog/blog-post.model.js";
import blogPostService from "/js/services/blog-post.service.js";
import sessionService from "/js/services/session.service.js";
import { UserRole } from "/js/enums/user-role.enum.js";
import { formatDate } from "/js/utilities/format-date.utility.js";

customElements.define('blog-view-component', class BlogViewComponent extends HTMLElement {
    #editingPermissions = false;

    /**@type {PaginationComponent} */ #pagination;

    /** @type {HTMLSpanElement} */ #start;
    /** @type {HTMLSpanElement} */ #end;
    /** @type {HTMLSpanElement} */ #total;

    /** @type {HTMLElement} */ #blogPosts;
    /** @type {HTMLTemplateElement} */ #blogPostTemplate;

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

        this.#start = this.querySelector('#blog__items-start');
        this.#end = this.querySelector('#blog__items-end');
        this.#total = this.querySelector('#blog__items-total');

        this.#blogPosts = this.querySelector('blog-posts');
        this.#blogPostTemplate = this.querySelector('[blog-post-template]');

        this.#pagination = this.querySelector('#blog__pagination');

        const actionButtons = this.#blogPosts.querySelectorAll('[post-action]');
        this.#assignButtonActions(actionButtons);

        this.#pagination.onDataUpdate = data =>  {
            this.#start.textContent = data.offset + 1;
            this.#end.textContent = data.offset + Number(this.#blogPosts.childElementCount);
            this.#total.textContent = data.itemCount;
        };

        this.#pagination.onPageChange = (page, updateHistory = true, next = undefined) => {
            this.#blogPosts.innerHTML = `<svg is-loading width="2em" height="2em">
                <use xlink:href="#svg-loading" href="#svg-loading"></use>
            </svg>`;

            this.#loadPageContent(page, updateHistory, next);
        };

        blogPostService.subscription.subscribe({
            next: newBlogPost => {
                const paginationData = this.#pagination.getData();
                paginationData.itemCount++;

                if (paginationData.page !== 1) {
                    paginationData.offset++;
                    this.#pagination.setData(paginationData, false);
                    return;
                }
                
                this.#blogPosts.prepend(
                    this.#createBlogPostItem(newBlogPost)
                );

                if (this.#blogPosts.childElementCount > paginationData.pageSize) {
                    this.#blogPosts.lastElementChild.remove();
                    paginationData.pageCount = Math.ceil(paginationData.itemCount / paginationData.pageSize);
                }

                this.#pagination.setData(paginationData, false);
            }
        });
    }

    disconnectedCallback() {}

    connectedMoveCallback() {}

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
                            button.parentElement.toggleAttribute('hidden', true);
                            blogPostService.deleteBlogPost(postId,
                                next => {
                                    // TODO: Success notification
                                    this.#loadPageContent();
                                },
                                error => {
                                    // TODO: Error notification
                                    button.parentElement.removeAttribute('hidden');
                                }
                            );
                        }
                    });
                    continue;

                case 'hide':
                    button.addEventListener('click', () => {
                        button.parentElement.toggleAttribute('hidden', true);
                        blogPostService.hideBlogPost(postId,
                            () => {
                                // TODO: Success notification
                                this.#loadPageContent();
                            },
                            error => {
                                // TODO: Error notification
                                button.parentElement.removeAttribute('hidden');
                            }
                        );
                    });
                    continue;

                case 'pin':
                    button.addEventListener('click', () => {
                        button.parentElement.toggleAttribute('hidden', true);
                        blogPostService.pinBlogPost(postId,
                            () => {
                                // TODO: Success notification
                                this.#loadPageContent();
                            },
                            error => {
                                // TODO: Error notification
                                button.parentElement.removeAttribute('hidden');
                            }
                        );
                    });
                    continue;

                case 'unpin':
                    button.addEventListener('click', () => {
                        button.parentElement.toggleAttribute('hidden', true);
                        blogPostService.unpinBlogPost(postId,
                            () => {
                                // TODO: Success notification
                                this.#loadPageContent();
                            },
                            error => {
                                // TODO: Error notification
                                button.parentElement.removeAttribute('hidden');
                            }
                        );
                    });
                    continue;
            }
        }
    }

    /**
     * @param {BlogPost} newBlogPost 
     * @returns {DocumentFragment} */
    #createBlogPostItem(newBlogPost) {
        const clone = this.#blogPostTemplate.content.cloneNode(true);
        
        const id = newBlogPost.id;

        /** @type {HTMLElement} */
        const article = clone.querySelector('article');
        article.dataset.id = id;
        article.classList.toggle('article-pinned', newBlogPost.isPinned);

        /** @type {HTMLAnchorElement} */
        const headingLink = clone.querySelector('.title');
        headingLink.textContent = newBlogPost.title;
        headingLink.href += newBlogPost.permalink;

        const createdOn = clone.querySelector('.created-on');
        let dateString = formatDate(newBlogPost.createdOn)
        createdOn.textContent = dateString;
        createdOn.setAttribute('date-string', dateString);
        createdOn.title = dateString;

        /** @type {HTMLElement} */
        const modifiedOn = clone.querySelector('.modified-on');
        if (newBlogPost.modifiedOn) {
            dateString = formatDate(newBlogPost.modifiedOn);
            modifiedOn.textContent = dateString;
            modifiedOn.setAttribute('date-string', dateString);
            modifiedOn.title = dateString;
        }
        else
            modifiedOn.parentElement.remove();

        const toolbar = clone.querySelector('article-toolbar');
        toolbar.toggleAttribute('hidden', !this.#editingPermissions);

        /** @type {HTMLAnchorElement} */
        const editLink = toolbar.querySelector('[post-edit]');
        editLink.href += id;

        const actionButtons = toolbar.querySelectorAll('[post-action]');
        this.#assignButtonActions(actionButtons, id);

        clone.querySelector('.content').innerHTML = newBlogPost.contentShort;

        return clone;
    }

    /**
     * @param {number} page 
     * @param {boolean} updateHistory
     * @param {() =>  void} next 
     */
    #loadPageContent(page = this.#pagination.getData().page, updateHistory = true, next = undefined) {
        blogPostService.getBlogPosts(page, this.#pagination.getData().pageSize,
            (blogPosts, paginationData) => {
                this.#blogPosts.innerText = '';

                for (const post of blogPosts) {
                    this.#blogPosts.append(
                        this.#createBlogPostItem(post)
                    );
                }

                this.#pagination.setData(paginationData, updateHistory);

                next?.call(this);
            }
        );
    }
});