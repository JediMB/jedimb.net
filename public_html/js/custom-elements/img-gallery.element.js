export class ImgGalleryElement extends HTMLElement {
    static observedAttributes = [ 'data-gallery-id' ];

    /** @type {ImgGalleryElement} */ #self;
    /** @type {number} */ #galleryId;
    /** @type {number[]} */ #imageIds;

    constructor() {
        const component = super();
        this.#self = component;
    }

    connectedCallback() {
        const self = this.#self;

        this.#galleryId = self.getAttribute('data-gallery-id');

        self.textContent = this.#galleryId;
    }

    disconnectedCallback() {}

    connectedMoveCallback() {}
}

customElements.define('img-gallery', ImgGalleryElement);