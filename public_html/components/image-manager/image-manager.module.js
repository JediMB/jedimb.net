customElements.define('image-manager-component', class ImageManagerComponent extends HTMLElement {
    /** @type {ImageManagerComponent} */
    #self;
    #container;
    
    constructor() {
        const component = super();
        this.#self = component;
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