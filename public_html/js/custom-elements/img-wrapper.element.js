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

    /** @type {number} */ #imageId;

    /** @type {ShadowRoot} */ #shadow;
    #image;

    constructor() {
        const element = super();
        this.#service = imageGalleryService;

        this.#self = element;
        this.#shadow = element.attachShadow({ mode: 'open'});
        this.#image = document.createElement('img');

        this.#showInFullscreen = this.#showInFullscreen.bind(this);
    }

    /**
     * @param {string} name 
     * @param {string} _ Old value
     * @param {string} newValue 
     */
    attributeChangedCallback(name, _, newValue) {
        switch (name) {
            case 'image-id':
                this.#processImageId(newValue);
                return;

            case 'aspect-ratio':
                this.#processAspectRatio(newValue);
                return;

            case 'width':
                this.#processSize(newValue, 'width');
                return;

            case 'height':
                this.#processSize(newValue, 'height');
                return;

            case 'fullscreen-click':
                this.#processFullscreenClick(newValue);
                return;
        }

        if (this.#image.getAttribute('style') === '')
            this.#image.removeAttribute('style');
    }

    connectedCallback() {
        const self = this.#self;
        
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

    /** @param {string} value  */
    #processImageId(value) {
        this.#imageId = Number(value ?? 0);

        this.#service.getImageCallback(this.#imageId, image => {
            if (!image) return;

            const img = this.#image;
            img.src = imageGalleryPath + image.filename;
            img.ariaLabel = image.title;
            img.title = image.title;
            img.alt = image.description;
            img.ariaDescription = image.description;

            this.#shadow.replaceChildren(this.#image);
        });
    }

    /** @param {string} value  */
    #processAspectRatio(value) {
        const aspectRatio = value?.match(/^\d+(?:\/\d+)?$/)
            ?.at(0);

        this.#image.style.aspectRatio = aspectRatio ?? null;
        this.#image.style.objectFit = aspectRatio ? 'cover' : null;
    }

    /** @param {string} value */
    #processFullscreenClick(value) {
        const active = ['', 'true', 'yes', '1'].includes(value.toLowerCase());

        this.#image.style.cursor = active ? 'pointer' : null;

        if (active)
            this.#image.addEventListener('click', this.#showInFullscreen);
        else
            this.#image.addEventListener('click', this.#showInFullscreen);
    }

    /**
     * @param {string} value
     * @param {('width'|'height')} property
    */
    #processSize(value, property) {
        const match = value?.toLowerCase()
            .match(/^(\d+)([a-z]*|%)$/);

        if (match?.at(0) == undefined) {
            this.#image.style.removeProperty(property);
            return;
        }

        const size = match[1] + ( match[2] ? match[2] : 'px' );

        this.#image.style.setProperty(property, size);
    }

    #showInFullscreen = () => {
        fullscreenImage.show(this.#image);
    }
}

customElements.define('img-wrapper', ImgWrapperElement);