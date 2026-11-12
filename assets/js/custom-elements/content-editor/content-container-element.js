export default class ContentContainerElement extends HTMLElement {
    constructor() { super(); }

    connectedCallback() {
        this.setAttribute('tabindex', '0');
    }

    disconnectedCallback() {}
}

customElements.define('content-container', ContentContainerElement);