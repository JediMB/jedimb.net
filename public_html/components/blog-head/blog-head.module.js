import BlogPostDTO from "/js/models/blog-post.dto.js";
import { TextEditorComponent } from "/js/components/text-editor/text-editor.module.js";
import blogPostService from "/js/services/blog-post.service.js";

customElements.define('blog-head-component', class BlogHeadComponent extends HTMLElement {
    #scheduledTimeout = { id: null };

    /** @type {HTMLInputElement} */ #title;
    /** @type {HTMLInputElement} */ #permalink;
    /** @type {TextEditorComponent} */ #textEditor;
    /** @type {HTMLInputElement} */ #description;
    /** @type {HTMLInputElement} */ #socialLink;

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
        this.#title = body.querySelector('#blog-head__title');
        const permadate = body.querySelector('#blog-head__permadate');
        this.#permalink = body.querySelector('#blog-head__permalink');
        const btnResetPermalink = body.querySelector('#blog-head__reset-permalink');
        this.#textEditor = this.querySelector('#blog-head__text-editor');
        this.#description = body.querySelector('#blog-head__description');
        this.#socialLink = body.querySelector('#blog-head__sociallink');

        const footer = content.querySelector('blog-head-footer');
        this.#tglPinned = footer.querySelector('#blog-head__toggle-pinned');
        this.#tglScheduled = footer.querySelector('#blog-head__toggle-schedule');
        this.#scheduledDate = footer.querySelector('#blog-head__scheduled-date');
        this.#scheduledTime = footer.querySelector('#blog-head__scheduled-time');
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

        blogPostService.getBlogPost(1, value => {
            
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

    #publishPost() {
        const content = this.#textEditor.content.html;

        const post = new BlogPostDTO({
            permalink: this.#permalink.value,
            title: this.#title.value,
            contentShort: content.short,
            contentRest: content.rest,
            description: this.#description.value,
            mastolink: this.#socialLink.value,
            isPinned: this.#tglPinned.checked,
            scheduledOn: this.#tglScheduled.checked
                ? new Date(`${this.#scheduledDate.value}T${this.#scheduledTime.value}`)
                : null
        });

        console.log(post);

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
                    console.log('Ding!');
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
            && this.#title.checkValidity()
            && this.#permalink.checkValidity()
            && this.#description.checkValidity()
            && this.#socialLink.checkValidity();

        this.#btnPublishPost.disabled = !valid;
        this.#btnDraftPost.disabled = !valid;
    }
});