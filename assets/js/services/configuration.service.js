import Configuration from "/js/models/configuration.model.js";
import configurationApiService from "/js/services/api/configuration-api.service.js";

export { configurationService as default };

class ConfigurationService {
    #service = configurationApiService;

    constructor() {}

    /** @param {Configuration} configuration  */
    async saveConfiguration(configuration) {
        if (configuration.id > 0)
            return await this.#service.updateConfigurations([configuration]);

        return await this.#service.createConfigurations([configuration]);
    }
}

const configurationService = new ConfigurationService();