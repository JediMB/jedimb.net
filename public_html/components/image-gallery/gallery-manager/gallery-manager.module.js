import imageGalleryService from "/js/services/image-gallery.service.js";

customElements.define('gallery-manager-component', class GalleryManagerComponent extends HTMLElement {
    /** @type {GalleryManagerComponent} */
    #self;
    #service;
    #insertTarget;

    #galleryListFieldset;
    #insertGalleryButton;
    #editButton;
    /** @type {HTMLElement} */
    #includedImagesContainer;
    /** @type {HTMLElement} */
    #excludedImagesContainer;
    #includedImagesFieldset;
    #excludedImagesFieldset;
    #galleryImageTemplate;
    #removeButton;
    #addButton;
    #deleteGalleryButton;
    #saveGalleryButton;

    #dragItem;

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
        this.#includedImagesContainer = managerSelectedGallery.querySelector('images-included');
        this.#excludedImagesContainer = managerSelectedGallery.querySelector('images-excluded');
        this.#includedImagesFieldset = this.#includedImagesContainer.querySelector('fieldset');
        this.#excludedImagesFieldset = this.#excludedImagesContainer.querySelector('fieldset');
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

    /**  @param {HTMLLIElement} listItem */
    #addDragFunctionality(listItem) {

    }

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
            
            for (const list of [ includedImageList, excludedImageList ]) {
                list.addEventListener('dragstart', event => {
                    event.stopPropagation();
                    this.#dragItem = event.target;
                });
            }

            for (const container of [ this.#includedImagesContainer, this.#excludedImagesContainer ]) {
                container.addEventListener('dragenter', event => {
                    event.preventDefault();
                    
                    if (container.contains(this.#dragItem))
                        return;

                    container.style.border = '1px dashed green';
                });

                container.addEventListener('dragover', event => event.preventDefault());
 
                container.addEventListener('dragleave', event => {
                    if (container.contains(event.relatedTarget))
                        return;

                    container.style.removeProperty('border');
                });

                container.addEventListener('drop', event => {
                    container.style.removeProperty('border');

                    if (container === this.#includedImagesContainer)
                        includedImageList.appendChild(this.#dragItem);
                    else
                        excludedImageList.appendChild(this.#dragItem);

                    this.#dragItem = null;
                    this.#saveGalleryButton.disabled = false;
                });
            }

            for (const image of images) {
                /** @type {HTMLLIElement} */
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
