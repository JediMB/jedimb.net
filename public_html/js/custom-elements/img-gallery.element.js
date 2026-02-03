import { imageGalleryPath } from "/js/constants/meta-constants.js";
import fullscreenImage from "/js/custom-elements/fullscreen-image.element.js";
import imageGalleryService from "/js/services/image-gallery.service.js";
import inlineStyle from "/js/utilities/inline-style.utility.js";

export class ImgGalleryElement extends HTMLElement {
    static observedAttributes = [
        'gallery-id',
        'aspect-ratio',
        'width',
        'transition-time',
        'wait-time'
    ];
    static #cssTextNode = inlineStyle.addCSS('img-gallery', { display: 'contents' });

    /** @type {ImgGalleryElement} */ #self;
    #service;
    #listener;

    /** @type {number} */ #galleryId = 0;
    /** @type {string} */ #aspectRatio = '1';
    /** @type {string} */ #width = '75%';
    /** @type {number} */ #transitionTime = 2000;
    /** @type {number} */ #waitTime = 2000;

    /** @type {number[]} */ #imageIds = [];
    /** @type {boolean} */ #isHovered;
    /** @type {bolean} */ #isFullscreen;
    /** @type {number} */ #timeoutId;

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

        this.#setAttributeMembers();

        const shadow = self.attachShadow({ mode: 'open' });
        
        const container = document.createElement('gallery-container');
        container.contentEditable = 'false';
        container.tabIndex = 0;
        container.role = 'img';
        shadow.appendChild(container);

        this.#service.getGallery(this.#galleryId, gallery => {
            container.ariaLabel = gallery.title;
            container.ariaDescription = gallery.description;

            this.#fillImages(gallery.imageIds, container);
            
            setTimeout(() => {
                const animationCSS = new CSSStyleSheet();
                animationCSS.replaceSync(`
                    img:nth-child(2) {
                        animation: slide-in ${this.#transitionTime}ms forwards;
                    }
                        
                    @keyframes slide-in {
                        from { transform: translate(0); }
                        to { transform: translate(-100%); }
                    }
                `);
                shadow.adoptedStyleSheets.push(animationCSS);
            }, this.#waitTime);
        });

        this.#listener = this.#service.galleries.subscribe(null, false,
            (_, gallery) => {
                if (gallery.id === this.#galleryId)
                    this.#fillImages(gallery.imageIds, container);
        });

        container.addEventListener('mouseenter', () => {
            this.#isHovered = true;
            clearTimeout(this.#timeoutId);
        });

        container.addEventListener('mouseleave', () => {
            this.#isHovered = false;
            this.#scheduleTransition(container);
        });

        container.addEventListener('animationend', () => {
            this.#scheduleTransition(container)
        });

        const baseCSS = new CSSStyleSheet();
        baseCSS.replaceSync(`
            gallery-container {
                display: block flex;
                border-radius: var(--spacing-internal);
                aspect-ratio: ${this.#aspectRatio};
                width: ${this.#width};
                max-width: 90%;
                margin-inline: auto;
                align-items: center;
                overflow: hidden;
            }

            img {
                height: 100%;
                aspect-ratio: ${this.#aspectRatio};
                object-fit: cover;
                cursor: pointer;
            }
        `);
        shadow.adoptedStyleSheets.push(baseCSS);
    }

    disconnectedCallback() {
        this.#listener.unsubscribe();
    }

    connectedMoveCallback() {}

    /** 
     * @param {number[]} imageIds  
     * @param {HTMLElement} container
     */
    #fillImages(imageIds, container) {
        this.#imageIds = [];
        container.textContent = '';

        for (const imageId of imageIds) {
            this.#imageIds.push(imageId);

            const image = this.#service.getImage(imageId);
            const img = document.createElement('img');
            img.src = imageGalleryPath + image.filename;
            img.ariaLabel = image.title;
            img.alt = image.description;
            img.ariaDescription = image.description;
            container.appendChild(img);

            img.addEventListener('click', () => {
                clearTimeout(this.#timeoutId);
                this.#isFullscreen = true;
                
                fullscreenImage.show(img, () => {
                    this.#isFullscreen = false;
                    this.#scheduleTransition(container);
                });
            })
        }
    }

    /** @param {HTMLElement} container  */
    #scheduleTransition(container) {
        if (this.#isHovered || this.#isFullscreen)
            return;

        this.#timeoutId = setTimeout(
            () => {
                if (!container.firstElementChild)
                    return;

                container.appendChild(container.firstElementChild);
            },
        this.#waitTime);
    }

    #setAttributeMembers() {
        const self = this.#self;

        this.#galleryId = Number(self.getAttribute('gallery-id') ?? this.#galleryId);

        this.#aspectRatio = self.getAttribute('aspect-ratio')
            ?.match(/^\d+(?:\/\d+)?$/)
            ?.at(0)
            ?? this.#aspectRatio;

        this.#width = self.getAttribute('width')
            ?.toLowerCase().match(/^\d+[a-z%]*$/)
            ?.at(0)
            ?? this.#width;

        this.#transitionTime = this.#timeStringToMilliseconds(self.getAttribute('transition-time'), this.#transitionTime);
        this.#waitTime = this.#timeStringToMilliseconds(self.getAttribute('wait-time'), this.#waitTime);
    }

    /**
     * @param {string|null} timeString 
     * @param {number} defaultValue 
     * @returns {number}
     */
    #timeStringToMilliseconds(timeString, defaultValue) {
        if (typeof defaultValue !== 'number' || defaultValue < 0)
            throw new Error('Default value is not a valid number');

        if (!timeString)
            return defaultValue;

        const match = timeString.toLowerCase().match(/^(\d+)(?:(?:(?:\.\d+)?s)|(ms))$/);

        if (!match)
            return defaultValue;

        if (match[2]) return match[1];

        return 1000 * Number(match[0].substring(0, match[0].length - 1));
    }
}

customElements.define('img-gallery', ImgGalleryElement);