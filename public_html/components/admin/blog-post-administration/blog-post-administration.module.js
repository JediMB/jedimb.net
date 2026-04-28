export default class BlogPostAdministrationComponent extends HTMLElement {
    /** @type {HTMLUListElement} */ #list;
    /** @type {HTMLTemplateElement} */ #template;

    constructor() { super(); }

    connectedCallback() {
        this.#list = this.querySelector('#admin__blog-post__list');
        this.#template = this.querySelector('#admin__blog-post__template');
    }

    connectedMoveCallback() {}

    disconnectedCallback() {}
}

customElements.define('blog-post-administration-component', BlogPostAdministrationComponent);
