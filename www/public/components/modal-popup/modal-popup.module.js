customElements.define('modal-popup-component', class ModalPopupContainer extends HTMLElement {
    /** @type ModalPopupContainer */
    #self;
    #popup;
    #root;
    #body;

    constructor() {
        const component = super();
        this.#self = component;
    }

    connectedCallback() {
        // TODO: Implement some kind of focus trap

        const self = this.#self;
        this.#root = document.querySelector('html');
        this.#body = document.querySelector('body');
        this.#popup = self.querySelector('modal-popup');

        
        if (!self.hasAttribute('hidden')) {
            this.#root.style.overflow = 'hidden';
            this.#body.style.overflow = 'hidden';
        }
        
        if (self.id)
            document.querySelector(`[modal-target="${self.id}"]`)?.addEventListener('click', () => {
                self.removeAttribute('hidden');
                this.#root.style.overflow = 'hidden';
                this.#body.style.overflow = 'hidden';
            });

        self.addEventListener('click', event => {
            event.stopPropagation();

            if (!this.#popup.contains(event.target))
                this.#close(event);
        });

        self.addEventListener('closemodal', event => {
            event.stopPropagation();
            this.#close(event);
        });
    }

    #close(event) {
        event.preventDefault();
        this.#self.toggleAttribute('hidden', true);
        this.#root.style.removeProperty('overflow');
        this.#body.style.removeProperty('overflow');
    }
});