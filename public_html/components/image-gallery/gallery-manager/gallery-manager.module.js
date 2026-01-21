import imageGalleryService from "/js/services/image-gallery.service.js";

customElements.define('gallery-manager-component', class GalleryManagerComponent extends HTMLElement {
    static observedAttributes = [ 'create-mode' ];

    /** @type {GalleryManagerComponent} */
    #self;
    #service;
    #insertTarget;

    #galleryListFieldset;
    #insertGalleryButton;
    #editButton;

    #managerSelectedGallery;
    /** @type {HTMLElement} */
    #includedImagesContainer;
    /** @type {HTMLElement} */
    #excludedImagesContainer;
    #includedImagesFieldset;
    #excludedImagesFieldset;
    #galleryImageTemplate;
    #deleteGalleryButton;
    #saveGalleryButton;

    #managerCreateGallery;

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

    /**
     * 
     * @param {string} name 
     * @param {string} _ 
     * @param {string} newValue 
     * @returns 
     */
    attributeChangedCallback(name, _, newValue) {
        if (name !== 'create-mode')
            return;

        if (!this.#self.hasAttribute(name))
            return;

        switch (newValue) {
            case 'active':
                this.#galleryListFieldset.disabled = true;

                this.#insertGalleryButton.disabled = true;
                this.#editButton.disabled = true;
                const checked = this.#galleryListFieldset.querySelector(':checked');
                if (checked) checked.checked = false;

                this.#managerSelectedGallery.toggleAttribute('hidden', true);
                this.#managerCreateGallery.removeAttribute('hidden');
                break;
            
            case 'done':
                const event = new CustomEvent('create-complete');
                this.dispatchEvent(event);

                this.#managerSelectedGallery.removeAttribute('hidden');
                this.#managerCreateGallery.toggleAttribute('hidden', true);
                
                this.#self.removeAttribute('create-mode');
                break;
        }
    }

    connectedCallback() {
        const self = this.#self;

        if (self.hasAttribute('insert-target'))
            this.#insertTarget = document.querySelector(`#${self.getAttribute('insert-target')}`);

        const galleryList = self.querySelector('gallery-list');
        this.#galleryListFieldset = galleryList.querySelector('fieldset');
        this.#insertGalleryButton = self.querySelector('[btn-insert-gallery]');
        this.#editButton = self.querySelector('[btn-edit]');
        this.#managerSelectedGallery = self.querySelector('manager-selected-gallery');
        this.#includedImagesContainer = this.#managerSelectedGallery.querySelector('images-included');
        this.#excludedImagesContainer = this.#managerSelectedGallery.querySelector('images-excluded');
        this.#includedImagesFieldset = this.#includedImagesContainer.querySelector('fieldset');
        this.#excludedImagesFieldset = this.#excludedImagesContainer.querySelector('fieldset');
        this.#galleryImageTemplate = this.#managerSelectedGallery.querySelector('[gallery-image-template]');
        this.#deleteGalleryButton = this.#managerSelectedGallery.querySelector('[btn-delete-gallery]');
        this.#saveGalleryButton = this.#managerSelectedGallery.querySelector('[btn-save-gallery');

        this.#managerCreateGallery = self.querySelector('manager-create-gallery');

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

        this.#deleteGalleryButton.addEventListener('click', () => this.#deleteGallery());
        this.#saveGalleryButton.addEventListener('click', () => this.#saveGalleryImages());
        
        this.#galleryListFieldset.disabled = false;
    }

    disconnectedCallback() {}

    connectedMoveCallback() {}

    async #createGallery() {

    }

    async #deleteGallery() {

    }

    async #saveGalleryImages() {
        this.#saveGalleryButton.disabled = true;
        this.#deleteGalleryButton.disabled = true;
        this.#galleryListFieldset.disabled = true;

        const galleryId = Number(this.#galleryListFieldset.querySelector(':checked').dataset.galleryId);

        const imageIds = Array.from(this.#includedImagesFieldset.querySelectorAll('input'))
            .map(input => Number(input.dataset.imageId));

        if (await this.#service.updateGalleryImages(galleryId, imageIds)) {
            this.#deleteGalleryButton.disabled = false;
            this.#galleryListFieldset.disabled = false;
        }
    }

    async #updateGallery() {

    }

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
                    this.#deleteGalleryButton.toggleAttribute('hidden', !!includedImageList.firstElementChild);
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
            this.#deleteGalleryButton.toggleAttribute('hidden', !!includedImageList.firstElementChild);
        });
    }
});
