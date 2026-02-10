import BlogPostDTO from "/js/models/blog-post.dto.js";

customElements.define('blog-head-component', class BlogHeadComponent extends HTMLElement {
    /** @type {HTMLInputElement} */ #title;
    /** @type {HTMLInputElement} */ #permalink;
    /** @type {HTMLInputElement} */ #description;
    /** @type {HTMLInputElement} */ #sociallink;
    /** @type {HTMLInputElement} */ #isPinned;
    /** @type {HTMLInputElement} */ #isScheduled;
    /** @type {HTMLInputElement} */ #scheduledOn;

    /** @type {HTMLElement} */ #textBox;

    constructor() { super(); }

    connectedCallback() {
        if (!this.hasAttribute('c-id'))
            throw new Error('Blog Head c-id attribute missing');

        const cId = this.getAttribute('c-id');

        this.#title = this.querySelector(`#blog-head-title-${cId}`);
        this.#permalink = this.querySelector(`#blog-head-permalink-${cId}`);
        this.#description = this.querySelector(`#blog-head-description-${cId}`);
        this.#sociallink = this.querySelector(`#blog-head-sociallink-${cId}`);
        this.#isPinned = this.querySelector(`#blog-head-toggle-pinned-${cId}`);
        this.#isScheduled = this.querySelector(`#blog-head-toggle-schedule-${cId}`);
        this.#scheduledOn = this.querySelector(`#blog-head-scheduled-on-${cId}`);

        const btnAddPost = this.querySelector(`#blog-head-btn-add-${cId}`);
        const btnCancelPost = this.querySelector(`#blog-head-btn-cancel-${cId}`);
        const btnPublishPost = this.querySelector(`#blog-head-btn-publish-${cId}`);
        const btnDraftPost = this.querySelector(`#blog-head-btn-draft-${cId}`);

        const textEditor = this.querySelector('text-editor-component');
        textEditor.addEventListener('text-change', event => {
            this.#textBox = event.detail;
            
            const isEmpty = !this.#textBox.textContent.length;
            btnPublishPost.disabled = isEmpty;
            btnDraftPost.disabled = isEmpty;
        });
    }
});