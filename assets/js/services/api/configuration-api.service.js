import httpClient from "/js/http-client.js";
import Configuration from "/js/models/configuration.model.js";

export { configurationApiService as default };

class ConfigurationApiService {
    #httpClient;
    #api = 'configuration';

    constructor() {
        this.#httpClient = httpClient;
    }

    /**
     * @param {Configuration[]} configs 
     * @returns {Promise<({success: boolean, errors?: string[]|Object.<string, string|InputErrors>, value?: Configuration[]})>}
     */
    async createConfigurations(configs) {
        const response = await this.#httpClient.post(this.#api, configs);

        if (!response.success)
            return response;

        if (Array.isArray(response.value))
            response.value = response.value.map(config => new Configuration(config));

        return response;
    }

    /**
     * @param {Configuration[]} configs 
     * @returns {Promise<({success: boolean, errors?: string[]|Object.<string, string|InputErrors>, value?: Configuration[]})>}
     */
    async updateConfigurations(configs) {
        const response = await this.#httpClient.patch(this.#api, configs);

        if (!response.success)
            return response;

        if (Array.isArray(response.value))
            response.value = response.value.map(config => new Configuration(config));

        return response;
    }
}
const configurationApiService = new ConfigurationApiService();