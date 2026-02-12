import BlogPostDTO from "/js/models/blog-post.dto.js";
import { TextEditorComponent } from "/js/components/text-editor/text-editor.module.js";

customElements.define('blog-head-component', class BlogHeadComponent extends HTMLElement {
    #scheduledTimeout = { id: null };

    /** @type {HTMLInputElement} */ #title;
    /** @type {HTMLInputElement} */ #permalink;
    /** @type {TextEditorComponent} */ #textEditor;
    /** @type {HTMLInputElement} */ #description;
    /** @type {HTMLInputElement} */ #socialLink;

    #btnPublishPost;
    #btnDraftPost;

    constructor() { super(); }

    connectedCallback() {
        const content = this.querySelector('blog-head-content');

        const body = content.querySelector('blog-head-body');
        this.#title = body.querySelector('#blog-head__title');
        const permadate = body.querySelector('#blog-head__permadate');
        this.#permalink = body.querySelector('#blog-head__permalink');
        const btnResetPermalink = body.querySelector('#blog-head__reset_permalink');
        this.#textEditor = this.querySelector('#blog-head__text-editor');
        this.#description = body.querySelector('#blog-head__description');
        this.#socialLink = body.querySelector('#blog-head__sociallink');

        const footer = content.querySelector('blog-head-footer');
        const tglPinned = footer.querySelector('#blog-head__toggle-pinned');
        const tglScheduled = footer.querySelector('#blog-head__toggle-schedule');
        /** @type {HTMLInputElement} */ const scheduledDate = footer.querySelector('#blog-head__scheduled-date');
        /** @type {HTMLInputElement} */ const scheduledTime = footer.querySelector('#blog-head__scheduled-time');
        const btnAddPost = footer.querySelector('#blog-head__btn-add');
        const btnCancelPost = footer.querySelector('#blog-head__btn-cancel');
        this.#btnPublishPost = footer.querySelector('#blog-head__btn-publish');
        this.#btnDraftPost = footer.querySelector('#blog-head__btn-draft');

        this.#title.addEventListener('input', () => this.#permalink.defaultValue = this.#formatPermalinkTitle(this.#title.value));
        this.#title.addEventListener('change', () => this.#title.value = this.#title.value.trim());

        this.#permalink.addEventListener('change', () => this.#permalink.value = this.#formatPermalinkTitle(this.#permalink.value));
        btnResetPermalink.addEventListener('click', () => this.#permalink.value = this.#permalink.defaultValue);

        for (const field of [this.#title, this.#permalink, this.#description, this.#socialLink]) {
            field.addEventListener('input', () => this.#validation());
        }
        this.#textEditor.content.onChange = () => this.#validation();

        tglScheduled.addEventListener('change', event => {
            const isScheduled = event.target.checked;

            scheduledDate.toggleAttribute('required', isScheduled);
            scheduledDate.toggleAttribute('hidden', !isScheduled);
            scheduledTime.toggleAttribute('required', isScheduled);
            scheduledTime.toggleAttribute('hidden', !isScheduled);
            this.#btnPublishPost.textContent = isScheduled ? this.#btnPublishPost.dataset.contentSchedule : this.#btnPublishPost.dataset.contentPublish;
            permadate.textContent = isScheduled ? scheduledDate.value.replaceAll('-', '/') : permadate.dataset.default;

            this.#updateDateTimeFields(scheduledDate, scheduledTime, isScheduled);
        });

        this.#btnPublishPost.addEventListener('click', () => {
            console.log(this.#textEditor.content.html, this.#textEditor.content.text);
            console.log(this.#textEditor.content.media);
        });
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

    /**
     * @param {HTMLInputElement} dateInput 
     * @param {HTMLInputElement} timeInput 
     * @param {boolean} isScheduled
     */
    #updateDateTimeFields(dateInput, timeInput, isScheduled) {
        if (!isScheduled)
            return clearTimeout(this.#scheduledTimeout.id);

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
                    console.log('Ding!');
            }

            timeInput.defaultValue = defaultTimeValue;
            dateInput.defaultValue = targetDateValue;

            scheduledTimeout.id = setTimeout(recursiveLogic, 60000, scheduledTimeout);
        }

        recursiveLogic(this.#scheduledTimeout);
    }

    #validation() {
        const textEditorValid = this.#textEditor.content.text.length || this.#textEditor.content.media.length;

        const valid = textEditorValid
            && this.#title.checkValidity()
            && this.#permalink.checkValidity()
            && this.#description.checkValidity()
            && this.#socialLink.checkValidity();

        this.#btnPublishPost.disabled = !valid;
        this.#btnDraftPost.disabled = !valid;
    }
});