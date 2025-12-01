import httpClient from "/js/http-client.js";

export { tableModifiedApiService as default };

class TableModifiedApiService {
    #httpClient;

    constructor() {
        this.#httpClient = httpClient;
    }

    /**
     * @param {String} table 
     * @returns {Promise<(Date|false)>}
     */
    async #getModifiedDate(table) {
        const response = await this.#httpClient.get(`modified/${table}`);

        if (!response.success)
            return false;

        if (response.value)
            response.value = new Date(response.value.date + response.value.timezone);

        return false;
    }

    async getImageDate() {
        return await this.#getModifiedDate('image');
    }

    async getGalleryDate() {
        return await this.#getModifiedDate('gallery');
    }
}
const tableModifiedApiService = new TableModifiedApiService();