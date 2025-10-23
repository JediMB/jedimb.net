import Configuration from "/js/models/configuration.model.js";
import configurationApiService from "/js/services/api/configuration-api.service.js";
import configField from "/js/components/site-configuration/config-field/config-field.module.js";

class SiteConfiguration {
    #configApiService;

    constructor() {
        this.#configApiService = configurationApiService;
        const component = document.querySelector('site-configuration-component');

        const form = component.querySelector('form');
        const saveButton = form.querySelector('button[type="submit"]');

        form.addEventListener("submit", event => {
            event.preventDefault();
            this.#save(form, saveButton);
        });
        });
    }

    async #save(form, saveButton) {
        saveButton.disabled = true;
        const components = form.querySelectorAll('config-field-component');

        const newConfigs = [];
        const updatedConfigs = [];

        components.forEach(component => {
            const textField = component.querySelector('input[type="text"]');
            
            const dbId = Number(textField.dataset.id);
            const value = textField.dataset.inputValue;

            const toggle = component.querySelector('input[type="checkbox"]');
            const isDefault = Boolean(toggle.checked);
            const wasDefault = Boolean(toggle.dataset.originalValue);

            const textChanged = ( (value !== textField.dataset.originalValue) && !isDefault);
            const toggleChanged = (isDefault !== wasDefault);

            switch (dbId) {
                case 0:
                    if (!textChanged || isDefault)
                        return;

                    newConfigs.push(new Configuration({
                        id: 0,
                        name: textField.dataset.constant,
                        value: value,
                        isActive: true
                    }));
                    break;

                default:
                    if (!textChanged && !toggleChanged)
                        return;

                    const config = { id: dbId, name: textField.dataset.constant };

                    if (textChanged)
                        config.value = value;

                    if (toggleChanged)
                        config.isActive = !isDefault;
                    
                    updatedConfigs.push(config);
                    break;
            }
        });

        if (newConfigs.length > 0) {
            const responseNew = await this.#configApiService.createConfigurations(newConfigs);
            console.log(responseNew);
        }

        if (updatedConfigs.length > 0){
            const responseUpdated = await this.#configApiService.updateConfigurations(updatedConfigs);
            console.log(responseUpdated);
        }
    }
}
const siteConfiguration = new SiteConfiguration();