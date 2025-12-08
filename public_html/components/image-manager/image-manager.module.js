import formatDate from "/js/utilities/format-date.js";
import ImageDTO from "/js/models/image-gallery/image.dto.model.js";
import imageManagerService from "/js/services/image-manager.service.js";

customElements.define('image-manager-component', class ImageManagerComponent extends HTMLElement {
    /** @type {ImageManagerComponent} */
    #self;
    #service;

    #imageManager;

    #insertButton;
    #uploadButton;
    #properties;
    /** @type HTMLTemplateElement */
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
        const fileList = this.#imageManager.querySelector('manager-files');
        this.#insertButton = this.#imageManager.querySelector('[btn-insert]');
        const form = this.#imageManager.querySelector('form');
        this.#properties = this.#imageManager.querySelector('image-properties');
        this.#propertiesTemplate = this.#imageManager.querySelector('manager-properties + template');
        this.#resetButton = this.#imageManager.querySelector('[btn-reset]');
        this.#saveButton = this.#imageManager.querySelector('[btn-save]');

        fileList.addEventListener('change', event => {
            if (!event.target.checked)
                return;

            event.stopPropagation();

            this.#insertButton.disabled = false;

            this.#renderImageProperties(event.target.dataset);
        });

        form.addEventListener('submit', event => this.#save(event));
        form.addEventListener('reset', () => {
            this.#resetButton.disabled = true;
            this.#saveButton.disabled = true;
        })

        //fileList.querySelector('[type="radio"]')?.click();
    }

    #renderImageProperties(data) {
        this.#properties.textContent = '';
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
            modifiedOn.parentElement.remove();

        const img = document.createElement('img');
        img.src = data.imageUrl;
        img.alt = 'Image preview';
        template.querySelector('.image-preview').appendChild(img);
        
        this.#properties.appendChild(template);
        this.#setUndoSaveButtonStatus([name, description]);
    }

    /** @param {Event} event */
    async #save(event) {
        event.preventDefault();
        
        const form = event.target;
        const imageDTO = new ImageDTO(new FormData(form));
        
        const imagesModifiedOn = await this.#service.updateImage(imageDTO);
        this.#imageManager.dataset.modifiedOn = formatDate(imagesModifiedOn);

        // TODO: Make this module subscribe to service changes and update the contents when changes occur
    }

    /**
     * @param {HTMLInputElement[]} fields 
     */
    #setUndoSaveButtonStatus(fields) {
        this.#resetButton.disabled = this.#saveButton.disabled = fields.every(field => field.value === field.defaultValue);
    }
});