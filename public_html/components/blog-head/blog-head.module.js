import BlogPostDTO from "/js/models/blog-post.dto.js";

customElements.define('blog-head-component', class BlogHeadComponent extends HTMLElement {
    /** @type {HTMLInputElement} */ #title;
    /** @type {HTMLInputElement} */ #permalink;
    /** @type {HTMLInputElement} */ #description;
    /** @type {HTMLInputElement} */ #sociallink;
    /** @type {HTMLInputElement} */ #tglPinned;
    /** @type {HTMLInputElement} */ #tglScheduled;
    /** @type {HTMLInputElement} */ #scheduledDate;

    /** @type {HTMLElement} */ #textBox;

    constructor() { super(); }

    connectedCallback() {
        const content = this.querySelector('blog-head-content');

        const body = content.querySelector('blog-head-body');
        this.#title = body.querySelector('#blog-head__title');
        const permadate = body.querySelector('#blog-head__permadate');
        this.#permalink = body.querySelector('#blog-head__permalink');
        this.#description = body.querySelector('#blog-head__description');
        this.#sociallink = body.querySelector('#blog-head__sociallink');

        const footer = content.querySelector('blog-head-footer');
        this.#tglPinned = footer.querySelector('#blog-head__toggle-pinned');
        this.#tglScheduled = footer.querySelector('#blog-head__toggle-schedule');
        this.#scheduledDate = footer.querySelector('#blog-head__scheduled-date');
        const scheduledTime = footer.querySelector('#blog-head__scheduled-time');
        const btnAddPost = footer.querySelector('#blog-head__btn-add');
        const btnCancelPost = footer.querySelector('#blog-head__btn-cancel');
        const btnPublishPost = footer.querySelector('#blog-head__btn-publish');
        const btnDraftPost = footer.querySelector('#blog-head__btn-draft');

        this.#title.addEventListener('input', () => this.#permalink.defaultValue = this.#formatPermalinkTitle(this.#title.value));
        this.#title.addEventListener('change', () => this.#title.value = this.#title.value.trim());

        this.#permalink.addEventListener('change', () => this.#permalink.value = this.#formatPermalinkTitle(this.#permalink.value));

        this.#tglScheduled.addEventListener('change', event => {
            const isScheduled = event.target.checked;

            this.#scheduledDate.toggleAttribute('hidden', !isScheduled);
            scheduledTime.toggleAttribute('hidden', !isScheduled);
            btnPublishPost.textContent = isScheduled ? btnPublishPost.dataset.contentSchedule : btnPublishPost.dataset.contentPublish;
            permadate.textContent = isScheduled ? this.#scheduledDate.value.replaceAll('-', '/') : permadate.dataset.default;
        });

        btnPublishPost.addEventListener('click', () => {
            console.log('click');
        });

        const textEditor = this.querySelector('text-editor-component');
        textEditor.addEventListener('text-change', event => {
            this.#textBox = event.detail;
            
            const isEmpty = !this.#textBox.textContent.length;
            btnPublishPost.disabled = isEmpty;
            btnDraftPost.disabled = isEmpty;
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

    #isInvalid() {

    }
});