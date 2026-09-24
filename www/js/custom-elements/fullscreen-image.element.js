export { fullscreenImage as default };

const fullscreenImageTag = 'fullscreen-image';

class FullscreenImageElement extends HTMLElement {
    /** @type {HTMLElement} */ #imageWrapper;
    /** @type {() => void} */ #onClose;

    constructor() {
        const component = super();
    }

    connectedCallback() {
        this.toggleAttribute('hidden', true);
        const shadow = this.attachShadow({ mode: 'open' });

        const fullscreenContainer = document.createElement('fullscreen-container');
        shadow.appendChild(fullscreenContainer);

        const btnClose = document.createElement('button');
        const targetSymbol = document.querySelector('#svg-close');

        if (targetSymbol) {
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('viewBox', targetSymbol.getAttribute('viewBox'));
            svg.setAttribute('width', '2em');
            svg.setAttribute('height', '2em');
            svg.setAttribute('fill', 'currentColor');
            svg.innerHTML = targetSymbol.innerHTML;
            btnClose.appendChild(svg);
        }
        else
            btnClose.textContent = 'Close';

        fullscreenContainer.appendChild(btnClose);
        btnClose.addEventListener('click', () => this.close());

        this.#imageWrapper = document.createElement('image-wrapper');
        fullscreenContainer.appendChild(this.#imageWrapper);

        const baseCSS = new CSSStyleSheet();
        baseCSS.replaceSync(`
            fullscreen-container {
                display: block;
                position: fixed;
                inset: 0;
                background-color: #000;
                z-index: 9999;
            }

            button {
                position: absolute;
                inset: 0 0 auto auto;
                border: none;
                background: transparent;
                font-size: 2rem;
                color: #fff;
                cursor: pointer;

                &:hover {
                    color: var(--clr-primary);
                }
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
        this.toggleAttribute('hidden', false);
    }

    close() {
        this.toggleAttribute('hidden', true);
        this.#onClose?.call(this);
        this.#onClose = null;
    }
}

customElements.define(fullscreenImageTag, FullscreenImageElement);

/** @type {FullscreenImageElement} */
const fullscreenImage = document.createElement(fullscreenImageTag);
document.querySelector('body')?.appendChild(fullscreenImage);