export default class BlogHeadComponent extends HTMLElement {
    #active = false;

    /** @type {HTMLButtonElement} */ #btnAddPost;
    /** @type {HTMLElement} */ #content;

    constructor() { super(); }

    connectedCallback() {
        this.#btnAddPost = this.querySelector('[btn-add-post]');

        this.#content = this.querySelector('blog-head-content');

        this.#btnAddPost.addEventListener('click', () => this.#toggleMode());
    }

    connectedMoveCallback() {}

    disconnectedCallback() {}

    #toggleMode() {
        const active = !this.#active;
        const button = this.#btnAddPost;

        button.ariaPressed = `${active}`;
        button.classList.toggle('btn-primary', !active);
        button.classList.toggle('btn-secondary', active);
        button.classList.toggle('active', active);

        button.title = active
            ? button.dataset.titleActive
            : button.dataset.titleInactive;

        this.#content.hidden = !active;

        this.#active = active;
    }
}

customElements.define('blog-head-component', BlogHeadComponent);