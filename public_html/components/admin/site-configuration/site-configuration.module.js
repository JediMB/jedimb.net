import configurationApiService from "/js/services/api/configuration-api.service.js";
import configField from "/js/components/admin/site-configuration/config-field/config-field.module.js";
import configCSV from "/js/components/admin/site-configuration/config-csv/config-csv.module.js";

class SiteConfiguration {
    #configApiService;
    #fieldsUnchanged = true;
    #csvUnchanged = true;

    constructor() {
        this.#configApiService = configurationApiService;
        const component = document.querySelector('site-configuration-component');

        const form = component.querySelector('form');
        const fieldset = form.querySelector('fieldset');
        const saveButton = fieldset.querySelector('button[type="submit"]');
        const isLoading = fieldset.querySelector('[is-loading]');

        configField.onChanges((hasChanges, isValid) => {
            this.#fieldsUnchanged = !hasChanges;
            saveButton.disabled = !isValid || (this.#fieldsUnchanged && this.#csvUnchanged);
        });

        configCSV.onChanges((hasChanges, isValid) => {
            this.#csvUnchanged = !hasChanges;
            saveButton.disabled = !isValid || (this.#fieldsUnchanged && this.#csvUnchanged);
        })

        form.addEventListener('submit', event => {
            event.preventDefault();
            this.#save(fieldset);
        });

        isLoading.remove();
    }

    async #save(fieldset) {
        fieldset.disabled = true;

        let changes = await configField.getChanges();
        changes = [...changes, ...await configCSV.getChanges()];

        const newConfigs = changes.filter(c => c.id === 0);
        const updatedConfigs = changes.filter(c => c.id > 0);

        const responses = [];

        if (newConfigs.length > 0)
            responses.push(this.#configApiService.createConfigurations(newConfigs));

        if (updatedConfigs.length > 0)
            responses.push(this.#configApiService.updateConfigurations(updatedConfigs));

        Promise.all(responses).then(() => {
            setTimeout(() => location.reload(), 1000);
        }, reason => {
            console.error(reason);
        });
    }
}
const siteConfiguration = new SiteConfiguration();