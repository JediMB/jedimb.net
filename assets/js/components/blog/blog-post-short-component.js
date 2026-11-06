import BlogPost from "/js/models/blog/blog-post.model.js";
import { formatDate } from "/js/utilities/format-date.utility.js";

export default class BlogPostShortComponent extends HTMLElement {
    #isSetup = false;
    /** @type {number} */ #id;
    /** @type {NodeListOf<HTMLButtonElement} */ #buttons;

    /** @type {((id: number) => void)?} */ #ondelete;
    /** @type {((id: number) => void)?} */ #onupdate;

    /** @param {((id: number) => void)?} callbackFn  */
    set ondelete(callbackFn) { this.#ondelete = callbackFn; }
    /** @param {((id: number) => void)?} callbackFn  */
    set onupdate(callbackFn) { this.#onupdate = callbackFn; }

    constructor() { super(); }

    connectedCallback() {
        this.#id = Number(this.dataset.id);
        this.#buttons = this.querySelectorAll('[post-action]');

        this.#assignButtonActions();
    }

    connectedMoveCallback() {}

    disconnectedCallback() {}

    /** 
     * @param {BlogPost} blogPost 
     * @param {boolean} hasEditingPermissions
     */
    setup(blogPost, hasEditingPermissions) {
        if (this.#isSetup)
            return false;

        if (!blogPost || !blogPost.id) {
            console.error('No blog post data provided');
            return false;
        }

        this.#id = blogPost.id;
        this.dataset.id = this.#id;

        const article = this.querySelector('article');
        article.classList.toggle('post-pinned', blogPost.isPinned);

        /** @type {HTMLAnchorElement} */
        const titleLink = this.querySelector('[post-title]');
        titleLink.textContent = blogPost.title;
        titleLink.href += blogPost.permalink;

        const publishedOn = this.querySelector('.created-on');
        let dateString = formatDate(blogPost.publishedOn);
        publishedOn.textContent = dateString;
        publishedOn.setAttribute('date-string', dateString);
        publishedOn.title = dateString;

        const modifiedOn = this.querySelector('.modified-on');
        if (blogPost.modifiedOn) {
            dateString = formatDate(blogPost.modifiedOn);
            modifiedOn.textContent = dateString;
            modifiedOn.setAttribute('date-string', dateString);
            modifiedOn.title = dateString;
        }
        else
            modifiedOn?.parentElement?.remove();

        const toolbar = this.querySelector('article-toolbar');
        toolbar.toggleAttribute('hidden', !hasEditingPermissions);

        /** @type {HTMLAnchorElement} */
        const editLink = toolbar.querySelector('[post-edit]');
        editLink.href += this.#id;

        this.querySelector('article-content').innerHTML = blogPost.contentShort;

        this.#assignButtonActions();
        this.#isSetup = true;
        return true;
    }

    #assignButtonActions() {
        if (!this.#id)
            return;

        const postId = this.#id;
        const buttons = this.#buttons;

        for (const button of buttons) {
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
                                    this.#ondelete?.call(this);
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
                                this.#onupdate?.call(this);
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
                                this.#onupdate?.call(this);
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
                                this.#onupdate?.call(this);
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
}

customElements.define('blog-post-short-component', BlogPostShortComponent);
