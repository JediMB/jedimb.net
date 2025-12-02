import imageManagerService from "/js/services/image-manager.service.js";

customElements.define('image-manager-component', class ImageManagerComponent extends HTMLElement {
    /** @type {ImageManagerComponent} */
    #self;
    #container;
    #service;
    
    constructor() {
        const component = super();
        this.#self = component;
        this.#service = imageManagerService;
    }

    connectedCallback() {
        const self = this.#self;
        this.#container = this.querySelector('images-container');

        // const tabs = self.querySelectorAll('manager-tabs > input[type="radio"]');
        // for (const tab of tabs) {
        //     tab.addEventListener('change', (event) => {
        //         event.stopPropagation();

        //     })
        // }
    }
});