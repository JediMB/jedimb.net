customElements.define('image-gallery-component', class ImageGalleryComponent extends HTMLElement {
    /** @type {ImageGalleryComponent} */
    #self;

    #imageManager;
    #galleryManager;

    #imageUploadButton;
    #cancelUploadButton;

    #galleryCreateButton;
    #galleryCancelButton;
    
    constructor() {
        const component = super();
        this.#self = component;
    }

    connectedCallback() {
        const self = this.#self;

        this.#imageManager = self.querySelector('image-manager-component');
        this.#galleryManager = self.querySelector('gallery-manager-component');

        if (!this.#imageManager || !this.#galleryManager)
            throw new Error(`Image Manager (${!!this.#imageManager}) or Gallery Manager (${!!this.#galleryManager}) not found in Image Gallery`);

        const finishEvent = self.getAttribute('finish-event');
        if (finishEvent) {
            this.#imageManager.setAttribute('finish-event', finishEvent);
            this.#galleryManager.setAttribute('finish-event', finishEvent);
        }

        this.#imageUploadButton = self.querySelector('[btn-image-upload');
        this.#cancelUploadButton = self.querySelector('[btn-cancel-upload]');

        this.#galleryCreateButton = self.querySelector('[btn-gallery-create]');
        this.#galleryCancelButton = self.querySelector('[btn-cancel-create]');

        this.#imageUploadButton.addEventListener('click', () => {
            this.#imageManager.setAttribute('upload-mode', 'active');
        });
        this.#cancelUploadButton.addEventListener('click', () => {
            this.#imageManager.setAttribute('upload-mode', 'done');
        });

        this.#galleryCreateButton.addEventListener('click', () => {
            this.#galleryManager.setAttribute('properties-mode', 'active');
        });
        this.#galleryCancelButton.addEventListener('click', () => {
            this.#galleryManager.setAttribute('properties-mode', 'done');
        });

        const tabContainers = self.querySelectorAll('[data-tab]');
        const managerTabs = self.querySelector('manager-tabs');

        const btnImages = managerTabs.querySelector('.tab-images');
        const btnGalleries = managerTabs.querySelector('.tab-galleries');

        btnImages.addEventListener('click', () => {
            this.#toggleTab(btnGalleries, false);
            this.#toggleTab(btnImages, true);
        });

        btnGalleries.addEventListener('click', () => {
            this.#toggleTab(btnImages, false);
            this.#toggleTab(btnGalleries, true);
        });

        new MutationObserver((mutationList, _) =>
            this.#attributeObservation(mutationList, 'upload-mode', this.#imageUploadButton, this.#cancelUploadButton)
        ).observe(this.#imageManager, { attributeFilter: [ 'upload-mode' ] });

        new MutationObserver((mutationList, _) =>
            this.#attributeObservation(mutationList, 'properties-mode', this.#galleryCreateButton, this.#galleryCancelButton)
        ).observe(this.#galleryManager, { attributeFilter: [ 'properties-mode' ] });

        this.#imageUploadButton.disabled = false;
        this.#galleryCreateButton.disabled = false;
    }

    /**
     * @param {MutationRecord[]} mutationList
     * @param {string} attributeName 
     * @param {HTMLButtonElement} btnActivate
     * @param {HTMLButtonElement} btnDeactivate 
     * */
    #attributeObservation(mutationList, attributeName, btnActivate, btnDeactivate) {
        for (const mutation of mutationList) {
            if (mutation.type !== 'attributes')
                continue;

            if (mutation.attributeName !== attributeName)
                continue;

            switch (mutation.target.getAttribute(attributeName)) {
                case 'active':
                    btnActivate.toggleAttribute('hidden', true);
                    btnDeactivate.removeAttribute('hidden');
                    break;

                default:
                    btnActivate.removeAttribute('hidden');
                    btnDeactivate.toggleAttribute('hidden', true);
                    break;
            }
        }
    }

    /**
     * @param {HTMLButtonElement} button
     * @param {HTMLElement} pane 
     * @param {boolean} activate 
     */
    #toggleTab(button, activate) {
        button.classList.toggle('active', activate);
        button.ariaPressed = activate ? 'true' : 'false';

        const pane = button.ariaControlsElements.at(0);

        pane.toggleAttribute('hidden', !activate);
    }
});