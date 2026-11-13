export default class ModalPopupComponent extends HTMLElement {
    constructor() { super(); }

    connectedCallback() {
        document.documentElement.classList.add('disable-scrolling');
    }

    disconnectedCallback() {}
}

customElements.define('modal-popup-component', ModalPopupComponent);
