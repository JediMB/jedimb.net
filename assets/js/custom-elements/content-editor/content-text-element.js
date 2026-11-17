export default class ContentTextElement extends HTMLElement {
    static PLACEHOLDER_TEXT = 'Click here to input text...';
    static PLACEHOLDER_FOCUS_TEXT = 'Start typing to input text...';

    /** @type {ShadowRoot} */ #shadowRoot;
    /** @type {HTMLDivElement} */ #content;

    constructor() { super(); }

    connectedCallback() {
        if (this.#shadowRoot)
            return;

        this.#shadowRoot = this.attachShadow({mode: 'closed'});

        const content = document.createElement('div');
        content.setAttribute('tabindex', '0');
        this.#content = content;
        this.#shadowRoot.append(content)

        content.dataset.placeholder = ContentTextElement.PLACEHOLDER_TEXT;
        content.dataset.placeholderFocused = ContentTextElement.PLACEHOLDER_FOCUS_TEXT;
        this.ariaLabel = ContentTextElement.PLACEHOLDER_FOCUS_TEXT;

        content.addEventListener('click', event => {
            event.stopPropagation();
            this.#activate();
        });

        content.addEventListener('keypress', event => {
            event.stopPropagation();
            this.#activate(true);
        })

        this.addEventListener('blur', event => {
            event.stopPropagation();
            this.#deactivate();
        });

        const css = new CSSStyleSheet();
        css.replaceSync(`
            :host > :empty {
                &::before {
                    content: attr(data-placeholder);
                    opacity: 0.5;
                }

                &:focus::before {
                    content: attr(data-placeholder-focused);
                }
            }
        `);
        this.#shadowRoot.adoptedStyleSheets.push(css);
    }

    disconnectedCallback() {}

    #activate(keyboardActivation = false) {
        const content = this.#content;

        const contenteditable = content.getAttribute('contenteditable');
        if (contenteditable === 'true' || contenteditable === '')
            return;

        content.setAttribute('contenteditable', 'true');
    }

    #deactivate() {
        const content = this.#content;

        if (!content.hasAttribute('contenteditable'))
            return;

        if (content.textContent.trim() === '') {
            this.remove();
            return;
        }

        content.removeAttribute('contenteditable');
    }
}

customElements.define('content-text', ContentTextElement);