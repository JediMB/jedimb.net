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
            this.setAttribute('contenteditable', 'true');
        });

        this.addEventListener('keypress', event => {
            event.stopPropagation();

            if (!this.hasAttribute('contenteditable'))
                this.setAttribute('contenteditable', 'true');
        })

        this.addEventListener('blur', event => {
            event.stopPropagation();

            if (!this.hasAttribute('contenteditable'))
                return;

            if (this.textContent.trim() !== '') {
                this.removeAttribute('contenteditable');
                return;
            }

            this.remove();
        });
    }

    disconnectedCallback() {}
}

customElements.define('content-text', ContentTextElement);