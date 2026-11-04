export default class BlogPostComponent extends HTMLElement {
    constructor() { super(); }

    connectedCallback() {}

    connectedMoveCallback() {}

    disconnectedCallback() {}
}

customElements.define('blog-post-component', BlogPostComponent);
