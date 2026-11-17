export default class ContentTextElement extends HTMLElement {
    static PLACEHOLDER_TEXT = 'Click here to input text...';
    static PLACEHOLDER_FOCUS_TEXT = 'Start typing to input text...';

    constructor() { super(); }

    connectedCallback() {
        this.setAttribute('tabindex', '0');
        this.dataset.placeholder = ContentTextElement.PLACEHOLDER_TEXT;
        this.dataset.placeholderFocused = ContentTextElement.PLACEHOLDER_FOCUS_TEXT;
        this.ariaLabel = ContentTextElement.PLACEHOLDER_FOCUS_TEXT;

        this.addEventListener('click', event => {
            event.stopPropagation();
            this.#activate();
        });

        this.addEventListener('keypress', event => {
            event.stopPropagation();
            this.#activate(true);
        })

        this.addEventListener('blur', event => {
            event.stopPropagation();
            this.#deactivate();
        });
    }

    disconnectedCallback() {}

    #activate(keyboardActivation = false) {
        const contenteditable = this.getAttribute('contenteditable');
        if (contenteditable === 'true' || contenteditable === '')
            return;

        this.setAttribute('contenteditable', 'true');
    }

    #deactivate() {
        if (!this.hasAttribute('contenteditable'))
            return;

        if (this.textContent.trim() === '') {
            this.remove();
            return;
        }

        this.removeAttribute('contenteditable');
    }
}

customElements.define('content-text', ContentTextElement);