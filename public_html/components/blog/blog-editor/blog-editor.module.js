import BlogFormComponent from "/js/components/blog/blog-form/blog-form.module.js";
import BlogPostDTO from "/js/models/blog/blog-post.dto.model.js";
import blogPostService from "/js/services/blog-post.service.js";

export default class BlogEditorComponent extends HTMLElement {
    #isChanged = false;
    #isValid = false;

    /** @type {BlogFormComponent} */ #blogForm;
    /** @type {HTMLSpanElement} */ #saveTime;

    /** @type {HTMLButtonElement} */ #btnCancel;
    /** @type {HTMLButtonElement} */ #btnSave;
    /** @type {HTMLButtonElement} */ #btnPublish;

    constructor() { super(); }

    connectedCallback() {
        this.#blogForm = this.querySelector('#blog-editor__editor');

        const buttons = this.querySelector('edit-buttons');
        this.#btnCancel = buttons.querySelector('#blog-editor__btn-cancel');
        this.#btnPublish = buttons.querySelector('#blog-editor__btn-publish');
        this.#btnSave = buttons.querySelector('#blog-editor__btn-save');

        this.#saveTime = buttons.querySelector('[save-time]');

        this.#btnCancel.addEventListener('click', event => {
            event.preventDefault();
            this.#cancel();
        });

        this.#btnPublish?.addEventListener('click', event => {
            event.preventDefault();
            this.#onPublish();
        });

        this.#blogForm.onSubmit(event => {
            event.preventDefault();
            this.#onSave();
        });

        this.#blogForm.isChanged.subscribe({
            next: changed => {
                this.#isChanged = changed;
                this.#btnSave.disabled = !changed || !this.#isValid;
            }
        }, { getCurrent: true });

        this.#blogForm.isValid.subscribe({
            next: valid => {
                this.#isValid = valid;

                if (this.#btnPublish)
                    this.#btnPublish.disabled = !valid;

                this.#btnSave.disabled = !valid || !this.#isChanged;
            }
        }, { getCurrent: true });

        if (this.#btnPublish) {
            this.#blogForm.isScheduled.subscribe({
                next: scheduled => {
                    this.#btnPublish.textContent = scheduled
                        ? this.#btnPublish.dataset.contentSchedule
                        : this.#btnPublish.dataset.contentPublish;
                }
            }, { getCurrent: true });
        }

        this.#blogForm.onLoaded(() => {
            if (this.#btnPublish)
                this.#btnPublish.disabled = false;

            this.#btnCancel.disabled = false;
        });
    }

    connectedMoveCallback() {}

    disconnectedCallback() {}

    #cancel() {
        if (this.#blogForm.isPublished)
            window.location.assign(this.#blogForm.publishedPath);
        else
            window.location.assign('/');
    }

    #onPublish() {
        // Save changes and either publish or schedule publishing
        const post = new BlogPostDTO(this.#blogForm.getFormData());

        if (post.scheduledOn) {
            blogPostService.scheduleDraft(post,
                value => {
                    console.log(value);
                },
                errors => {
                    console.error(errors);
                }
            );
            return;
        }

        blogPostService.publishDraft(post,
            value => {
                console.log(value);
            },
            errors => {
                console.error(errors);
            }
        );
    }

    #onSave() {
        // Save changes but don't change its publishedOn value
        this.#btnSave.disabled = true;
        this.#btnSave.toggleAttribute('btn-loading', true);

        if (this.#btnPublish)
            this.#btnPublish.disabled = true;

        const post = new BlogPostDTO(this.#blogForm.getFormData());

        if (this.#blogForm.isPublished) {
            blogPostService.updateBlogPost(post,
                value => {

                },
                errors => {

                }
            );

            return;
        }

        blogPostService.saveDraft(post,
            value => {

            },
            errors => {

            }
        );
    }

    /** @param {Date} saveTime  */
    #updateSaveTime(saveTime) {
        const now = new Date();
        const isSavedToday = saveTime.getDate() === now.getDate()
            && saveTime.getMonth() === now.getMonth()
            && saveTime.getFullYear() === now.getFullYear();

        if (isSavedToday)
            this.#saveTime.textContent = saveTime.toLocaleTimeString();
        else
            this.#saveTime.textContent = saveTime.toLocaleString();
    }
}

customElements.define('blog-editor-component', BlogEditorComponent);