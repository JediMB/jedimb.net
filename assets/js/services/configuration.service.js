import Configuration from "/js/models/configuration.model.js";
import configurationApiService from "/js/services/api/configuration-api.service.js";

export { configurationService as default };

class ConfigurationService {
    #service = configurationApiService;

    constructor() {}

    /** 
     * @param {Configuration} configuration
     * @param {(value: Configuration) => void} next
     * @param {(errors?: string[]|InputErrors) => void} error
     */
    async saveConfiguration(configuration, next, error) {
        const response = configuration.id === 0
            ? await this.#service.createConfigurations([configuration])
            : await this.#service.updateConfigurations([configuration]);

        let errors;

        if (!response.success) {
            if (Array.isArray(response.errors))
                return error?.call(this, response.errors);

            if (Object.hasOwn(response.errors, configuration.name))
                return error?.call(this, response.errors[configuration.name]);

            console.error('Unknown error in saveConfiguration', response.errors);
            return;
        }

        next?.call(this, response.value.at(0));
    }

    /** 
     * @param {Configuration[]} configurations
     * @param {(value: Configuration[]) => void} next
     * @param {(errors: Object.<string, string|InputErrors>) => void} error
     */
    async saveConfigurations(configurations, next, error) {
        const newConfigs = configurations.filter(config => config.id === 0);
        const oldConfigs = configurations.filter(config => config.id > 0);

        const promises = [];

        if (newConfigs.length)
            promises.push(this.#service.createConfigurations(newConfigs));

        if (oldConfigs.length)
            promises.push(this.#service.updateConfigurations(oldConfigs));

        Promise.all(promises).then(responses => {
            /** @type {Configuration[]} */
            const returnedConfigurations = [];
            /** @type {Object.<string, string|InputErrors>} */
            let returnedErrors = {};

            // TODO: Needs to take into account string, object->string, and object->inputError errors

            for (const response of responses) {
                if (response.value)
                    returnedConfigurations.push(...response.value);

                if (Array.isArray(response.errors)) {
                    // TODO: Notification
                    console.error(...response.errors);
                    continue;
                }

                if (typeof response.errors === 'object')
                    returnedErrors = { ...returnedErrors, ...response.errors };
            }

            if (returnedConfigurations.length)
                next?.call(this, returnedConfigurations);

            if (Object.keys(returnedErrors).length)
                error?.call(this, returnedErrors);
            },
            reason => {
                console.error(reason);
            });
    }
}

const configurationService = new ConfigurationService();