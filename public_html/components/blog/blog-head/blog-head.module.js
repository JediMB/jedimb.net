import BlogFormComponent from "/js/components/blog/blog-form/blog-form.module.js";
import BlogPostDTO from "/js/models/blog/blog-post.dto.model.js";
import blogPostService from "/js/services/blog-post.service.js";

class BlogHeadComponent extends HTMLElement {
    /** @type {HTMLButtonElement} */ #btnAddPost;
    /** @type {HTMLButtonElement} */ #btnCancelPost;
    /** @type {HTMLButtonElement} */ #btnPublishPost;
    /** @type {HTMLButtonElement} */ #btnSaveDraft;

    /** @type {HTMLElement} */ #content;
    /** @type {BlogFormComponent} */ #blogForm;

    constructor() { super(); }

    connectedCallback() {
        this.#btnAddPost = this.querySelector('#blog-head__btn-add');

        this.#content = this.querySelector('#blog-head__content');

        this.#blogForm = this.querySelector('#blog-head__editor');
        const blogForm = this.#blogForm;

        const buttons = this.querySelector('blog-head-buttons');
        this.#btnCancelPost = buttons.querySelector('#blog-head__btn-cancel');
        this.#btnPublishPost = buttons.querySelector('#blog-head__btn-publish');
        this.#btnSaveDraft = buttons.querySelector('#blog-head__btn-save');

        this.#btnAddPost.addEventListener('click', () => {
            const wasActive = !this.#btnAddPost.ariaPressed || this.#btnAddPost.ariaPressed !== 'false';
            this.#toggleFormView(!wasActive);
        });

        this.#btnCancelPost.addEventListener('click', () => {
            blogForm.reset();
            this.#toggleFormView(false);
        });

        blogForm.onSubmit(event => {
            event.preventDefault();
            this.#publishPost();
        });

        this.#btnSaveDraft.addEventListener('click', event => {
            event.preventDefault();
            this.#saveDraft()
        });

        blogForm.isScheduled.subscribe({
            next: scheduled => {
                this.#btnPublishPost.textContent = scheduled
                    ? this.#btnPublishPost.dataset.contentSchedule
                    : this.#btnPublishPost.dataset.contentPublish;
            }
        }, { getCurrent: true });

        blogForm.isValid.subscribe({
            next: valid => {
                this.#btnPublishPost.disabled = !valid;
                this.#btnSaveDraft.disabled = !valid;
            }
        }, { getCurrent: true, getUnchanged: true });

        blogForm.onLoaded(() => {
            this.#btnAddPost.title = this.#btnAddPost.dataset.titleOpen;
            this.#btnAddPost.disabled = false;
            this.#btnAddPost.removeAttribute('btn-loading');
        });
    }

    connectedMoveCallback() {}

    disconnectedCallback() {}

    async #publishPost() {
        this.#btnPublishPost.disabled = true;
        this.#btnSaveDraft.disabled = true;
        this.#btnPublishPost.toggleAttribute('btn-loading', true);

        const post = new BlogPostDTO(this.#blogForm.getFormData());

        blogPostService.createBlogPost(post,
            value => {
                this.#blogForm.reset();
                this.#toggleFormView(false);
                this.#btnPublishPost.removeAttribute('btn-loading');

                if (value.blogPost) {
                    // TODO: Blog Post notification
                }
                else {
                    // TODO: Schedule notification
                }
            },
            errors => {
                // TODO: Error notification
                this.#btnPublishPost.removeAttribute('btn-loading');
                this.#blogForm.error(errors);
            }
        );
    }

    async #saveDraft() {
        const publishDisabled = this.#btnSaveDraft.disabled;
        this.#btnSaveDraft.disabled = true;
        this.#btnPublishPost.disabled = true;
        this.#btnSaveDraft.toggleAttribute('btn-loading', true);

        const draft = new BlogPostDTO(this.#blogForm.getFormData());

        blogPostService.saveDraft(draft,
            value => {
                this.#blogForm.updateForm(value);
                // TODO: Draft saved notification
                this.#btnSaveDraft.removeAttribute('btn-loading');
                this.#btnPublishPost.disabled = publishDisabled;
            },
            errors => {
                this.#btnSaveDraft.removeAttribute('btn-loading');
                this.#blogForm.error(errors);
                this.#btnSaveDraft.disabled = false;
                this.#btnPublishPost.disabled = publishDisabled;
            }
        );
    }

    /** @param {boolean} makeActive  */
    #toggleFormView(makeActive) {
        const button = this.#btnAddPost;

        button.ariaPressed = `${makeActive}`;
        button.classList.toggle('btn-primary', !makeActive);
        button.classList.toggle('btn-secondary', makeActive);
        button.title = makeActive
            ? button.dataset.titleClose
            : button.dataset.titleOpen;
        this.#content.toggleAttribute('hidden', !makeActive);

        const svgUse = button.querySelector('#blog-head__btn-add__use');
        const href = makeActive
            ? button.dataset.hrefClose
            : button.dataset.hrefOpen;
        svgUse.setAttribute('xlink:href', href);
        svgUse.setAttribute('href', href);
    }
}

customElements.define('blog-head-component', BlogHeadComponent);
