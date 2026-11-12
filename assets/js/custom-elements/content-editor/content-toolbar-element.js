import ContentContainerElement from "/js/custom-elements/content-editor/content-container-element.js";

export default class ContentToolbarElement extends HTMLElement {
    static CONTAINER_NAME = customElements.getName(ContentContainerElement);

    /** @type {ShadowRoot} */ #shadowRoot;
    /** @type {HTMLButtonElement} */ #btnContainer;
    /** @type {HTMLButtonElement} */ #btnText;
    /** @type {HTMLButtonElement} */ #btnDirection;

    #svgCount = 0;

    constructor() { super(); }

    connectedCallback() {
        if (this.#shadowRoot) {
            this.#updateVisibility();
            return;
        }

        this.#shadowRoot = this.attachShadow({ mode: 'closed'});
        
        this.#btnContainer = this.#attachNewSvgButton('Add content box', '#svg-add-box');
        this.#addClickEvent(this.#btnContainer, 'content-add');

        this.#btnText = this.#attachNewSvgButton('Add text', '#svg-text-snippet');
        this.#addClickEvent(this.#btnText, 'content-text');

        this.#btnDirection = this.#attachNewSvgButton('Toggle content flow direction',
            '#svg-content-columns', '#svg-content-rows'
        );
        this.#addClickEvent(this.#btnDirection, 'content-direction', () => {
            const [ newMode, detail ] = this.#btnDirection.dataset.mode === '2'
                ? [ 1, 'column' ]
                : [ 2, 'row' ];

            this.#btnDirection.dataset.mode = newMode;
            return detail;
        });

        const css = new CSSStyleSheet();
        const svgDisplay = `${Array(this.#svgCount).fill('').map((_, index) => `,
            &[data-mode="${index+1}"] svg:nth-of-type(${index+1})`).join('')}`;

        css.replaceSync(`
            [hidden] {
                display: none;
            }

            button {
                display: inline flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;

                & svg {
                    display: none;
                }
                &:not([data-mode]) svg:first-of-type${svgDisplay} {
                    display: initial;
                }
            }
        `);
        this.#shadowRoot.adoptedStyleSheets.push(css);
        this.#updateVisibility();
    }

    disconnectedCallback() {}

    /**
     * @param {HTMLButtonElement} button 
     * @param {string} eventName 
     * @param {() => any} [detail] Returns the value that goes into the detail property
     */
    #addClickEvent(button, eventName, detail = null) {
        button.addEventListener('click', () =>
            this.dispatchEvent(new CustomEvent(eventName, {
                bubbles: true,
                detail: detail?.call(this)
            }))
        );
    }

    /**
     * @param {string} title
     * @param {...string} symbolIds 
     * @returns {HTMLButtonElement}
     */
    #attachNewSvgButton(title, ...symbolIds) {
        const button = document.createElement('button');
        button.type = 'button';
        button.title = title;
        button.ariaLabel = title;

        let svgCount = 0;

        for (const symbolId of symbolIds) {
            /** @type {SVGSymbolElement} */
            const symbol = document.querySelector(
                symbolId[0] === '#' ? symbolId : `#${symbolId}`
            );

            if (symbol.localName !== 'symbol')
                continue;

            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('width', '2em');
            svg.setAttribute('height', '2em');

            for (const {localName, value} of symbol.attributes)
                localName !== 'id' && svg.setAttribute(localName, value);

            svg.innerHTML = symbol.innerHTML;

            button.appendChild(svg);
            svgCount++;
        }

        this.#svgCount = Math.max(this.#svgCount, svgCount);

        this.#shadowRoot.appendChild(button);
        return button;
    }

    #updateVisibility() {
        const inContainer = this.parentElement.localName === ContentToolbarElement.CONTAINER_NAME;

        this.#btnText.hidden = !inContainer;
        this.#btnDirection.hidden = !inContainer;
    }
}

customElements.define('content-toolbar', ContentToolbarElement);