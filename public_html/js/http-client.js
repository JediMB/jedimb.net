export { httpClient as default };

class HttpClient {
    #baseApiUrl = '/api/';
    #requestTypeCss = 'background-color: red; color: white;';

    constructor() { }

    /**
     * @param {Response} response 
     * @param {string} httpMethod 
     * @returns {Promise<any>}
     */
    async #responseHandling(response, httpMethod) {
        if (!response.ok) {
            console.error(`Error ${response.status}: %c ${httpMethod} %c '${this.#baseApiUrl + api}' failed.`, this.#requestTypeCss);

            try {
                return { success: false, errors: (await response.json()).errors };
            }
            catch (error) {
                return { success: false, errors: [ error.message ] };
            }
        }

        const data = await response.json().catch(
            error => ({
                success: false,
                errors: [ `Failed to parse JSON: ${error.message}` ]
            })
        );

        return data;
    }

    /**
     * Requests data from the API
     * @param {string} api 
     * @returns {Promise<any>}
     */
    async get(api) {
        const response = await fetch(this.#baseApiUrl + api).catch(
            error => ({
                ok: false,
                errors: [ error.message ]
            })
        );

        return await this.#responseHandling(response, 'GET');
    }

    /**
     * Submits new data to the API
     * @param {string} api 
     * @param {any} body 
     * @returns {Promise<any>}
     */
    async post(api, body = null) {
        const response = await fetch(this.#baseApiUrl + api, {
            method: 'POST',
            body: JSON.stringify(body)
        }).catch(
            error => ({
                ok: false,
                errors: [ error.message ]
            })
        );

        return await this.#responseHandling(response, 'POST');
    }

    /**
     * Sends a full object update to the API
     * @param {string} api 
     * @param {any} body 
     * @returns {Promise<any>}
     */
    async put(api, body) {
        const response = await fetch(this.#baseApiUrl + api, {
            method: 'PUT',
            body: JSON.stringify(body)
        }).catch(
            error => ({
                ok: false,
                errors: [ error.message ]
            })
        );

        return await this.#responseHandling(response, 'PUT');
    }

    /**
     * Sends a partial object update to the API
     * @param {string} api 
     * @param {any} body 
     * @returns {Promise<any>}
     */
    async patch(api, body) {
        const response = await fetch(this.#baseApiUrl + api, {
            method: 'PATCH',
            body: JSON.stringify(body)
        }).catch(
            error => ({
                ok: false,
                errors: [ error.message ]
            })
        );

        return await this.#responseHandling(response, 'PATCH');
    }

    async delete(api) {
        
    }
}
const httpClient = new HttpClient();