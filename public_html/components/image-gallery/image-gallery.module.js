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

        this.#imageUploadButton = self.querySelector('[btn-image-upload');
        this.#cancelUploadButton = self.querySelector('[btn-cancel-upload]');

        this.#galleryCreateButton = self.querySelector('[btn-gallery-create]');
        this.#galleryCancelButton = self.querySelector('[btn-cancel-create]');

        this.#imageUploadButton.addEventListener('click', () => {
            this.#imageUploadButton.setAttribute('hidden', '');
            this.#cancelUploadButton.removeAttribute('hidden');
            this.#imageManager.setAttribute('upload-mode', 'active');
        });

        this.#imageManager.addEventListener('upload-complete', () => {
            this.#imageUploadButton.removeAttribute('hidden');
            this.#cancelUploadButton.setAttribute('hidden', '');
        });
        this.#cancelUploadButton.addEventListener('click', () => {
            this.#imageUploadButton.removeAttribute('hidden');
            this.#cancelUploadButton.setAttribute('hidden', '');
            this.#imageManager.setAttribute('upload-mode', 'done');
        });

        const tabContainers = self.querySelectorAll('[data-tab]');
        const managerTabs = self.querySelector('manager-tabs');
        managerTabs.addEventListener('change', event => {
            const tab = event.target.dataset.tabTarget;

            for (const element of tabContainers)
                element.toggleAttribute('hidden', element.dataset.tab !== tab);
        });

        const tab = managerTabs.querySelector(':checked').dataset.tabTarget;
        for (const element of tabContainers)
            element.toggleAttribute('hidden', element.dataset.tab !== tab);

        this.#imageUploadButton.disabled = false;
        this.#galleryCreateButton.disabled = false;
    }
});