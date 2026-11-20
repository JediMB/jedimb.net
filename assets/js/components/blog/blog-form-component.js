import ContentEditorComponent from "/js/components/content-editor-component.js";

export default class BlogFormComponent extends HTMLElement {
    /** @type {HTMLFormElement} */ #form;
    
    /** @type {HTMLInputElement} */ #inputTitle;

    /** @type {ContentEditorComponent} */ #editor;

    constructor() { super(); }

    connectedCallback() {
        this.#form = this.querySelector('form');
        const formId = this.#form.id;
        this.#editor = this.querySelector(customElements.getName(ContentEditorComponent));

        this.#inputTitle = this.#form.elements['title'];
        this.#inputTitle.addEventListener('input', () => {
            this.#editor.setHeading(this.#inputTitle.value);
        });
    }

    disconnectedCallback() {}
}

customElements.define('blog-form-component', BlogFormComponent);
