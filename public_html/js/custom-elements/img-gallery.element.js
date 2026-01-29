import { imageGalleryPath } from "/js/constants/meta-constants.js";
import imageGalleryService from "/js/services/image-gallery.service.js";
import inlineStyle from "/js/utilities/inline-style.utility.js";

export class ImgGalleryElement extends HTMLElement {
    static observedAttributes = [
        'gallery-id',
        'aspect-ratio',
        'width'
    ];
    static #css = [
        ['display', 'block flex'],
        ['height', '10rem'],
        ['width', 'fit-content'],
        ['max-width', '75%'],
        ['margin-inline', 'auto'],
        ['overflow-x', 'auto']
    ];
    // Static CSS should be limited to what will unconditionally be applied to all elements of its type
    // Maybe it can be set to 'display: content' and the container within can handle most everything else?
    static #cssTextNode = inlineStyle.addCSS('img-gallery', ...this.#css);

    /** @type {ImgGalleryElement} */ #self;
    #service;

    /** @type {number} */ #galleryId;
    /** @type {number[]} */ #imageIds = [];
    /** @type {HTMLElement} */ #selection;

    constructor() {
        const component = super();
        this.#self = component;
        this.#service = imageGalleryService;
    }
    /**
     * 
     * @param {string} name 
     * @param {string} _ Old value
     * @param {string} newValue 
     */
    attributeChangedCallback(name, _, newValue) {
        
    }

    connectedCallback() {
        const self = this.#self;

        // self.addEventListener('mousedown', event => {
        //     if (event.button === 1)
        //         event.preventDefault();
        //     });
        // self.addEventListener('wheel', event => this.#scrollGallery(event));

        this.#galleryId = Number(self.getAttribute('gallery-id'));

        if (!this.#galleryId)
            throw new Error('No gallery id passed to img-gallery element');

        const shadow = self.attachShadow({ mode: 'open' });
        const group = document.createElement('gallery-group');
        group.contentEditable = 'false';
        shadow.appendChild(group);

        this.#service.getGallery(this.#galleryId, gallery => {
            for (const imageId of gallery.imageIds) {
                this.#imageIds.push(imageId);

                const image = this.#service.getImage(imageId);
                const img = document.createElement('img');
                img.src = imageGalleryPath + image.filename;
                group.appendChild(img);
            }
            this.#selection = group.firstElementChild;
        });

        const sheet = new CSSStyleSheet();
        sheet.replaceSync(`gallery-group {
            display: block flex;
            align-items: center;
            justify-content: center;
            gap: 1em;
            scroll-snap-style: inline mandatory;
            scroll-padding-inline: 1em;
            -ms-overflow-style: none;
            scrollbar-width: none;
        }

        gallery-group::-webkit-scrollbar {
            display: none;
        }

        img {
            border-radius: var(--spacing-internal);
            height: 100%;
            aspect-ratio: 3/2;
            object-fit: cover;
            scroll-snap-align: start;
        }`);
        shadow.adoptedStyleSheets = [ sheet ];
    }

    disconnectedCallback() {}

    connectedMoveCallback() {}

    /** @param {WheelEvent} event  */
    #scrollGallery(event) {
        if (event.ctrlKey || event.altKey || event.shiftKey || event.metaKey)
            return;

        if (!event.deltaY)
            return;

        event.preventDefault();

        const forward = event.deltaY > 0;

        if (forward)
            this.#selection = this.#selection.nextElementSibling ?? this.#selection.parentElement.firstElementChild;
        else
            this.#selection = this.#selection.previousElementSibling ?? this.#selection.parentElement.lastElementChild;

        console.log(this.#selection);
    }
}

customElements.define('img-gallery', ImgGalleryElement);