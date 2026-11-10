import ContentDivElement from "/js/custom-elements/content-editor/content-div-element.js";

export default class ContentEditorComponent extends HTMLElement {
    constructor() { super(); }

    connectedCallback() {
        if (!this.childElementCount)
            this.appendChild(document.createElement(customElements.getName(ContentDivElement)));

        this.addEventListener('addcontent', event => {
            event.stopPropagation();
            console.log(event);
        });
    }

    connectedMoveCallback() {}

    disconnectedCallback() {}
}

customElements.define('content-editor-component', ContentEditorComponent);
