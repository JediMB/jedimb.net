import { imageGalleryPath } from "/js/constants/meta-constants.js";
import imageGalleryService from "/js/services/image-gallery.service.js";
import inlineStyle from "/js/utilities/inline-style.utility.js";

export class ImgGalleryElement extends HTMLElement {
    static observedAttributes = [
        'gallery-id',
        'aspect-ratio',
        'width'
    ];
    static #cssTextNode = inlineStyle.addCSS('img-gallery', { display: 'contents' });

    /** @type {ImgGalleryElement} */ #self;
    #service;

    /** @type {number} */ #galleryId = 0;
    /** @type {string} */ #aspectRatio = '1';
    /** @type {string} */ #width = '75%';
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

        this.#setAttributeMembers();

        if (!this.#galleryId)
            throw new Error('No gallery id passed to img-gallery element');

        const shadow = self.attachShadow({ mode: 'open' });
        const group = document.createElement('contents');
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
        sheet.replaceSync(`contents {
            display: block flex;
            aspect-ratio: ${this.#aspectRatio};
            width: ${this.#width};
            max-width: 90%;
            margin-inline: auto;
            align-items: center;
            gap: 1em;
            overflow-x: auto;
            scroll-snap-style: inline mandatory;
            scroll-padding-inline: 1em;
            -ms-overflow-style: none;
            scrollbar-width: none;
        }

        contents::-webkit-scrollbar {
            display: none;
        }

        img {
            border-radius: var(--spacing-internal);
            height: 100%;
            aspect-ratio: ${this.#aspectRatio};
            object-fit: cover;
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

    #setAttributeMembers() {
        const self = this.#self;

        this.#galleryId = Number(self.getAttribute('gallery-id') ?? this.#galleryId);

        this.#aspectRatio = self.getAttribute('aspect-ratio')
            ?.match(/^\d+(?:\/\d+)?$/)
            ?.at(0)
            ?? this.#aspectRatio;

        this.#width = self.getAttribute('width')
            ?.toLowerCase()
            ?.match(/^\d+[a-z%]*$/)
            ?.at(0)
            ?? this.#width;
    }
}

customElements.define('img-gallery', ImgGalleryElement);