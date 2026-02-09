customElements.define('blog-head-component', class BlogHead extends HTMLElement {
    #self;

    constructor() {
        const component = super();
        this.#self = component;
    }

    connectedCallback() {
        const self = this.#self;

        const addButton = self.querySelector('[btn-add]');

        const textEditor = this.querySelector('text-editor-component');
        textEditor.addEventListener('text-change', event => {
            event.stopPropagation();

            this.#content = event.detail;
            console.log(event.detail);
        });
    }
});