import ConfigFieldComponent from "/js/components/config-field-component.js";
import configurationService from "/js/services/configuration.service.js";

export default class SiteConfigurationComponent extends HTMLElement {
    /** @type {ConfigFieldComponent[]} */ #configFields;
    #saveable = false;

    constructor() { super(); }

    connectedCallback() {
        this.#configFields = Array.from(this.querySelectorAll(customElements.getName(ConfigFieldComponent)));

        /** @type {HTMLButtonElement} */
        const saveAllButton = this.querySelector('[btn-save-all]');

        saveAllButton.addEventListener('click', event => {
            event.preventDefault();
            this.#save();
        });
        
        for (const configField of this.#configFields) {
            configField.onSaveableChange((status) => {
                if (status === this.#saveable)
                    return;

                this.#saveable = this.#configFields.some(field => field.saveable);
                saveAllButton.disabled = !this.#saveable;
            });
        }
    }

    connectedMoveCallback() {}

    disconnectedCallback() {}

    async #save() {
        const saveableFields = this.#configFields.filter(field => field.saveable);

        const configurations = saveableFields.map(field => field.getConfiguration());

        console.log(configurations);

        configurationService.saveConfigurations(configurations,
            response => {
                for (const field of saveableFields) {
                    const config = response.find(c => c.name === field.name);

                    if (!config)
                        continue;

                    field.updateConfiguration(config);
                }
            },
            errors => {
                // TODO: Check if string errors (such as database errors) were returned. Display above form?

                for (const field of saveableFields) {
                    const error = errors[field.name];

                    if (!error)
                        continue;

                    // TODO: Tell field to display its errors
                }
            }
        )

    }
}

customElements.define('site-configuration-component', SiteConfigurationComponent);
