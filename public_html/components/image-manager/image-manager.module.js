import imageManagerService from "/js/services/image-manager.service.js";

customElements.define('image-manager-component', class ImageManagerComponent extends HTMLElement {
    /** @type {ImageManagerComponent} */
    #self;
    #service;
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

        const imageManager = self.querySelector('image-manager');
        const fileList = imageManager.querySelector('manager-files');
        this.#insertButton = imageManager.querySelector('[btn-insert]');
        const form = imageManager.querySelector('form');
        this.#properties = imageManager.querySelector('image-properties');
        this.#propertiesTemplate = imageManager.querySelector('manager-properties + template');
        this.#resetButton = imageManager.querySelector('[btn-reset]');
        this.#saveButton = imageManager.querySelector('[btn-save]');

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
    #save(event) {
        event.preventDefault();
        
        const form = event.target;
        const formData = new FormData(form);
        
        for (const [key, value] of formData) {

        }
    }

    /**
     * @param {HTMLInputElement[]} fields 
     */
    #setUndoSaveButtonStatus(fields) {
        this.#resetButton.disabled = this.#saveButton.disabled = fields.every(field => field.value === field.defaultValue);
    }
});