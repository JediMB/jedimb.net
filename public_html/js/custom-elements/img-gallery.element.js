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
    /** @type {boolean} */ #isFocused;
    /** @type {boolean} */ #isFullscreen;
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
        
        const galleryContainer = document.createElement('gallery-container');
        galleryContainer.contentEditable = 'false';
        galleryContainer.tabIndex = 0;

        const imageContainer = document.createElement('image-container');

        const btnPrev = document.createElement('button');
        btnPrev.textContent = '<';
        btnPrev.classList.add('prev');
        btnPrev.title = 'Previous';
        btnPrev.ariaLabel = 'Previous image';
        btnPrev.addEventListener('click', () => {});

        const btnNext = document.createElement('button');
        btnNext.textContent = '>';
        btnNext.classList.add('next');
        btnNext.title = 'Next';
        btnNext.ariaLabel = 'Next image';
        btnNext.addEventListener('click', () => {});

        galleryContainer.replaceChildren(btnPrev, imageContainer, btnNext);

        shadow.appendChild(galleryContainer);

        this.#service.getGallery(this.#galleryId, gallery => {
            galleryContainer.ariaLabel = gallery.title;
            galleryContainer.ariaDescription = gallery.description;

            this.#fillImages(gallery.imageIds, imageContainer);
            
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
                    this.#fillImages(gallery.imageIds, imageContainer);
        });

        galleryContainer.addEventListener('mouseenter', () => {
            this.#isHovered = true;
            clearTimeout(this.#timeoutId);
        });
        galleryContainer.addEventListener('focusin', () => {
            this.#isFocused = true;
            clearTimeout(this.#timeoutId);
        });

        galleryContainer.addEventListener('mouseleave', () => {
            this.#isHovered = false;
            this.#scheduleTransition(imageContainer);
        });
        galleryContainer.addEventListener('focusout', () => {
            this.#isFocused = false;
            this.#scheduleTransition(imageContainer);
        });

        galleryContainer.addEventListener('animationend', () => {
            this.#scheduleTransition(imageContainer)
        });

        const baseCSS = new CSSStyleSheet();
        baseCSS.replaceSync(`
            gallery-container {
                display: block;
                position: relative;
                border-radius: var(--spacing-internal);
                aspect-ratio: ${this.#aspectRatio};
                width: ${this.#width};
                max-width: 90%;
                margin-inline: auto;
                overflow: hidden;
            }

            image-container {
                display: block flex;
                width: 100%;
                height: 100%;
                position: relative;
                align-items: center;
                overflow: hidden;
                z-index: 1;
            }

            gallery-container:not(:hover, :focus) button {
                display: none;
            }

            button {
                position: absolute;
                top: 0;
                bottom: 0;
                width: 2rem;
                z-index: 2;
            }
            
            .prev {
                left: 0;
            }

            .next {
                right: 0;
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
            img.title = image.title;
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
        if (this.#isHovered || this.#isFocused || this.#isFullscreen)
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