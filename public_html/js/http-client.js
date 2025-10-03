export default class HttpClient {
    constructor() {
        this.baseApiUrl = '/api/';
        this.requestTypeCss = 'background-color: red; color: white;';
    }
    static httpClient = new HttpClient();

    async get(api) {
        const response = await fetch(this.baseApiUrl + api).catch(
            error => ({
                ok: false,
                errors: [ error.message ]
            })
        );

        if (!response.ok) {
            console.error(`Error ${response.status}: %c GET %c '${this.baseApiUrl + api}' failed.`, this.requestTypeCss);

            return { success: false, errors: response.errors ?? [ response.error ] };
        }

        const data = await response.json().catch(
            error => ({
                success: false,
                errors: [ `Failed to parse JSON: ${error.message}` ]
            })
        );

        return data;
    }

    async post(api, body = null) {
        const response = await fetch(this.baseApiUrl + api, {
            method: "POST",
            body: JSON.stringify(body)
        }).catch(
            error => ({
                ok: false,
                errors: [ error.message ]
            })
        );

        if (!response.ok) {
            console.error(`Error ${response.status}: %c POST %c '${this.baseApiUrl + api}' failed.`, this.requestTypeCss);
            
            return { success: false, errors: response.errors ?? [ response.error ]};
        }
        
        const data = await response.json().catch(
            error => ({
                success: false,
                errors: [ `Failed to parse JSON: ${error.message}` ]
            })
        );

        return data;
    }

    // Full replacement
    async put(api) {

    }

    // Partial replacement
    async patch(api) {

    }

    async delete(api) {
        
    }
}