customElements.define('modal-popup-component', class ModalPopupContainer extends HTMLElement {
    /** @type ModalPopupContainer */
    #self;
    #popup;
    #popupContent;

    constructor() {
        const component = super();
        this.#self = component;
    }

    connectedCallback() {
        const self = this.#self;
        const root = document.querySelector('html');
        const body = document.querySelector('body');
        this.#popup = self.querySelector('modal-popup');
        this.#popupContent = this.#popup.querySelector('modal-popup-content');

        if (!self.style.display) {
            root.style.overflow = 'hidden';
            body.style.overflow = 'hidden';
        }

        const name = self.getAttribute('modal-name');

        if (name)
            document.querySelector(`[modal-target="${name}"]`)?.addEventListener('click', () => {
                self.style.removeProperty('display');
                root.style.overflow = 'hidden';
                body.style.overflow = 'hidden';
            });

        self.addEventListener('click', (event) => {
            event.stopPropagation();

            if (!this.#popup.contains(event.target)) {
                event.preventDefault();
                self.style.display = 'none';
                root.style.removeProperty('overflow');
                body.style.removeProperty('overflow');
            }
        });
    }
});