import BlogPostDTO from "/js/models/blog-post.dto.js";
import { TextEditorComponent } from "/js/components/text-editor/text-editor.module.js";
import blogPostService from "/js/services/blog-post.service.js";
import { formatTimezone } from "/js/utilities/format-date.utility.js";

customElements.define('blog-head-component', class BlogHeadComponent extends HTMLElement {
    #scheduledTimeout = { id: null };

    /** @type {Map<string, HTMLInputElement>} */ #formFields = new Map();

    /** @type {TextEditorComponent} */ #textEditor;

    /** @type {HTMLInputElement} */ #tglPinned;
    /** @type {HTMLInputElement} */ #tglScheduled;
    /** @type {HTMLInputElement} */ #scheduledDate;
    /** @type {HTMLInputElement} */ #scheduledTime;

    #btnPublishPost;
    #btnDraftPost;

    constructor() { super(); }

    connectedCallback() {
        const content = this.querySelector('blog-head-content');

        const body = content.querySelector('blog-head-body');
        
        /** @type {HTMLInputElement} */
        const title = body.querySelector('#blog-head__title');
        this.#formFields.set('title', title);
        
        const permadate = body.querySelector('#blog-head__permadate');
        
        /** @type {HTMLInputElement} */
        const permalink = body.querySelector('#blog-head__permalink');
        this.#formFields.set('permalink', permalink);

        const btnResetPermalink = body.querySelector('#blog-head__reset-permalink');
        this.#textEditor = body.querySelector('#blog-head__text-editor');

        /** @type {HTMLInputElement} */
        const description = body.querySelector('#blog-head__description');
        this.#formFields.set('description', description);

        /** @type {HTMLInputElement} */
        const mastolink = body.querySelector('#blog-head__sociallink')
        this.#formFields.set('mastolink', mastolink);

        const footer = content.querySelector('blog-head-footer');
        this.#tglPinned = footer.querySelector('#blog-head__toggle-pinned');
        this.#tglScheduled = footer.querySelector('#blog-head__toggle-schedule');
        this.#scheduledDate = footer.querySelector('#blog-head__scheduled-date');
        this.#scheduledTime = footer.querySelector('#blog-head__scheduled-time');
        const btnAddPost = footer.querySelector('#blog-head__btn-add');
        const btnCancelPost = footer.querySelector('#blog-head__btn-cancel');
        this.#btnPublishPost = footer.querySelector('#blog-head__btn-publish');
        this.#btnDraftPost = footer.querySelector('#blog-head__btn-draft');

        title.addEventListener('input', () => permalink.defaultValue = this.#formatPermalinkTitle(title.value));
        title.addEventListener('change', () => title.value = title.value.trim());

        permalink.addEventListener('change', () => permalink.value = this.#formatPermalinkTitle(permalink.value));
        btnResetPermalink.addEventListener('click', () => permalink.value = permalink.defaultValue);

        for (const field of [title, permalink, description, mastolink]) {
            field.addEventListener('input', () => this.#validation());
        }
        this.#textEditor.content.onChange = () => this.#validation();

        this.#tglScheduled.addEventListener('change', event => {
            const isScheduled = event.target.checked;

            this.#scheduledDate.toggleAttribute('required', isScheduled);
            this.#scheduledDate.toggleAttribute('hidden', !isScheduled);
            this.#scheduledTime.toggleAttribute('required', isScheduled);
            this.#scheduledTime.toggleAttribute('hidden', !isScheduled);
            this.#btnPublishPost.textContent = isScheduled ? this.#btnPublishPost.dataset.contentSchedule : this.#btnPublishPost.dataset.contentPublish;

            this.#updateDateTimeFields(this.#scheduledDate, this.#scheduledTime, permadate, isScheduled);
        });

        this.#scheduledDate.addEventListener('change', () => permadate.textContent = this.#scheduledDate.value.replaceAll('-', '/'));

        this.#btnPublishPost.addEventListener('click', () => this.#publishPost());
    }

    /**
     * @param {string} input 
     * @returns {string}
     */
    #formatPermalinkTitle(input) {
        return input.toLowerCase()
                .replaceAll(/\s/g, '-')
                .replaceAll(/[^\-a-z0-9]+/g, '')
                .replaceAll(/\-{2,}/g, '')
                .replaceAll(/(^\-)|(\-$)/g, '');
    }

    async #publishPost() {
        const content = this.#textEditor.content.html;

        const post = new BlogPostDTO({
            permalink: this.#formFields.get('permalink').value,
            title: this.#formFields.get('title').value,
            contentShort: content.short,
            contentRest: content.rest,
            description: this.#formFields.get('description').value,
            mastolink: this.#formFields.get('mastolink').value,
            isPinned: this.#tglPinned.checked,
            scheduledOn: this.#tglScheduled.checked
                ? `${this.#scheduledDate.value} ${this.#scheduledTime.value.slice(0, 5)}:00.000 ${formatTimezone(new Date())}`
                : null
        });

        blogPostService.createBlogPost(post,
            value => {
                console.log('success', value);
            },
            errors => {
                for (const key in errors) {
                    const field = this.#formFields.get(key);
                    const error = errors[key];

                    field.classList.toggle('error-required', !!error.required);
                    field.classList.toggle('error-too-short', !!error.tooShort);
                    field.classList.toggle('error-too-long', !!error.tooLong);
                    field.classList.toggle('error-mismatch', !!error.mismatch);
                }
            }
        );
    }

    /**
     * @param {HTMLInputElement} dateInput 
     * @param {HTMLInputElement} timeInput 
     * @param {HTMLElement} permadate
     * @param {boolean} isScheduled
     */
    #updateDateTimeFields(dateInput, timeInput, permadate, isScheduled) {
        if (!isScheduled) {
            permadate.textContent = permadate.dataset.default;
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

            permadate.textContent = dateInput.value.replaceAll('-', '/');

            scheduledTimeout.id = setTimeout(recursiveLogic, 60000, scheduledTimeout);
        }

        recursiveLogic(this.#scheduledTimeout);
    }

    #validation() {
        const textEditorValid = this.#textEditor.content.text.length || this.#textEditor.content.media.length;

        const valid = textEditorValid
            && this.#formFields.get('title').checkValidity()
            && this.#formFields.get('permalink').checkValidity()
            && this.#formFields.get('description').checkValidity()
            && this.#formFields.get('mastolink').checkValidity();

        this.#btnPublishPost.disabled = !valid;
        this.#btnDraftPost.disabled = !valid;
    }
});