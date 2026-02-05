import { imageGalleryPath } from "/js/constants/meta-constants.js";
import fullscreenImage from "/js/custom-elements/fullscreen-image.element.js";
import imageGalleryService from "/js/services/image-gallery.service.js";

export class ImgWrapperElement extends HTMLElement {
    static observedAttributes = [
        'image-id',
        'aspect-ratio',
        'width',
        'height',
        'fullscreen-click'
    ];

    /** @type {ImgWrapperElement} */ #self;
    #service;
    #listener;

    /** @type {ShadowRoot} */ #shadow;

    /** @type {number} */ #imageId;

    constructor() {
        const element = super();
        this.#self = element;
        this.#service = imageGalleryService;
    }

    /**
     * @param {string} name 
     * @param {string} _ Old value
     * @param {string} newValue 
     */
    attributeChangedCallback(name, _, newValue) {
        switch (name) {
            case 'image-id':
                if (this.#imageId === undefined)
                    return;
            return;

            case 'aspect-ratio':
                return;

            case 'width':
                return;

            case 'height':
                return;

            case 'fullscreen-click':
                return;
        }
    }

    connectedCallback() {
        const self = this.#self;
        this.#shadow = self.attachShadow({ mode: 'open'});

        this.#imageId = Number(self.getAttribute('image-id') ?? 0);

        const img = document.createElement('img');

        this.#service.getImageCallback(this.#imageId, image => {
            if (!image) return;

            img.src = imageGalleryPath + image.filename;
        });

        this.#shadow.replaceChildren(img);
        
        this.#listener = this.#service.images.subscribe(null, false,
            (_, image) => {
                if (image.id === this.#imageId)
                    console.log('Update the image');
        });
    }

    connectedMoveCallback() {}

    disconnectedCallback() {
        this.#listener.unsubscribe();
    }
}

customElements.define('img-wrapper', ImgWrapperElement);