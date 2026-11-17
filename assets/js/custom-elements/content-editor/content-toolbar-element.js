import ContentContainerElement from "/js/custom-elements/content-editor/content-container-element.js";

export default class ContentToolbarElement extends HTMLElement {
    static CONTAINER_NAME = customElements.getName(ContentContainerElement);

    /** @type {ShadowRoot} */ #shadowRoot;
    /** @type {HTMLButtonElement} */ #btnContainer;
    /** @type {HTMLButtonElement} */ #btnRemove;
    /** @type {HTMLButtonElement} */ #btnDirection;
    /** @type {HTMLButtonElement} */ #btnText;
    /** @type {HTMLButtonElement} */ #btnDivider;

    constructor() { super(); }

    connectedCallback() {
        if (this.#shadowRoot) {
            this.#updateVisibility();
            return;
        }

        this.#shadowRoot = this.attachShadow({ mode: 'closed'});
        
        this.#btnContainer = this.#attachNewSvgButton({title: 'Add content box', symbolId: '#svg-add-box'});
        this.#addClickEvent(this.#btnContainer, 'content-add');

        this.#btnText = this.#attachNewSvgButton({title: 'Add text', symbolId: '#svg-text-snippet'});
        this.#addClickEvent(this.#btnText, 'content-text');

        this.#btnDirection = this.#attachNewSvgButton(
            {title: 'Change content to side-by-side', symbolId: '#svg-content-columns'},
            {title: 'Change content to above-and-below', symbolId: '#svg-content-rows'}
        );
        this.#addClickEvent(this.#btnDirection, 'content-direction', () => {
            const wasActive = this.#btnDirection.dataset.direction === 'row';
            
            this.#btnDirection.classList.toggle('active', !wasActive);

            const newMode = wasActive ? 'column' : 'row';
            this.#btnDirection.dataset.direction = newMode;

            const newTitle = wasActive
                ? this.#btnDirection.dataset.titleInactive
                : this.#btnDirection.dataset.titleActive;
            this.#btnDirection.title = newTitle;
            this.#btnDirection.ariaLabel = newTitle;

            return newMode;
        });

        this.#btnRemove = this.#attachNewSvgButton({title: 'Remove content box', symbolId: '#svg-delete'});
        this.#addClickEvent(this.#btnRemove, 'content-remove');

        this.#btnDivider = this.#attachNewSvgButton({title: 'Content divider', symbolId: '#svg-page-break'});
        this.#addClickEvent(this.#btnDivider, 'content-divide');

        const css = new CSSStyleSheet();

        css.replaceSync(`
            :host {
                display: block flex;
                width: fit-content;
                height: fit-content;
                padding: var(--size-s);
                gap: var(--size-xs);
            }

            [hidden] {
                display: none;
            }

            button {
                display: inline flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
                cursor: pointer;

                &.active .inactive-content,
                &:not(.active) .active-content {
                    display: none;
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
     * @param {{title: string, symbolId: string}} defaultState
     * @param {{title: string, symbolId: string}} activeState
     * @returns {HTMLButtonElement}
     */
    #attachNewSvgButton(defaultState, activeState = null) {
        const button = document.createElement('button');
        button.type = 'button';
        button.title = defaultState.title;
        button.ariaLabel = defaultState.title;

        const defaultSvg = this.#symbolToSvg(defaultState.symbolId)
        const svgs = [ defaultSvg ];

        if (activeState?.title && activeState?.symbolId) {
            const activeSvg = this.#symbolToSvg(activeState.symbolId);

            if (activeSvg) {
                svgs.push(activeSvg);
                defaultSvg.classList.add('inactive-content');
                activeSvg.classList.add('active-content');
            }

            button.dataset.titleActive = activeState.title;
            button.dataset.titleInactive = defaultState.title;
        }

        button.append(...svgs);
        this.#shadowRoot.append(button);
        return button;
    }

    /**
     * @param {string} symbolId 
     * @returns {SVGSVGElement|null}
     */
    #symbolToSvg(symbolId) {
        /** @type {SVGSymbolElement} */
        const symbol = document.querySelector(
            symbolId[0] === '#' ? symbolId : `#${symbolId}`
        );

        if (symbol.localName !== 'symbol')
            return null;

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '2em');
        svg.setAttribute('height', '2em');

        for (const {localName, value} of symbol.attributes)
            localName !== 'id' && svg.setAttribute(localName, value);

        svg.innerHTML = symbol.innerHTML;

        return svg;
    }

    #updateVisibility() {
        const inContainer = this.parentElement.localName === ContentToolbarElement.CONTAINER_NAME;

        this.#btnDirection.hidden = !inContainer;
        this.#btnRemove.hidden = !inContainer;
        this.#btnDivider.hidden = inContainer;
    }
}

customElements.define('content-toolbar', ContentToolbarElement);