import BlogFormComponent from "/js/components/blog/blog-form/blog-form.module.js";
import BlogPostDTO from "/js/models/blog/blog-post.dto.model.js";
import blogPostService from "/js/services/blog-post.service.js";
import DateTimeElement from "/js/custom-elements/date-time.element.js";
import { Listener } from "/js/utilities/emitter.js";

export default class BlogEditorComponent extends HTMLElement {
    /** @type {Listener} */ #changeListener;
    /** @type {Listener} */ #validationListener;
    #isChanged = false;
    #isValid = false;

    /** @type {DateTimeElement} */ #modifiedOn;
    /** @type {DateTimeElement} */ #saveTime;

    /** @type {BlogFormComponent} */ #blogForm;

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

        this.#modifiedOn = this.querySelector('.modified-on');
        this.#saveTime = buttons.querySelector('[save-time]');

        this.#btnCancel.addEventListener('click', event => {
            event.preventDefault();
            this.#onCancel();
        });

        this.#btnPublish?.addEventListener('click', event => {
            event.preventDefault();
            this.#onPublish();
        });

        this.#blogForm.onSubmit(event => {
            event.preventDefault();
            this.#onSave();
        });

        this.#changeListener = this.#blogForm.isChanged.subscribe({
            next: changed => {
                this.#isChanged = changed;
                this.#btnSave.disabled = !changed || !this.#isValid;
            }
        }, { getCurrent: true, getUnchanged: true });

        this.#validationListener = this.#blogForm.isValid.subscribe({
            next: valid => {
                this.#isValid = valid;

                if (this.#btnPublish)
                    this.#btnPublish.disabled = !valid;

                this.#btnSave.disabled = !valid || !this.#isChanged;
            }
        }, { getCurrent: true, getUnchanged: true });

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

    #onCancel() {
        if (this.#blogForm.isPublished)
            window.location.assign(this.#blogForm.publishedPath);
        else
            window.location.assign('/');
    }

    #onPublish() {
        this.#btnPublish.disabled = true;
        this.#btnPublish.toggleAttribute('btn-loading', true);
        this.#btnSave.disabled = true;

        const draftDTO = new BlogPostDTO(this.#blogForm.getFormData());

        if (draftDTO.scheduledOn)
            this.#schedulePost(draftDTO);
        else
            this.#publishPost(draftDTO);
    }

    #onSave() {
        this.#btnSave.disabled = true;
        this.#btnSave.toggleAttribute('btn-loading', true);

        if (this.#btnPublish)
            this.#btnPublish.disabled = true;

        const postDTO = new BlogPostDTO(this.#blogForm.getFormData());

        if (this.#blogForm.isPublished)
            this.#updateBlogPost(postDTO);
        else
            this.#updateDraft(postDTO);
    }

    /** @param {BlogPostDTO} draftDTO  */
    #publishPost(draftDTO) {
        blogPostService.publishDraft(draftDTO,
            value => {
                this.#btnPublish.removeAttribute('btn-loading');
                
                // TODO: Post published notification

                setTimeout(() => window.location.assign('/'), 2000);
            },
            errors => {
                if (this.#blogForm.error(errors)) {
                    // TODO: Incorrect input notification
                }
                else {
                    // TODO: Errors string content notification
                }
                this.#btnPublish.removeAttribute('btn-loading');
            }
        );
    }

    /** @param {BlogPostDTO} draftDTO  */
    #schedulePost(draftDTO) {
        blogPostService.scheduleDraft(draftDTO,
            value => {
                this.#btnPublish.removeAttribute('btn-loading');
                
                // TODO: Post scheduled notification

                setTimeout(() => window.location.assign('/'), 2000);
            },
            errors => {
                if (this.#blogForm.error(errors)) {
                    // TODO: Incorrect input notification
                }
                else {
                    // TODO: Errors string content notification
                }
                this.#btnPublish.removeAttribute('btn-loading');
            }
        );
    }

    /** @param {BlogPostDTO} blogPostDTO  */
    #updateBlogPost(blogPostDTO) {
        blogPostService.updateBlogPost(blogPostDTO,
            value => {
                this.#changeListener.pause();
                this.#validationListener.pause();
                this.#blogForm.updateForm(value);

                // TODO: Post updated notification

                const saveTime = value.modifiedOn ?? value.createdOn;
                this.#updateSaveTime(saveTime);
                this.#saveTime.parentElement.removeAttribute('hidden');

                this.#btnSave.removeAttribute('btn-loading');
                if (this.#btnPublish)
                    this.#btnPublish.disabled = false;
                setTimeout(() => {
                    this.#changeListener.unpause();
                    this.#validationListener.unpause();
                }, 500);
            },
            errors => {
                if (this.#blogForm.error(errors)) {
                    // TODO: Incorrect input notification
                }
                else {
                    // TODO: Errors string content notification
                }
                this.#btnSave.removeAttribute('btn-loading');
            }
        );

    }

    /** @param {BlogPostDTO} draftDTO  */
    #updateDraft(draftDTO) {
        blogPostService.saveDraft(draftDTO,
            value => {
                this.#changeListener.pause();
                this.#validationListener.pause();
                this.#blogForm.updateForm(value);

                // TODO: Draft updated notification

                const saveTime = value.modifiedOn ?? value.createdOn;
                this.#updateSaveTime(saveTime);
                this.#saveTime.parentElement.removeAttribute('hidden');

                this.#btnSave.removeAttribute('btn-loading');
                if (this.#btnPublish)
                    this.#btnPublish.disabled = false;
                setTimeout(() => {
                    this.#changeListener.unpause();
                    this.#validationListener.unpause();
                }, 500);
            },
            errors => {
                if (this.#blogForm.error(errors)) {
                    // TODO: Incorrect input notification
                }
                else {
                    // TODO: Errors string content notification
                }
                this.#btnSave.removeAttribute('btn-loading');
            }
        );
        
    }

    /** @param {Date} saveTime  */
    #updateSaveTime(saveTime) {
        this.#modifiedOn?.setDateTime(saveTime);
        this.#saveTime.setDateTime(saveTime);
    }
}

customElements.define('blog-editor-component', BlogEditorComponent);