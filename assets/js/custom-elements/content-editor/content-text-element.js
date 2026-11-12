export default class ContentTextElement extends HTMLElement {
    constructor() { super(); }

    connectedCallback() {
        this.setAttribute('tabindex', '0');

        this.addEventListener('click', () => this.setAttribute('contenteditable', 'true'));
        this.addEventListener('blur', () => this.removeAttribute('contenteditable'));
    }

    disconnectedCallback() {}
}

customElements.define('content-text', ContentTextElement);