// TODO: change to content-changer?
export default class ContentAddElement extends HTMLElement {
    /** @type {ShadowRoot} */ #shadowRoot;
    #svgCount = 0;

    constructor() { super(); }

    connectedCallback() {
        this.#shadowRoot = this.attachShadow({ mode: 'closed'});
        
        const addButton = this.#attachNewSvgButton('Add content box', '#svg-add-box');
        this.#addClickEvent(addButton, 'content-add');

        const textButton = this.#attachNewSvgButton('Add text', '#svg-text-snippet');
        this.#addClickEvent(textButton, 'content-text');

        const directionButton = this.#attachNewSvgButton('Toggle content flow direction',
            '#svg-content-columns', '#svg-content-rows'
        );
        directionButton.addEventListener('click', () => {
            const [ newMode, detail ] = directionButton.dataset.mode === '2'
                ? [ 1, 'column' ]
                : [ 2, 'row' ];

            this.dispatchEvent(new CustomEvent('content-direction', {
                bubbles: true,
                detail: detail
            }));

            directionButton.dataset.mode = newMode;
        });

        const css = new CSSStyleSheet();
        const svgDisplay = `${Array(this.#svgCount).fill('').map((_, index) => `,
            &[data-mode="${index+1}"] svg:nth-of-type(${index+1})`).join('')}`;

        css.replaceSync(`
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
    }

    connectedMoveCallback() {}

    disconnectedCallback() {}

    /**
     * @param {HTMLButtonElement} button 
     * @param {string} eventName 
     * @param {any} [detail] 
     */
    #addClickEvent(button, eventName, detail = null) {
        button.addEventListener('click', () =>
            this.dispatchEvent(new CustomEvent(eventName, {
                bubbles: true,
                detail: detail
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
}

customElements.define('content-add', ContentAddElement);