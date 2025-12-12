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
     * @param {number|string} identifier
     * @returns {Promise<any>}
     */
    async get(api, identifier = undefined) {
        const queryString =
            identifier === undefined
            ? ''
            : `/${identifier}`;

        const response = await fetch(this.#baseApiUrl + api + queryString).catch(
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

    /**
     * Requests the deletion of data from the API
     * @param {string} api 
     * @param {number|string} identifier
     * @returns {Promise<any>}
     */
    async delete(api, identifier) {
        if (!identifier)
            throw new Error('Identifier missing in delete call');

        const response = await fetch(this.#baseApiUrl + `${api}/${identifier}`, {
            method: 'DELETE'
        }).catch(
            error => ({
                ok: false,
                errors: [ error.message ]
            })
        );

        return await this.#responseHandling(response, 'DELETE');
    }
}
const httpClient = new HttpClient();