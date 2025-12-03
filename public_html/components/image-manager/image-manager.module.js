import imageManagerService from "/js/services/image-manager.service.js";

customElements.define('image-manager-component', class ImageManagerComponent extends HTMLElement {
    /** @type {ImageManagerComponent} */
    #self;
    #service;
    #properties;
    /** @type HTMLTemplateElement */
    #propertiesTemplate;
    
    constructor() {
        const component = super();
        this.#self = component;
        this.#service = imageManagerService;
    }

    connectedCallback() {
        const self = this.#self;

        const fileList = self.querySelector('manager-files');
        this.#properties = self.querySelector('manager-properties');
        this.#propertiesTemplate = self.querySelector('manager-properties + template');

        fileList.addEventListener('change', event => {
            if (!event.target.checked)
                return;

            event.stopPropagation();


            console.log(event.target);

            const template = this.#propertiesTemplate.content.cloneNode(true);
            this.#properties.textContent = '';
            this.#properties.appendChild(template);
        });
    }

    #updateManagerProperties() {

    }
});