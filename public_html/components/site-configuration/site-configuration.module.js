import configurationApiService from "/js/services/api/configuration-api.service.js";
import configField from "/js/components/site-configuration/config-field/config-field.module.js";

class SiteConfiguration {
    #configApiService;

    constructor() {
        this.#configApiService = configurationApiService;
        const component = document.querySelector('site-configuration-component');

        const form = component.querySelector('form');
        const saveButton = form.querySelector('button[type="submit"]');

        configField.onChanges(hasValidChanges => {
            saveButton.disabled = !hasValidChanges;
        });

        form.addEventListener('submit', event => {
            event.preventDefault();
            this.#save(form, saveButton);
        });
    }

    async #save(form, saveButton) {
        saveButton.disabled = true;

        const changes = await configField.getChanges();

        const newConfigs = changes.filter(c => c.id === 0);
        const updatedConfigs = changes.filter(c => c.id > 0);

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