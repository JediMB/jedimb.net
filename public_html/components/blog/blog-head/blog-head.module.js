import BlogEditorComponent from "/js/components/blog/blog-editor/blog-editor.module.js";
import BlogPostDTO from "/js/models/blog/blog-post.dto.model.js";
import blogPostService from "/js/services/blog-post.service.js";

class BlogHeadComponent extends HTMLElement {
    #scheduledTimeout = { id: null };

    /** @type {HTMLButtonElement} */ #btnAddPost;
    /** @type {HTMLButtonElement} */ #btnCancelPost;
    /** @type {HTMLButtonElement} */ #btnPublishPost;
    /** @type {HTMLButtonElement} */ #btnSaveDraft;

    /** @type {HTMLElement} */ #content;
    /** @type {BlogEditorComponent} */ #blogEditor;

    /** @type {HTMLInputElement} */ #tglScheduled;
    /** @type {HTMLInputElement} */ #scheduledDate;
    /** @type {HTMLInputElement} */ #scheduledTime;

    constructor() { super(); }

    connectedCallback() {
        this.#btnAddPost = this.querySelector('#blog-head__btn-add');

        this.#content = this.querySelector('#blog-head__content');

        this.#blogEditor = this.querySelector('#blog-head__editor');
        const blogEditor = this.#blogEditor;

        const options = this.querySelector('blog-head-options');
        this.#tglScheduled = options.querySelector('#blog-head__toggle-schedule');
        this.#scheduledDate = options.querySelector('#blog-head__scheduled-date');
        this.#scheduledTime = options.querySelector('#blog-head__scheduled-time');

        const buttons = this.querySelector('blog-head-buttons');
        this.#btnCancelPost = buttons.querySelector('#blog-head__btn-cancel');
        this.#btnPublishPost = buttons.querySelector('#blog-head__btn-publish');
        this.#btnSaveDraft = buttons.querySelector('#blog-head__btn-save');

        this.#btnAddPost.addEventListener('click', () => {
            const wasActive = !this.#btnAddPost.ariaPressed || this.#btnAddPost.ariaPressed !== 'false';
            this.#toggleFormView(!wasActive);
        });

        this.#btnCancelPost.addEventListener('click', () => {
            blogEditor.reset();
            this.#toggleFormView(false);
        });

        this.#tglScheduled.addEventListener('change', event => {
            const isScheduled = event.target.checked;

            this.#scheduledDate.toggleAttribute('required', isScheduled);
            this.#scheduledDate.toggleAttribute('hidden', !isScheduled);
            this.#scheduledTime.toggleAttribute('required', isScheduled);
            this.#scheduledTime.toggleAttribute('hidden', !isScheduled);
            this.#btnPublishPost.textContent = isScheduled ? this.#btnPublishPost.dataset.contentSchedule : this.#btnPublishPost.dataset.contentPublish;

            this.#updateDateTimeFields(isScheduled);
        });

        this.#scheduledDate.addEventListener('change', () => blogEditor.setPermadate(this.#scheduledDate.value.replaceAll('-', '/')));

        blogEditor.onSubmit(event => {
            event.preventDefault();
            this.#publishPost();
        });

        this.#btnSaveDraft.addEventListener('click', () => this.#saveDraft());

        blogEditor.isValid.subscribe(valid => {
            this.#btnPublishPost.disabled = !valid;
            this.#btnSaveDraft.disabled = !valid;
        }, true);

        blogEditor.onLoaded(() => {
            this.#btnAddPost.title = this.#btnAddPost.dataset.titleOpen;
            this.#btnAddPost.disabled = false;
            this.#btnAddPost.removeAttribute('btn-loading');
        });
    }

    connectedMoveCallback() {}

    disconnectedCallback() {}

    async #publishPost() {
        const post = new BlogPostDTO(this.#blogEditor.formData);

        blogPostService.createBlogPost(post,
            value => {
                this.#blogEditor.reset();
                this.#toggleFormView(false);

                if (value.blogPost) {
                    // TODO: Blog Post notification
                }
                else {
                    // TODO: Schedule notification
                }
                console.log(value.blogPost ?? value.schedule);
            },
            errors => this.#blogEditor.error(errors)
        );
    }

    async #saveDraft() {
        this.#btnSaveDraft.disabled = true;
        this.#btnSaveDraft.toggleAttribute('btn-loading', true);

        
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
            : button.dataset.hrefOpen
        svgUse.setAttribute('xlink:href', href)
        svgUse.setAttribute('href', href);
    }

    /**
     * @param {boolean} isScheduled
     */
    #updateDateTimeFields(isScheduled) {
        const dateInput = this.#scheduledDate;
        const timeInput = this.#scheduledTime;

        if (!isScheduled) {
            this.#blogEditor.setPermadate();
            clearTimeout(this.#scheduledTimeout.id);
            return;
        }

        const recursiveLogic = (scheduledTimeout) => {
            const now = new Date();
            
            const minTime = new Date(now.getTime() + 900000);
            const followingHour = new Date(minTime.getTime() + 3600000);
            const targetDateValue = `${followingHour.getFullYear()}-${`${followingHour.getMonth() + 1}`.padStart(2, '0')}-${`${followingHour.getDate()}`.padStart(2, '0')}`;

            timeInput.min = `${minTime.getHours()}:${`${minTime.getMinutes()}`.padStart(2, '0')}`;
            dateInput.min = targetDateValue;

            const defaultTimeValue = `${followingHour.getHours()}:00`;

            if (isScheduled
                && timeInput.value
                && timeInput.value === timeInput.defaultValue
                && timeInput.defaultValue !== defaultTimeValue) {
                    console.log('Ding!'); // TODO: Notification
            }

            timeInput.defaultValue = defaultTimeValue;
            dateInput.defaultValue = targetDateValue;

            this.#blogEditor.setPermadate(dateInput.value.replaceAll('-', '/'));

            scheduledTimeout.id = setTimeout(recursiveLogic, 60000, scheduledTimeout);
        }

        recursiveLogic(this.#scheduledTimeout);
    }
}

customElements.define('blog-head-component', BlogHeadComponent);
