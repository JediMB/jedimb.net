import BlogPost from "/js/models/blog/blog-post.model.js";
import blogPostService from "/js/services/blog-post.service.js";
import { formatDate } from "/js/utilities/format-date.utility.js";

export default class BlogPostComponent extends HTMLElement {
    /** @type {boolean} */ #isSetup = false;
    /** @type {number} */ #id;
    /** @type {NodeListOf<HTMLButtonElement>} */ #buttons;

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

    /** @param {BlogPost} blogPost  */
    setup(blogPost) {
        if (this.#isSetup)
            return false;

        if (!blogPost || !blogPost.id) {
            console.error('No blog post data provided');
            return false;
        }

        this.#id = blogPost.id;
        this.dataset.id = this.#id;

        const link = this.querySelector('a');
        link.href += this.#id;
        link.prepend(blogPost.title);

        const description = this.querySelector('[class$="__description"');
        description.textContent = blogPost.description;

        for (const button of this.#buttons) {
            const postAction = button.getAttribute('post-action');

            switch (postAction) {
                case 'publish':
                    if (blogPost.publishedOn) {
                        const title = button.nextElementSibling?.querySelector('title');
                        if (title)
                            title.textContent += formatDate(blogPost.publishedOn);
                        button.remove();
                    }
                    else
                        button.nextElementSibling?.remove();
                    continue;

                case 'hide':
                    if (blogPost.isHidden)
                        button.parentElement.remove();
                    continue;

                case 'pin':
                    if (blogPost.isPinned)
                        button.parentElement.remove();
                    continue;

                case 'unhide':
                    if (!blogPost.isHidden)
                        button.parentElement.remove();
                    continue;

                case 'unpin':
                    if (!blogPost.isPinned)
                        button.parentElement.remove();
                    continue;
            }
        }

        this.#buttons = this.querySelectorAll('[post-action]');
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
                            button.toggleAttribute('btn-loading', true);
                            blogPostService.deleteBlogPost(postId,
                                next => {
                                    // TODO: Success notification
                                    button.toggleAttribute('btn-loading', false);
                                    this.#ondelete?.call(this);
                                },
                                error => {
                                    // TODO: Error notification
                                    button.toggleAttribute('btn-loading', false);
                                }
                            );
                        }
                    });
                    continue;

                case 'hide':
                    button.addEventListener('click', () => {
                        button.toggleAttribute('btn-loading', true);
                        blogPostService.hideBlogPost(postId,
                            () => {
                                // TODO: Success notification
                                button.toggleAttribute('btn-loading', false);
                                this.#onupdate?.call(this);
                            },
                            error => {
                                // TODO: Error notification
                                button.toggleAttribute('btn-loading', false);
                            }
                        );
                    });
                    continue;

                case 'pin':
                    button.addEventListener('click', () => {
                        button.toggleAttribute('btn-loading', true);
                        blogPostService.pinBlogPost(postId,
                            () => {
                                // TODO: Success notification
                                button.toggleAttribute('btn-loading', false);
                                this.#onupdate?.call(this);
                            },
                            error => {
                                // TODO: Error notification
                                button.toggleAttribute('btn-loading', false);
                            }
                        );
                    });
                    continue;

                case 'publish':
                    // TODO: Use a modal web component instead of confirm()
                    button.addEventListener('click', () => {
                        const message = button.dataset.prompt ?? 'Publish this post?';
                        
                        if (confirm(message)) {
                            button.toggleAttribute('btn-loading', true);
                            blogPostService.publishBlogPost(postId,
                                () => {
                                    // TODO: Success notification
                                    button.toggleAttribute('btn-loading', false);
                                    this.#onupdate?.call(this);
                                },
                                error => {
                                    // TODO: Error notification
                                    button.toggleAttribute('btn-loading', false);
                                }
                            );
                        }
                    });
                    continue;

                case 'unhide':
                    button.addEventListener('click', () => {
                        button.toggleAttribute('btn-loading', true);
                        blogPostService.unhideBlogPost(postId,
                            () => {
                                // TODO: Success notification
                                button.toggleAttribute('btn-loading', false);
                                this.#onupdate?.call(this);
                            },
                            error => {
                                // TODO: Error notification
                                button.toggleAttribute('btn-loading', false);
                            }
                        );
                    });
                    continue;

                case 'unpin':
                    button.addEventListener('click', () => {
                        button.toggleAttribute('btn-loading', true);
                        blogPostService.unpinBlogPost(postId,
                            () => {
                                // TODO: Success notification
                                button.toggleAttribute('btn-loading', false);
                                this.#onupdate?.call(this);
                            },
                            error => {
                                // TODO: Error notification
                                button.toggleAttribute('btn-loading', false);
                            }
                        );
                    });
                    continue;
            }
        }
    }
}

customElements.define('blog-post-component', BlogPostComponent);