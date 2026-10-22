import Configuration from "/js/models/configuration.model.js";
import configurationApiService from "/js/services/api/configuration-api.service.js";

export { configurationService as default };

class ConfigurationService {
    #service = configurationApiService;

    constructor() {}

    /** 
     * @param {Configuration} configuration
     * @param {(value: Configuration) => void} next
     * @param {(error: ConfigError) => void} error
     */
    async saveConfiguration(configuration, next, error) {
        const response = configuration.id === 0
            ? await this.#service.createConfigurations([configuration])
            : await this.#service.updateConfigurations([configuration]);

        if (!response.success)
            return error?.call(this, response.errors.at(0));

        next?.call(this, response.value.at(0));
    }

    /** 
     * @param {Configuration[]} configurations
     * @param {(value: Configuration[]) => void} next
     * @param {(errors: ConfigError[]) => void} error
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
            /** @type {ConfigError[]} */
            const returnedErrors = [];

            for (const response of responses) {
                returnedConfigurations.push(...response.value);
                returnedErrors.push(...response.errors);
            }

            if (returnedConfigurations.length)
                next?.call(this, returnedConfigurations);

            if (returnedErrors.length)
                error?.call(this, returnedErrors);
            },
            reason => {
                console.error(reason);
            });
    }
}

const configurationService = new ConfigurationService();