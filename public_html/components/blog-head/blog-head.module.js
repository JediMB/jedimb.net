import BlogPostDTO from "/js/models/blog-post.dto.js";
import { TextEditorComponent } from "/js/components/text-editor/text-editor.module.js";
import blogPostService from "/js/services/blog-post.service.js";

customElements.define('blog-head-component', class BlogHeadComponent extends HTMLElement {
    #scheduledTimeout = { id: null };

    /** @type {HTMLButtonElement} */ #btnAddPost;

    /** @type {HTMLFormElement} */ #form;

    /** @type {TextEditorComponent} */ #textEditor;

    /** @type {HTMLInputElement} */ #tglPinned;
    /** @type {HTMLInputElement} */ #tglScheduled;
    /** @type {HTMLInputElement} */ #scheduledDate;
    /** @type {HTMLInputElement} */ #scheduledTime;

    #btnPublishPost;
    #btnDraftPost;

    constructor() { super(); }

    connectedCallback() {
        this.#btnAddPost = this.querySelector('#blog-head__btn-add');

        const content = this.querySelector('blog-head-content');
        this.#form = content.querySelector('#blog-head__form');
        const inputs = this.#form.elements;

        const body = content.querySelector('blog-head-body');
        const permadate = body.querySelector('#blog-head__permadate');
        this.#textEditor = body.querySelector('#blog-head__text-editor');
        this.#form.onreset = () => this.#textEditor.content.reset();

        const footer = content.querySelector('blog-head-footer');
        this.#tglPinned = footer.querySelector('#blog-head__toggle-pinned');
        this.#tglScheduled = footer.querySelector('#blog-head__toggle-schedule');
        this.#scheduledDate = footer.querySelector('#blog-head__scheduled-date');
        this.#scheduledTime = footer.querySelector('#blog-head__scheduled-time');

        const btnCancelPost = footer.querySelector('#blog-head__btn-cancel');
        this.#btnPublishPost = footer.querySelector('#blog-head__btn-publish');
        this.#btnDraftPost = footer.querySelector('#blog-head__btn-draft');

        inputs['title'].addEventListener('input', () => inputs['permalink'].defaultValue = this.#formatPermalinkTitle(inputs['title'].value));
        inputs['title'].addEventListener('change', () => inputs['title'].value = inputs['title'].value.trim());

        inputs['permalink'].addEventListener('change', () => inputs['permalink'].value = this.#formatPermalinkTitle(inputs['permalink'].value));
        body.querySelector('#blog-head__reset-permalink').addEventListener('click', () => inputs['permalink'].value = inputs['permalink'].defaultValue);

        for (const field of [
                inputs['title'],
                inputs['permalink'],
                inputs['description'],
                inputs['mastolink']
            ]) {
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

        this.#btnAddPost.addEventListener('click', () => {
            const wasActive = !this.#btnAddPost.ariaPressed || this.#btnAddPost.ariaPressed !== 'false';
            this.#toggleFormView(!wasActive);
        });

        btnCancelPost.addEventListener('click', () => {
            this.#form.reset();
            this.#toggleFormView(false);
        });

        this.#btnAddPost.title = this.#btnAddPost.dataset.titleOpen;
        this.#btnAddPost.disabled = false;
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
        this.#form.elements['contentShort'].value = content.short;
        this.#form.elements['contentRest'].value = content.rest;

        const post = new BlogPostDTO(new FormData(this.#form));

        blogPostService.createBlogPost(post,
            value => {
                console.log('success', value);
            },
            errors => {
                for (const input of this.#form.elements) {
                    const error = errors[input.name];

                    if (!error) {
                        if (!input.classList.length)
                            continue;

                        input.classList.remove('error-required');
                        input.classList.remove('error-too-short');
                        input.classList.remove('error-too-long');
                        input.classList.remove('error-mismatch');
                        continue;
                    }

                    input.classList.toggle('error-required', !!error.required);
                    input.classList.toggle('error-too-short', !!error.tooShort);
                    input.classList.toggle('error-too-long', !!error.tooLong);
                    input.classList.toggle('error-mismatch', !!error.mismatch);

                }
            }
        );
    }

    /** @param {boolean} makeActive  */
    #toggleFormView(makeActive) {
        const button = this.#btnAddPost;

        button.ariaPressed = `${makeActive}`;
        button.classList.toggle('btn-primary', !makeActive);
        button.classList.toggle('btn-secondary', makeActive);
        button.title = makeActive ? button.dataset.titleClose : button.dataset.titleOpen;
        button.ariaControlsElements.at(0).toggleAttribute('hidden', !makeActive);

        button.querySelector('#blog-head__btn-add__path').setAttribute('d', makeActive ? button.dataset.pathClose : button.dataset.pathOpen);
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
            && this.#form.elements['title'].checkValidity()
            && this.#form.elements['permalink'].checkValidity()
            && this.#form.elements['description'].checkValidity()
            && this.#form.elements['mastolink'].checkValidity();

        this.#btnPublishPost.disabled = !valid;
        this.#btnDraftPost.disabled = !valid;
    }
});