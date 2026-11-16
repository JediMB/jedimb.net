export default class ContentDividerElement extends HTMLElement {
    /** @type {ShadowRoot} */ #shadowRoot;
    /** @type {HTMLSpanElement} */ #middle;

    constructor() { super(); }

    connectedCallback() {
        if (this.#shadowRoot)
            return;

        this.#shadowRoot = this.attachShadow({ mode: 'closed' });

        const container = document.createElement('div');

        const first = document.createElement('span');
        first.append(document.createElement('hr'));
        this.#middle = document.createElement('span');
        this.#middle.append(document.createElement('hr'));
        const last = document.createElement('span');
        last.append(document.createElement('hr'));

        container.append(first, this.#middle, last);
        this.#shadowRoot.append(container);

        const css = new CSSStyleSheet();
        css.replaceSync(`
            div {
                display: block flex;
                flex-direction: row;
                gap: 1em;
                margin-inline: 1em;

                & > * {
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

    setText(text) {
        // TODO: Replace the contents of #middle with text or an HR element, depending on text falsiness
    }
}

customElements.define('content-divider', ContentDividerElement);