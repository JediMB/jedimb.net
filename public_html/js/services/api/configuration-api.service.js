import httpClient from "../../http-client.js";

export { configurationApiService as default };

class ConfigurationApiService {
    #httpClient;

    constructor() {
        this.#httpClient = httpClient;
    }

    async createConfigurations(configs) {
        const response = await this.#httpClient.post('configuration', configs);

        return response;
    }

    async updateConfigurations(configs) {
        const response = await this.#httpClient.patch('configuration', configs);

        return response;
    }
}
const configurationApiService = new ConfigurationApiService();