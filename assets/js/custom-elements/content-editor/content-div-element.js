import ContentAddElement from "/js/custom-elements/content-editor/content-add-element.js";

export default class ContentDivElement extends HTMLElement {
    constructor() { super(); }

    connectedCallback() {
        this.setAttribute('tabindex', '0');

        const contentAdd = document.createElement(customElements.getName(ContentAddElement));
        contentAdd.hidden = true;
        this.appendChild(contentAdd);

        this.addEventListener('mouseenter', () => {
            contentAdd.hidden = false;
        });
        this.addEventListener('mouseleave', () => {
            if (!this.contains(document.activeElement))
                contentAdd.hidden = true;
        });
        this.addEventListener('focusin', () => {
            contentAdd.hidden = false;
        });
        this.addEventListener('focusout', () => {
            contentAdd.hidden = true;
        });
    }

    connectedMoveCallback() {}

    disconnectedCallback() {}
}

customElements.define('content-div', ContentDivElement);