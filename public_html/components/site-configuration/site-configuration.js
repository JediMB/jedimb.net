import Configuration from "/js/models/configuration.model.js";

class SiteConfiguration {
    constructor() {
        const components = document.querySelectorAll('site-configuration-component');

        components.forEach(component => {
            const form = component.querySelector('form');
            const saveButton = form.querySelector('button[type="submit"]');

            form.addEventListener("submit", event => {
                event.preventDefault();
                this.#save();
            });
        });
    }

    #save() {
        // Get all text fields, and then associated data via their ids
        // Assemble Configuration objects from that data and send them in an array
        // "Use default" means that text data will not be updated or added
        // Unchanged values will not be updated or added
    }
}
const siteConfiguration = new SiteConfiguration();