import ContentDivElement from "/js/custom-elements/content-editor/content-div-element.js";

export default class ContentEditorComponent extends HTMLElement {
    constructor() { super(); }

    connectedCallback() {
        if (!this.childElementCount)
            this.appendChild(document.createElement(customElements.getName(ContentDivElement)));

        console.log(this);

        this.addEventListener('content-add', event => {
            event.stopPropagation();
            const contentDiv = document.createElement(customElements.getName(ContentDivElement));
            
            /** @type {HTMLElement} */
            const contentAdd = event.target;
            contentAdd.insertAdjacentElement('beforebegin', contentDiv);
        });

        this.addEventListener('content-text', event => {
            event.stopPropagation();
            const contentText = document.createElement('content-text');
            contentText.textContent = 'This is a text element';

            /** @type {HTMLElement} */
            const contentAdd = event.target;
            contentAdd.insertAdjacentElement('beforebegin', contentText);
            
        });

        this.addEventListener('content-direction', event => {
            event.stopPropagation();

            event.target.parentElement.setAttribute('content-direction', event.detail);
        });
    }

    connectedMoveCallback() {}

    disconnectedCallback() {}
}

customElements.define('content-editor-component', ContentEditorComponent);
