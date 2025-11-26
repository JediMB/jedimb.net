customElements.define('modal-popup-component', class ModalPopupContainer extends HTMLElement {
    /** @type ModalPopupContainer */
    #self;

    constructor() {
        const component = super();
        this.#self = component;
    }

    connectedCallback() {
        const self = this.#self;
        const popup = self.querySelector('modal-popup');

        self.addEventListener('click', (event) => {
            event.stopPropagation();

            if (!popup.contains(event.target)) {
                event.preventDefault();
                self.style.display = 'none';
            }
        });
    }
});