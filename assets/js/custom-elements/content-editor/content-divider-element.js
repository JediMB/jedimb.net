import Emitter from "/js/utilities/emitter.js";

export default class ContentDividerElement extends HTMLElement {
    /** @type {ShadowRoot} */ #shadowRoot;

    #middle;

    constructor() {
        super();
        this.#middle = document.createElement('span');
        this.#middle.append(document.createElement('hr'));
    }

    connectedCallback() {
        if (this.#shadowRoot)
            return;

        this.#shadowRoot = this.attachShadow({ mode: 'closed' });

        const container = document.createElement('div');

        const first = document.createElement('span');
        first.append(document.createElement('hr'));

        const last = document.createElement('span');
        last.append(document.createElement('hr'));

        container.append(first, this.#middle, last);
        this.#shadowRoot.append(container);
        
        const css = new CSSStyleSheet();
        css.replaceSync(`
            :host {
                -webkit-user-select: none;
                -ms-user-select: none;
                user-select: none;
            }

            div {
                display: block flex;
                flex-direction: row;
                gap: 1em;
                margin-inline: 1em;

                & > :has(hr) {
                    flex-grow: 1;
                }
            }

            hr {
                border-width: var(--size-xs);
                border-radius: var(--size-xxs);
                border-style: double;
                border-color: var(--clr-primary-dark) var(--clr-primary-dark) var(--clr-primary);
            }
        `);
        this.#shadowRoot.adoptedStyleSheets.push(css);
    }

    disconnectedCallback() {}

    /** @param {string} text  */
    setText(text) {
        if (text?.length) {
            this.#middle.textContent = text;
            return;
        }

        this.#middle.replaceChildren(document.createElement('hr'));
    }
}

customElements.define('content-divider', ContentDividerElement);