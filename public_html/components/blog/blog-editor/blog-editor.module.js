import BlogFormComponent from "/js/components/blog/blog-form/blog-form.module.js";
import BlogPostDTO from "/js/models/blog/blog-post.dto.model.js";
import blogPostService from "/js/services/blog-post.service.js";

export default class BlogEditorComponent extends HTMLElement {
    /** @type {BlogFormComponent} */ #blogForm;
    #isChanged = false;
    #isValid = false;

    constructor() { super(); }

    connectedCallback() {
        this.#blogForm = this.querySelector('#blog-editor__editor');

        const buttons = this.querySelector('edit-buttons');
        const btnCancel = buttons.querySelector('#blog-editor__btn-cancel');
        const btnPublish = buttons.querySelector('#blog-editor__btn-publish');
        /** @type {HTMLButtonElement} */
        const btnSave = buttons.querySelector('#blog-editor__btn-save');

        btnCancel.addEventListener('click', event => {
            event.preventDefault();
            this.#cancel();
        });

        btnPublish?.addEventListener('click', event => {
            event.preventDefault();
            this.#publishOrSchedule();
        });

        this.#blogForm.onSubmit(event => {
            event.preventDefault();
            this.#save();
        });

        this.#blogForm.isChanged.subscribe({
            next: changed => {
                this.#isChanged = changed;
                btnSave.disabled = !changed || !this.#isValid;
            }
        }, true);

        this.#blogForm.isValid.subscribe({
            next: valid => {
                this.#isValid = valid;

                if (btnPublish)
                    btnPublish.disabled = !valid;

                btnSave.disabled = !valid || !this.#isChanged;
            }
        }, true);

        if (btnPublish) {
            this.#blogForm.isScheduled.subscribe({
                next: scheduled => {
                    btnPublish.textContent = scheduled
                        ? btnPublish.dataset.contentSchedule
                        : btnPublish.dataset.contentPublish;
                }
            }, true);
        }

        this.#blogForm.onLoaded(() => {
            if (btnPublish)
                btnPublish.disabled = false;

            btnCancel.disabled = false;
        });
    }

    connectedMoveCallback() {}

    disconnectedCallback() {}

    #cancel() {
        const formData = this.#blogForm.getFormData();

        if (formData.has('isPublished'))
            window.location.assign(formData.get('isPublished'));
        else
            window.location.assign('/');
    }

    #publishOrSchedule() {
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

    #save() {
        // Save changes but don't change its publishedOn value
    }
}

customElements.define('blog-editor-component', BlogEditorComponent);