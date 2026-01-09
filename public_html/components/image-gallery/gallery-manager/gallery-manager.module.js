import imageGalleryService from "/js/services/image-gallery.service.js";

customElements.define('gallery-manager-component', class GalleryManagerComponent extends HTMLElement {
    /** @type {GalleryManagerComponent} */
    #self;
    #service;
    #insertTarget;

    #galleryListFieldset;
    #insertGalleryButton;
    #editButton;
    #includedImagesFieldset;
    #excludedImagesFieldset;
    #galleryImageTemplate;
    #removeButton;
    #addButton;
    #deleteGalleryButton;
    #saveGalleryButton;

    constructor() {
        const component = super();
        this.#self = component;
        this.#service = imageGalleryService;
    }

    connectedCallback() {
        const self = this.#self;

        if (self.hasAttribute('insert-target'))
            this.#insertTarget = document.querySelector(`#${self.getAttribute('insert-target')}`);

        const galleryList = self.querySelector('gallery-list');
        this.#galleryListFieldset = galleryList.querySelector('fieldset');
        this.#insertGalleryButton = self.querySelector('[btn-insert-gallery]');
        this.#editButton = self.querySelector('[btn-edit]');
        const managerSelectedGallery = self.querySelector('manager-selected-gallery');
        [this.#includedImagesFieldset, this.#excludedImagesFieldset] = managerSelectedGallery.querySelectorAll('fieldset');
        this.#galleryImageTemplate = managerSelectedGallery.querySelector('[gallery-image-template]');
        this.#removeButton = managerSelectedGallery.querySelector('[btn-remove]');
        this.#addButton = managerSelectedGallery.querySelector('[btn-add]');
        this.#deleteGalleryButton = managerSelectedGallery.querySelector('[btn-delete-gallery]');
        this.#saveGalleryButton = managerSelectedGallery.querySelector('[btn-save-gallery');

        if (this.#insertTarget)
            this.#insertGalleryButton.removeAttribute('hidden');

        galleryList.addEventListener('change', event => {
            if (!event.target.checked)
                return;

            event.stopPropagation();

            this.#insertGalleryButton.disabled = false;
            this.#editButton.disabled = false;
            this.#addButton.disabled = true;
            this.#removeButton.disabled = true;
            
            const galleryId = Number(event.target.dataset.galleryId);

            // TODO: Fix empty lists behavior of the service has not yet received its image/gallery data
            this.#renderGalleryImageLists(galleryId);
        });

        this.#includedImagesFieldset.addEventListener('change', event => {
            if (!event.target.checked)
                return;

            this.#addButton.disabled = true;
            this.#removeButton.disabled = false;
        });

        this.#excludedImagesFieldset.addEventListener('change', event => {
            if (!event.target.checked)
                return;

            this.#removeButton.disabled = true;
            this.#addButton.disabled = false;
        });

        this.#removeButton.addEventListener('click', () => {
            this.#removeButton.disabled = true;

            const listItem = this.#includedImagesFieldset.querySelector('li:has(:checked)');

            if (!listItem) {
                console.error('Image list item not found');
                return;
            }

            this.#excludedImagesFieldset.firstChild.appendChild(listItem);
            this.#addButton.disabled = false;
            this.#saveGalleryButton.disabled = false;
        });

        this.#addButton.addEventListener('click', () => {
            this.#addButton.disabled = true;

            const listItem = this.#excludedImagesFieldset.querySelector('li:has(:checked)');

            if (!listItem) {
                console.error('Image list item not found');
                return;
            }

            this.#includedImagesFieldset.firstChild.appendChild(listItem);
            this.#removeButton.disabled = false;
            this.#saveGalleryButton.disabled = false;
        });
        
        this.#galleryListFieldset.disabled = false;
    }

    disconnectedCallback() {}

    connectedMoveCallback() {}

    /** @param {number} galleryId */
    #renderGalleryImageLists(galleryId) {
        this.#includedImagesFieldset.disabled = true;
        this.#excludedImagesFieldset.disabled = true;
        this.#addButton.disabled = true;
        this.#removeButton.disabled = true;
        this.#deleteGalleryButton.setAttribute('hidden', '');
        this.#saveGalleryButton.disabled = true;

        this.#service.getImages(images => {
            const template = this.#galleryImageTemplate.content.cloneNode(true);

            const includedImageList = document.createElement('ul');
            const excludedImageList = document.createElement('ul');
            for (const image of images) {
                const listItem = template.cloneNode(true);

                const label = listItem.querySelector('label');
                label.title = image.title;
                
                const text = document.createTextNode(image.title);
                label.appendChild(text);

                /** @type HTMLInputElement */
                const input = label.querySelector('input');
                input.dataset.imageId = image.id;
                input.name = 'gallery-images';

                if (image.galleryIds.some(id => id === galleryId)) {
                    includedImageList.appendChild(listItem);
                    continue;
                }

                excludedImageList.appendChild(listItem);
            }
            
            this.#includedImagesFieldset.replaceChildren(includedImageList);
            this.#excludedImagesFieldset.replaceChildren(excludedImageList);
            this.#includedImagesFieldset.disabled = false;
            this.#excludedImagesFieldset.disabled = false;
        });
    }
});
