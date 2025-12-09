import formatDate from "/js/utilities/format-date.js";
import Image from "/js/models/image-gallery/image.model.js";
import ImageDTO from "/js/models/image-gallery/image.dto.model.js";
import imageManagerService from "/js/services/image-manager.service.js";

customElements.define('image-manager-component', class ImageManagerComponent extends HTMLElement {
    /** @type {ImageManagerComponent} */
    #self;
    #service;
    #galleryPath;

    #imageManager;
    /** @type {HTMLUListElement} */
    #fileList;
    /** @type {HTMLTemplateElement} */
    #imageItemTemplate;
    #insertButton;
    #deleteButton;
    #imageProperties;
    #imagePropertiesContent;
    /** @type {HTMLTemplateElement} */
    #propertiesTemplate;
    #resetButton;
    #saveButton;
    
    constructor() {
        const component = super();
        this.#self = component;
        this.#service = imageManagerService;
    }

    connectedCallback() {
        const self = this.#self;

        this.#imageManager = self.querySelector('image-manager');
        const managerFiles = this.#imageManager.querySelector('manager-files');
        this.#galleryPath = managerFiles.dataset.galleryPath;
        this.#fileList = managerFiles.querySelector('ul');
        this.#imageItemTemplate = managerFiles.querySelector('template');
        this.#insertButton = this.#imageManager.querySelector('[btn-insert]');
        this.#deleteButton = this.#imageManager.querySelector('[btn-delete]');
        const form = this.#imageManager.querySelector('form');
        this.#imageProperties = this.#imageManager.querySelector('image-properties');
        this.#imagePropertiesContent = this.#imageProperties.innerHTML;
        this.#propertiesTemplate = this.#imageManager.querySelector('manager-properties + template');
        this.#resetButton = this.#imageManager.querySelector('[btn-reset]');
        this.#saveButton = this.#imageManager.querySelector('[btn-save]');

        managerFiles.addEventListener('change', event => {
            if (!event.target.checked)
                return;

            event.stopPropagation();

            this.#insertButton.disabled = false;
            this.#deleteButton.disabled = false;

            this.#renderImageProperties(event.target.dataset);
        });

        form.addEventListener('submit', event => this.#save(event));
        form.addEventListener('reset', () => {
            this.#resetButton.disabled = true;
            this.#saveButton.disabled = true;
        })

        imageManagerService.images.subscribe(
            images => this.#renderImageList(images), true,
            (_, image) => this.#updateImageListItem(image)
        );

        //fileList.querySelector('[type="radio"]')?.click();
    }

    /** @param {Image[]} images  */
    #renderImageList(images) {
        const localDate = new Date(this.#imageManager.dataset.modifiedOn);

        if (this.#service.imageModified <= localDate)
            return;

        this.#fileList.textContent = ''; // TODO: Loading spinner animation
        this.#imageProperties.innerHTML = this.#imagePropertiesContent;
        this.#insertButton.disabled = true;
        this.#deleteButton.disabled = true;
        this.#resetButton.disabled = true;
        this.#saveButton.disabled = true;

        images.forEach(image => {
            const template = this.#imageItemTemplate.content.cloneNode(true);

            const imageUrl = this.#galleryPath + image.filename;

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

        this.#renderImageProperties(data);
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

    /** @param {Event} event */
    async #save(event) {
        event.preventDefault();
        
        const form = event.target;
        const imageDTO = new ImageDTO(new FormData(form));
        
        const imagesModifiedOn = await this.#service.updateImage(imageDTO);

        this.#imageManager.dataset.modifiedOn = formatDate(imagesModifiedOn, true);
    }

    /**
     * @param {HTMLInputElement[]} fields 
     */
    #setUndoSaveButtonStatus(fields) {
        this.#resetButton.disabled = this.#saveButton.disabled = fields.every(field => field.value === field.defaultValue);
    }
});