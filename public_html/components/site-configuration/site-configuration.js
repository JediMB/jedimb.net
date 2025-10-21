import Configuration from "/js/models/configuration.model.js";
import configurationApiService from "/js/services/api/configuration-api.service.js";

class SiteConfiguration {
    #configApiService;

    constructor() {
        this.#configApiService = configurationApiService;
        const components = document.querySelectorAll('site-configuration-component');

        components.forEach(component => {
            const form = component.querySelector('form');
            const saveButton = form.querySelector('button[type="submit"]');

            form.addEventListener("submit", event => {
                event.preventDefault();
                this.#save(form);
            });
        });
    }

    async #save(form) {
        const components = form.querySelectorAll('config-field-component');

        const newConfigs = [];
        const updatedConfigs = [];

        components.forEach(component => {
            const domId = component.querySelector('input[type="text"]').id;
            
            const dbId = Number(component.querySelector(`#${domId}-id`).value);
            const constant = component.querySelector(`#${domId}-constant`).value;
            const defaultValue = component.querySelector(`#${domId}-default`).value;
            const value = component.querySelector(`#${domId}-value`).value;
            const unchangedValue = component.querySelector(`#${domId}-unchanged-value`).value;
            const isDefault = Boolean(component.querySelector(`#${domId}-is-default`).checked);
            const wasDefault = Boolean(component.querySelector(`#${domId}-was-default`).value);

            const textChanged = ( (value !== unchangedValue) && !isDefault);
            const toggleChanged = (isDefault !== wasDefault);

            switch (dbId) {
                case 0:
                    if (!textChanged || isDefault)
                        return;

                    newConfigs.push(new Configuration({
                        id: 0,
                        name: constant,
                        value: value,
                        isActive: true
                    }));
                    break;

                default:
                    if (!textChanged && !toggleChanged)
                        return;

                    const config = { id: dbId, name: constant };

                    if (textChanged)
                        config.value = value;

                    if (toggleChanged)
                        config.isActive = !isDefault;
                    
                    updatedConfigs.push(config);
                    break;
            }
        });

        const responseNew = await this.#configApiService.createConfigurations(newConfigs);
        const responseUpdated = await this.#configApiService.updateConfigurations(updatedConfigs);

        console.log(responseNew);
        console.log(responseUpdated);
    }
}
const siteConfiguration = new SiteConfiguration();