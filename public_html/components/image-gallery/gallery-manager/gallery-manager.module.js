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
    #deleteGalleryButton;
    #saveGalleryButton;

    /** @type {HTMLLIElement} */
    #dragItem;
    /** @type {HTMLElement} */
    #dragTarget;
    #append = false;

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
            
            const galleryId = Number(event.target.dataset.galleryId);
            this.#renderGalleryImageLists(galleryId);
        });
        
        this.#galleryListFieldset.disabled = false;
    }

    disconnectedCallback() {}

    connectedMoveCallback() {}

    /** @param {HTMLUListElement} list */
    #dropItem(list) {
        this.#dragTarget?.style.removeProperty(this.#append ? 'border-bottom' : 'border-top');

        if (this.#dragItem === this.#dragTarget)
            return;

        if (!this.#append && this.#dragItem === this.#dragTarget?.previousElementSibling)
            return;

        if (this.#append || !this.#dragTarget) {
            list.appendChild(this.#dragItem);
        }
        else {
            list.insertBefore(this.#dragItem, this.#dragTarget);
        }

        this.#saveGalleryButton.disabled = false;
    }

    /** @param {number} galleryId */
    #renderGalleryImageLists(galleryId) {
        this.#includedImagesFieldset.disabled = true;
        this.#excludedImagesFieldset.disabled = true;
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

                    if (this.#dragItem.className !== 'manager-list-item')
                        return;

                    /** @type {HTMLElement} */
                    let target = event.originalTarget;
                    let append = false;

                    switch (target.localName) {
                        case 'images-included':
                        case 'images-excluded':
                            target = container.querySelector('ul').lastElementChild;
                            append = true;
                            break;

                        case 'label':
                            target = target.parentElement;
                            break;

                        default:
                            target = container.querySelector('ul').firstElementChild;
                            break;
                    }

                    this.#dragTarget?.style.removeProperty(this.#append ? 'border-bottom' : 'border-top');

                    this.#dragTarget = target;
                    this.#append = append;

                    if (target === this.#dragItem)
                        return;

                    if (!append && target?.previousElementSibling === this.#dragItem)
                        return;

                    this.#dragTarget?.style.setProperty(this.#append ? 'border-bottom' : 'border-top', '1px solid');
                });

                container.addEventListener('dragover', event => event.preventDefault());

                container.addEventListener('dragleave', event => {
                    if (container.contains(event.relatedTarget))
                        return;

                    this.#dragTarget?.style.removeProperty(this.#append ? 'border-bottom' : 'border-top');
                    this.#dragTarget = null;
                    this.#append = false;
                });

                container.addEventListener('drop', () => {
                    if (this.#dragItem?.className === 'manager-list-item')
                        this.#dropItem(container.querySelector('ul'));

                    this.#dragItem = null;
                    this.#dragTarget = null;
                    this.#append = false;
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
