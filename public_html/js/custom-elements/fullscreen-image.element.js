import inlineStyle from "/js/utilities/inline-style.utility.js";
export { fullscreenImage as default };

const fullscreenImageTag = 'fullscreen-image';

class FullscreenImage extends HTMLElement {
    static #cssTextNode = inlineStyle.addCSS(fullscreenImageTag, { display: 'contents' });
    /** @type {FullscreenImage} */ #self;
    /** @type {HTMLElement} */ #imageWrapper;
    /** @type {() => void} */ #onClose;

    constructor() {
        const component = super();
        this.#self = component;
    }

    connectedCallback() {
        const self = this.#self;
        self.toggleAttribute('hidden', true);
        const shadow = self.attachShadow({ mode: 'open' });

        const fullscreenContainer = document.createElement('fullscreen-container');
        shadow.appendChild(fullscreenContainer);

        const btnClose = document.createElement('button');
        btnClose.textContent = 'Close';
        fullscreenContainer.appendChild(btnClose);
        btnClose.addEventListener('click', () => self.close());

        this.#imageWrapper = document.createElement('image-wrapper');
        fullscreenContainer.appendChild(this.#imageWrapper);

        const baseCSS = new CSSStyleSheet();
        baseCSS.replaceSync(`
            fullscreen-container {
                display: block;
                position: absolute;
                inset: 0;
                background-color: #000;
                z-index: 9999;
            }

            button {
                position: absolute;
                right: 0;
                top: 0;
                font-size: 2rem;
            }

            image-wrapper {
                display: flex block;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: calc(100% - 4rem);
                margin-block: 2rem;
            }

            img {
                max-height: 100%;
                max-width: 100%;
            }
        `);
        shadow.adoptedStyleSheets.push(baseCSS);
    }

    connectedMoveCallback() {}

    disconnectedCallback() {}

    /** 
     * @param {HTMLImageElement} img 
     * @param {() => void} [onClose=null] 
     */
    show(img, onClose = null) {
        this.#onClose = onClose;
        /** @type {HTMLImageElement} */
        const clone = img.cloneNode();
        clone.removeAttribute('style');
        this.#imageWrapper.replaceChildren(clone);
        this.#self.toggleAttribute('hidden', false);
    }

    close() {
        this.#self.toggleAttribute('hidden', true);
        this.#onClose?.call(this);
        this.#onClose = null;
    }
}
customElements.define(fullscreenImageTag, FullscreenImage);

/** @type {FullscreenImage} */
const fullscreenImage = document.createElement(fullscreenImageTag);
document.querySelector('body')?.appendChild(fullscreenImage);