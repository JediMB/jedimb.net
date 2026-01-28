import { imageGalleryPath } from "/js/constants/meta-constants.js";
import imageGalleryService from "/js/services/image-gallery.service.js";
import inlineStyle from "/js/utilities/inline-style.utility.js";

export class ImgGalleryElement extends HTMLElement {
    static observedAttributes = [ 'data-gallery-id' ];
    static cssTextNode = inlineStyle.addCSS('img-gallery',
        ['display', 'block flex'],
        ['height', '10rem'],
        ['width', 'fit-content'],
        ['max-width', '75%'],
        ['margin-inline', 'auto'],
        ['overflow-x', 'auto']
    );

    /** @type {ImgGalleryElement} */ #self;
    #service;

    /** @type {number} */ #galleryId;
    /** @type {number[]} */ #imageIds;

    constructor() {
        const component = super();
        this.#self = component;
        this.#service = imageGalleryService;
    }

    connectedCallback() {
        const self = this.#self;
        this.#galleryId = Number(self.getAttribute('data-gallery-id'));

        if (!this.#galleryId)
            throw new Error('No gallery id passed to img-gallery element');

        const shadow = self.attachShadow({ mode: 'open' });
        const group = document.createElement('div');
        shadow.appendChild(group);

        this.#service.getGallery(this.#galleryId, gallery => {
            for (const imageId of gallery.imageIds) {
                const image = this.#service.getImage(imageId);
                const img = document.createElement('img');
                img.src = imageGalleryPath + image.filename;
                group.appendChild(img);
            }
        });

        const sheet = new CSSStyleSheet();
        sheet.replaceSync(`div {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 1em;
        }

        img {
            border-radius: var(--spacing-internal);
            height: 100%;
            aspect-ratio: 3/2;
            object-fit: cover;
        }`);
        shadow.adoptedStyleSheets = [ sheet ];
    }

    disconnectedCallback() {}

    connectedMoveCallback() {}
}

customElements.define('img-gallery', ImgGalleryElement);