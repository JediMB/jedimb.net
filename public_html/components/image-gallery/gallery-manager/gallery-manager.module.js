customElements.define('gallery-manager-component', class GalleryManagerComponent extends HTMLElement {
    /** @type {GalleryManagerComponent} */
    #self;

    constructor() {
        const component = super();
        this.#self = component;
    }

    connectedCallback() {}

    disconnectedCallback() {}

    connectedMoveCallback() {}
});
