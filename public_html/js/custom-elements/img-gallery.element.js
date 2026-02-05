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
    static #cssTextNode = inlineStyle.addCSS('img-gallery', {
        display: 'inline-block',
        'max-width': '100%'
    });

    /** @type {ImgGalleryElement} */ #self;
    #service;
    #listener;

    /** @type {ShadowRoot} */ #shadow;
    /** @type {HTMLElement} */ #galleryContainer;
    /** @type {HTMLElement} */ #slideContainer;

    /** @type {number} */ #galleryId;
    /** @type {number} */ #waitTime;

    /** @type {string} */ static #defaultAspectRatio = '1';
    /** @type {number} */ static #defaultTransitionTime = 2000;
    /** @type {number} */ static #defaultWaitTime = 2000;
    /** @type {string} */ static #defaultWidth = '75%';

    /** @type {boolean} */ #isHovered;
    /** @type {boolean} */ #isFocused;
    /** @type {boolean} */ #isFullscreen;
    /** @type {boolean} */ #isSliding;
    /** @type {number} */ #timeoutId;

    #cssBase = new CSSStyleSheet();
    #cssAspectRatio = new CSSStyleSheet();
    #cssTransitionTime = new CSSStyleSheet();
    #cssWaitTime = new CSSStyleSheet();
    #cssWidth = new CSSStyleSheet();

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
        switch (name) {
            case 'gallery-id':
                this.#processGalleryId(newValue);
                break;

            case 'aspect-ratio':
                this.#processAspectRatio(newValue);
                break;

            case 'width':
                this.#processWidth(newValue);
                break;

            case 'transition-time':
                this.#processTransitionTime(newValue);
                break;

            case 'wait-time':
                this.#processWaitTime(newValue);
                break;
        }
    }

    connectedCallback() {
        const self = this.#self;

        this.#shadow = self.attachShadow({ mode: 'open' });
        this.#shadow.adoptedStyleSheets = [
            this.#cssBase,
            this.#cssAspectRatio,
            this.#cssTransitionTime,
            this.#cssWaitTime,
            this.#cssWidth
        ];
        
        this.#galleryContainer = document.createElement('gallery-container');
        this.#galleryContainer.contentEditable = 'false';
        this.#galleryContainer.tabIndex = 0;

        this.#slideContainer = document.createElement('image-container');

        const btnPrev = document.createElement('button');
        btnPrev.textContent = '<';
        btnPrev.classList.add('prev');
        btnPrev.title = 'Previous';
        btnPrev.ariaLabel = 'Previous image';
        btnPrev.addEventListener('click', () => this.#prev());

        const btnNext = document.createElement('button');
        btnNext.textContent = '>';
        btnNext.classList.add('next');
        btnNext.title = 'Next';
        btnNext.ariaLabel = 'Next image';
        btnNext.addEventListener('click', () => this.#next());

        this.#galleryContainer.replaceChildren(btnPrev, this.#slideContainer, btnNext);

        this.#shadow.appendChild(this.#galleryContainer);

        this.setupFromAttributes();

        this.#listener = this.#service.galleries.subscribe(null, false,
            (_, gallery) => {
                if (gallery.id === this.#galleryId)
                    this.#fillImages(gallery.imageIds);
        });

        this.#galleryContainer.addEventListener('mouseenter', () => {
            this.#isHovered = true;
            clearTimeout(this.#timeoutId);
        });
        this.#galleryContainer.addEventListener('focusin', () => {
            this.#isFocused = true;
            clearTimeout(this.#timeoutId);
        });

        this.#galleryContainer.addEventListener('mouseleave', () => {
            this.#isHovered = false;
            this.#scheduleTransition();
        });
        this.#galleryContainer.addEventListener('focusout', () => {
            this.#isFocused = false;
            this.#scheduleTransition();
        });

        this.#galleryContainer.addEventListener('animationend', () => {
            this.#isSliding = false;
            this.#scheduleTransition()
        });

        this.#galleryContainer.addEventListener('keydown', event => {
            if (event.ctrlKey || event.altKey || event.shiftKey || event.metaKey)
                return;

            switch(event.key) {
                case 'ArrowLeft':
                    event.preventDefault();
                    event.stopPropagation();
                    btnPrev.click();
                    return;

                case 'ArrowRight':
                    event.preventDefault();
                    event.stopPropagation();
                    btnNext.click();
                    return;
            }
        });

        this.#cssBase.replaceSync(`
            gallery-container {
                display: block;
                position: relative;
                border-radius: var(--spacing-internal);
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
                z-index: 3;
            }
            
            .prev {
                left: 0;
            }

            .next {
                right: 0;
            }

            .image-container > * {
                position: relative;
                z-index: 1;
            }

            img {
                height: 100%;
                object-fit: cover;
                cursor: pointer;
            }

            .cover {
                transform: translateX(-100%);
            }

            .cover,
            .slide-in,
            .slide-out {
                z-index: 2;
            }
                
            @keyframes slide-in {
                from { transform: translateX(0); }
                to { transform: translateX(-100%); }
            }

            @keyframes slide-out {
                from { transform: translateX(-100%); }
                to { transform: translateX(0); }
            }
        `);
    }

    disconnectedCallback() {
        this.#listener.unsubscribe();
    }

    connectedMoveCallback() {}

    /** 
     * @param {number[]} imageIds  
     * @param {HTMLElement} container
     */
    #fillImages(imageIds) {
        const container = this.#slideContainer;
        container.textContent = '';

        for (let i = 0; i < imageIds.length; i++) {
            const imageId = imageIds[i];

            const image = this.#service.getImage(imageId);
            const img = document.createElement('img');
            img.src = imageGalleryPath + image.filename;
            img.ariaLabel = image.title;
            img.title = image.title;
            img.alt = image.description;
            img.ariaDescription = image.description;
            container.appendChild(img);

            if (i === 1)
                img.classList.add('slide-in');

            img.addEventListener('click', () => {
                clearTimeout(this.#timeoutId);
                this.#isFullscreen = true;
                
                fullscreenImage.show(img, () => {
                    this.#isFullscreen = false;
                    this.#scheduleTransition();
                });
            });
        }
    }

    #next() {
        const container = this.#slideContainer;

        if (container.childElementCount < 2)
            return;

        if (this.#isSliding)
            return;

        this.#isSliding = true;
        
        container.appendChild(container.firstElementChild);
        container.firstElementChild.classList.value = '';
        container.firstElementChild.nextElementSibling.classList.value = 'slide-in';
    }

    #prev() {
        const container = this.#slideContainer;

        if (container.childElementCount < 2)
            return;

        if (this.#isSliding)
            return;

        this.#isSliding = true;

        const nextSibling = container.firstElementChild.nextElementSibling;
        nextSibling.classList.value = 'slide-out';

        nextSibling.addEventListener('animationend', event => {
            event.stopPropagation();
            this.#isSliding = false;
            
            nextSibling.classList.value = '';
            container.prepend(container.lastElementChild);
            container.firstElementChild.nextSibling.classList.value = 'cover';
        }, { once: true });
    }

    /** @param {string} value  */
    #processAspectRatio(value) {
        const aspectRatio = value?.match(/^\d+(?:\/\d+)?$/)
            ?.at(0)
            ?? ImgGalleryElement.#defaultAspectRatio;

        this.#cssAspectRatio.replaceSync(`
            gallery-container {
                aspect-ratio: ${aspectRatio};
            }

            img {
                aspect-ratio: ${aspectRatio};
            }
        `);
    }

    /** @param {string} value  */
    #processGalleryId(value) {
        this.#galleryId = Number(value ?? 0);

        this.#service.getGallery(this.#galleryId, gallery => {
            this.#galleryContainer.ariaLabel = gallery.title;
            this.#galleryContainer.ariaDescription = gallery.description;

            this.#fillImages(gallery.imageIds);
        });
    }

    /** @param {string} value  */
    #processTransitionTime(value) {
        let transitionTime = this.#durationStringToMilliseconds(value);

        if (transitionTime < 0)
            transitionTime = ImgGalleryElement.#defaultTransitionTime;

        setTimeout(() => {
            this.#cssTransitionTime.replaceSync(`
                .slide-in {
                    animation: slide-in ${transitionTime}ms forwards;
                }

                .slide-out {
                    animation: slide-out ${transitionTime}ms forwards;
                }
            `);
        }, this.#waitTime);
    }

    /** @param {string} value  */
    #processWaitTime(value) {
        const milliseconds = this.#durationStringToMilliseconds(value)
        
        if (milliseconds < 0) {
            this.#waitTime = ImgGalleryElement.#defaultWaitTime;
            return;
        }

        this.#waitTime = milliseconds;
    }

    /** @param {string} value  */
    #processWidth(value) {
        const width = value?.toLowerCase()
            .match(/^\d+(?:[a-z]*|%)$/)
            ?.at(0)
            ?? ImgGalleryElement.#defaultWidth;

        this.#cssWidth.replaceSync(`
            gallery-container {
                width: ${width};
            }
        `);
    }

    #scheduleTransition() {
        if (this.#isHovered || this.#isFocused || this.#isFullscreen)
            return;

        this.#timeoutId = setTimeout(() => this.#next(), this.#waitTime);
    }

    setupFromAttributes() {
        const self = this.#self;
        
        this.#processGalleryId(self.getAttribute('gallery-id'));
        this.#processAspectRatio(self.getAttribute('aspect-ratio'));
        this.#processWidth(self.getAttribute('width'));
        this.#processWaitTime(self.getAttribute('wait-time'));
        this.#processTransitionTime(self.getAttribute('transition-time'));
    }

    /**
     * @param {string|null} timeString 
     * @returns {number}
     */
    #durationStringToMilliseconds(timeString) {
        if (!timeString)
            return -1;

        const match = timeString.toLowerCase().match(/^(\d+)(?:(?:(?:\.\d+)?s)|(ms))$/);

        if (!match)
            return -1;

        if (match[2]) return match[1];

        return 1000 * Number(match[0].substring(0, match[0].length - 1));
    }
}

customElements.define('img-gallery', ImgGalleryElement);