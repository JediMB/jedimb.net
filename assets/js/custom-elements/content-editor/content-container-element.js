import ContentAddElement from "/js/custom-elements/content-editor/content-add-element.js";

export default class ContentContainerElement extends HTMLElement {
    constructor() { super(); }

    connectedCallback() {
        this.setAttribute('tabindex', '0');

        const contentAdd = document.createElement(customElements.getName(ContentAddElement));
        this.appendChild(contentAdd);
    }

    connectedMoveCallback() {}

    disconnectedCallback() {}
}

customElements.define('content-container', ContentContainerElement);