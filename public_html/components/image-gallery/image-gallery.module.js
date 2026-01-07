import formatDate from "/js/utilities/format-date.js";
import Image from "/js/models/image-gallery/image.model.js";
import ImageDTO from "/js/models/image-gallery/image.dto.model.js";
import imageGalleryService from "/js/services/image-gallery.service.js";

customElements.define('image-gallery-component', class ImageGalleryComponent extends HTMLElement {
    /** @type {ImageGalleryComponent} */
    #self;
    #service;
    #galleryPath;
    #insertTarget;

    #imageUploadButton;
    #cancelUploadButton;

    #imageManager;
    #filesFieldset;
    /** @type {HTMLUListElement} */
    #fileList;
    /** @type {HTMLTemplateElement} */
    #imageItemTemplate;
    #insertImageButton;
    #deleteButton;
    #imageProperties;
    #imagePropertiesContent;
    /** @type {HTMLTemplateElement} */
    #propertiesTemplate;
    #uploadTemplete;
    #resetButton;
    #saveButton;

    #galleryCreateButton;
    #galleryCancelButton;

    #galleryManager;
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

        this.#imageUploadButton = self.querySelector('[btn-image-upload');
        this.#cancelUploadButton = self.querySelector('[btn-cancel-upload]');

        this.#imageManager = self.querySelector('image-manager');
        const managerFiles = this.#imageManager.querySelector('manager-files');
        const listFieldset = managerFiles.querySelector('fieldset');
        this.#galleryPath = managerFiles.dataset.galleryPath;
        this.#filesFieldset = managerFiles.querySelector('fieldset');
        this.#fileList = managerFiles.querySelector('ul');
        this.#imageItemTemplate = managerFiles.querySelector('[item-template]');
        this.#insertImageButton = this.#imageManager.querySelector('[btn-insert]');
        this.#deleteButton = this.#imageManager.querySelector('[btn-delete]');
        const form = this.#imageManager.querySelector('form');
        this.#imageProperties = this.#imageManager.querySelector('image-properties');
        this.#imagePropertiesContent = this.#imageProperties.innerHTML;
        this.#propertiesTemplate = this.#imageManager.querySelector('[properties-template]');
        this.#uploadTemplete = this.#imageManager.querySelector('[upload-template]');
        this.#resetButton = this.#imageManager.querySelector('[btn-reset]');
        this.#saveButton = this.#imageManager.querySelector('[btn-save]');

        this.#galleryCreateButton = self.querySelector('[btn-gallery-create]');
        this.#galleryCancelButton = self.querySelector('[btn-cancel-create]');

        this.#galleryManager = self.querySelector('gallery-manager');
        const galleryList = this.#galleryManager.querySelector('gallery-list');
        this.#galleryListFieldset = galleryList.querySelector('fieldset');
        this.#insertGalleryButton = this.#galleryManager.querySelector('[btn-insert-gallery]');
        this.#editButton = this.#galleryManager.querySelector('[btn-edit]');
        const managerSelectedGallery = this.#galleryManager.querySelector('manager-selected-gallery');
        [this.#includedImagesFieldset, this.#excludedImagesFieldset] = managerSelectedGallery.querySelectorAll('fieldset');
        this.#galleryImageTemplate = managerSelectedGallery.querySelector('[gallery-image-template]');
        this.#removeButton = managerSelectedGallery.querySelector('[btn-remove]');
        this.#addButton = managerSelectedGallery.querySelector('[btn-add]');
        this.#deleteGalleryButton = managerSelectedGallery.querySelector('[btn-delete-gallery]');
        this.#saveGalleryButton = managerSelectedGallery.querySelector('[btn-save-gallery');

        this.#imageUploadButton.addEventListener('click', () => {
            this.#imageUploadButton.setAttribute('hidden', '');
            this.#cancelUploadButton.removeAttribute('hidden');
            listFieldset.disabled = true;

            this.#insertImageButton.disabled = true;
            this.#deleteButton.disabled = true;
            const checked = this.#fileList.querySelector(':checked');
            if (checked) checked.checked = false;

            this.#resetButton.disabled = true;
            this.#saveButton.disabled = true;
            this.#saveButton.textContent = this.#saveButton.dataset.contentUpload;
            this.#renderImageUpload();
        });

        this.#cancelUploadButton.addEventListener('click', () => {
            this.#imageUploadButton.removeAttribute('hidden');
            this.#cancelUploadButton.setAttribute('hidden', '');
            listFieldset.disabled = false;
            this.#saveButton.textContent = this.#saveButton.dataset.contentEdit;
            this.#imageProperties.innerHTML = this.#imagePropertiesContent;
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

        if (this.#insertTarget) {
            this.#insertImageButton.removeAttribute('hidden');
            this.#insertGalleryButton.removeAttribute('hidden');
        }

        this.#insertImageButton.addEventListener('click', event => this.#insertImage(event));

        this.#deleteButton.addEventListener('click', event => this.#deleteImage(event));

        managerFiles.addEventListener('change', event => {
            if (!event.target.checked)
                return;

            event.stopPropagation();

            this.#insertImageButton.disabled = false;
            this.#deleteButton.disabled = false;

            this.#renderImageProperties(event.target.dataset);
        });

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

        form.addEventListener('submit', event => this.#saveImage(event));
        form.addEventListener('reset', () => {
            this.#resetButton.disabled = true;
            this.#saveButton.disabled = true;

            this.#imageProperties.querySelector('[img-upload]')?.remove();
        });

        this.#service.images.subscribe(
            images => this.#renderImageList(images), true,
            (_, image) => this.#updateImageListItem(image)
        );

        this.#filesFieldset.disabled = false;
        this.#galleryListFieldset.disabled = false;
        this.#imageUploadButton.disabled = false;
        this.#galleryCreateButton.disabled = false;
    }

    async #deleteImage(event) {
        event.stopPropagation();
        this.#deleteButton.disabled = true;
        this.#insertImageButton.disabled = true;
        this.#filesFieldset.disabled = true;

        const checked = this.#fileList.querySelector(':checked');

        if (!checked)
            throw new Error('Delete button clicked with no file selected');

        const id = Number(checked.dataset.imageId);

        if (id < 1)
            throw new Error('Invalid image id');

        if (await this.#service.deleteImage(id)) {
            this.#deleteButton.disabled = false;
            this.#insertImageButton.disabled = false;
            this.#filesFieldset.disabled = false;
        }
    }

    async #insertImage(event) {
        event.stopPropagation();

        const checked = this.#fileList.querySelector(':checked');

        if (!checked)
            throw new Error('Insert button clicked with no file selected');

        if (!this.#insertTarget)
            throw new Error('No place to insert image registered');

        const image = this.#service.getImage(Number(checked.dataset.imageId));

        if (!image)
            throw new Error('Image not found');

        const self = this.#self;
        const finishEvent = self.getAttribute('finish-event');
        this.#insertTarget.dataset.imageInsert = JSON.stringify(image);
        if (finishEvent) {
            const event = new CustomEvent(finishEvent, { bubbles: true });
            self.dispatchEvent(event);
        }
    }

    /** @param {Image[]} images  */
    #renderImageList(images) {
        const localDate = new Date(this.#imageManager.dataset.modifiedOn);

        if (this.#service.imageModified <= localDate)
            return;

        this.#fileList.textContent = ''; // TODO: Loading spinner animation
        this.#imageProperties.innerHTML = this.#imagePropertiesContent;
        this.#insertImageButton.disabled = true;
        this.#deleteButton.disabled = true;
        this.#resetButton.disabled = true;
        this.#saveButton.disabled = true;

        images.forEach(image => {
            const template = this.#imageItemTemplate.content.cloneNode(true);

            const imageUrl = this.#galleryPath + image.filename;

            template.querySelector('label').title = image.title;

            /** @type {HTMLInputElement} */
            const input = template.querySelector('input');
            input.insertAdjacentText('afterend', image.title);

            /** @type {DOMStringMap} */
            const data = input.dataset;
            data.imageId = image.id;
            data.imageFilename = image.filename;
            data.imageUrl = imageUrl;
            data.imageTitle = image.title;
            data.imageDefaultTitle = image.title;
            data.imageDescription = image.description;
            data.imageDefaultDescription = image.description;
            data.imageCreatedOn = formatDate(image.createdOn);
            data.imageModifiedOn = formatDate(image.modifiedOn);

            /** @type {HTMLImageElement} */
            const img = template.querySelector('img');
            img.src = imageUrl;

            this.#fileList.appendChild(template);
        });

        this.#imageManager.dataset.modifiedOn = formatDate(this.#service.imageModified, true);
    }

    /** @param {Image} image  */
    #updateImageListItem(image) {
        /** @type {HTMLInputElement} */
        const input = this.#fileList.querySelector(`input[data-image-id="${image.id}"]`);

        if (!input)
            throw new Error(`Image list item with id ${image.id} can't be found`);
        
        if (input.nextSibling)
            input.nextSibling.textContent = image.title;
        else
            input.insertAdjacentText('afterend', image.title);

        /** @type {DOMStringMap} */
        const data = input.dataset;
        data.imageTitle = image.title;
        data.imageDefaultTitle = image.title;
        data.imageDescription = image.description;
        data.imageDefaultDescription = image.description;
        data.imageModifiedOn = formatDate(image.modifiedOn);

        this.#imageManager.dataset.modifiedOn = formatDate(this.#service.imageModified, true);

        this.#renderImageProperties(data);
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

    #renderImageProperties(data) {
        this.#imageProperties.textContent = ''; // TODO: Loading spinner animation
        this.#resetButton.disabled = true;
        this.#saveButton.disabled = true;

        const template = this.#propertiesTemplate.content.cloneNode(true);
        template.querySelector('[name="id"]').defaultValue = data.imageId;
        template.querySelector('.image-header').textContent = data.imageFilename;

        const name = template.querySelector('[name="title"]');
        name.defaultValue = data.imageDefaultTitle;
        name.value = data.imageTitle;
        name.addEventListener('input', () => {
            data.imageTitle = name.value;
            this.#setUndoSaveButtonStatus([name, description]);
        });

        const description = template.querySelector('[name="description"]');
        description.defaultValue = data.imageDefaultDescription;
        description.value = data.imageDescription;
        description.addEventListener('input', () => {
            data.imageDescription = description.value;
            this.#setUndoSaveButtonStatus([name, description]);
        });

        template.querySelector('.created-on').textContent = data.imageCreatedOn;
        const modifiedOn = template.querySelector('.modified-on')
        if (data.imageModifiedOn)
            modifiedOn.textContent = data.imageModifiedOn;
        else
            modifiedOn.parentElement.innerHTML = '&nbsp;';

        const img = document.createElement('img');
        img.src = data.imageUrl;
        img.alt = 'Image preview';
        template.querySelector('.image-preview').appendChild(img);
        
        this.#imageProperties.appendChild(template);
        this.#setUndoSaveButtonStatus([name, description]);
    }

    #renderImageUpload() {
        const template = this.#uploadTemplete.content.cloneNode(true);
        /** @type {HTMLDivElement} */
        const imagePreview = template.querySelector('.image-preview');
        /** @type {HTMLInputElement} */
        const fileInput = template.querySelector('[type="file"]');
        const titleInput = template.querySelector('[name="title"]');
        const descInput = template.querySelector('[name="description"]');

        const reader = new FileReader();
        reader.addEventListener('load', event => {
            const img = document.createElement('img');
            img.src = event.target.result;
            img.alt = 'Image preview';
            img.setAttribute('img-upload', '');
            const title = fileInput.files.item(0).name.replace(/(\.[a-zA-Z0-9]{1,4})$/, '');
            titleInput.value = title.charAt(0).toUpperCase() + title.slice(1);
            imagePreview.replaceChildren(img);
        });
        
        fileInput.addEventListener('change', event => {
            event.stopPropagation();
            
            if (!fileInput.files.length)
                return;

            const file = fileInput.files.item(0);
            reader.readAsDataURL(file);

            this.#resetButton.disabled = false;
            this.#setUndoSaveButtonStatus([fileInput, titleInput, descInput]);
        });

        titleInput.defaultValue = '';

        [titleInput, descInput].forEach(input => input.addEventListener('input', event => {
            event.stopPropagation();
            this.#setUndoSaveButtonStatus([fileInput, titleInput, descInput]);
        }));

        this.#imageProperties.textContent = '';
        this.#imageProperties.appendChild(template);
    }

    /** @param {Event} event */
    async #saveImage(event) {
        event.preventDefault();
        
        this.#saveButton.disabled = true;
        const formData = new FormData(event.target);
        const imageDTO = new ImageDTO(formData);

        if (formData.has('image')) {
            /** @type {File} */
            const file = formData.get('image');

            const fileReader = new FileReader();
            fileReader.addEventListener('load', async event => {
                const data = {
                    dto: imageDTO,
                    file: event.target.result.replace(/^data:\w*\/\w*;base64,/, '')
                };

                if (await this.#service.createImage(data)) {
                    this.#cancelUploadButton.setAttribute('hidden', '');
                    this.#imageUploadButton.removeAttribute('hidden');
                    this.#filesFieldset.disabled = false;
                }
            });
            fileReader.readAsDataURL(file);

            return;
        }
        
        if (await this.#service.updateImage(imageDTO)) {

        }
    }

    /**
     * @param {HTMLInputElement[]} fields 
     */
    #setUndoSaveButtonStatus(fields) {
        const noChanges = fields.every(field => field.value === field.defaultValue);
        this.#resetButton.disabled = noChanges;
        this.#saveButton.disabled = noChanges || !!fields.find(field => !field.checkValidity());
    }
});