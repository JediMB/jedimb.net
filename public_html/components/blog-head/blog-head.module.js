customElements.define('blog-head-component', class BlogHead extends HTMLElement {
    #self;

    constructor() {
        const component = super();
        this.#self = component;
    }

    connectedCallback() {
        const self = this.#self;

        const addButton = self.querySelector('[btn-add]');

        const textEditor = self.querySelector('text-editor-component');
        textEditor.addEventListener('change', (event) => event.detail && console.log(event.detail));
    }
});