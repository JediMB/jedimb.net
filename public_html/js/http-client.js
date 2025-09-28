export default class HttpClient {
    constructor() {
        this.baseApiUrl = '/api/';
        this.requestTypeCss = 'background-color: red; color: white;';
    }
    static httpClient = new HttpClient();

    async get(api) {
        try {
            const response = await fetch(this.baseApiUrl + api);

            if (response.ok)
                return await response.json();

            console.error(`Error ${response.status}: %c GET %c '${this.baseApiUrl + api}' failed.`, this.requestTypeCss);
        }
        catch(error) {
            console.error(error);
        }

        return null;
    }

    async post(api, data) {
        try {
            const response = await fetch(this.baseApiUrl + api, {
                method: "POST",
                body: JSON.stringify(data)
            });

            if (response.ok)
                return await response.json();
        }
        catch(error) {
            console.log(error);
        }

        return null;

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