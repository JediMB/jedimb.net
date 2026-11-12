import ContentToolbarElement from "./content-toolbar-element.js";

export default class ContentContainerElement extends HTMLElement {
    constructor() { super(); }

    connectedCallback() {
        this.setAttribute('tabindex', '0');
    }

    connectedMoveCallback() {}

    disconnectedCallback() {}
}

customElements.define('content-container', ContentContainerElement);