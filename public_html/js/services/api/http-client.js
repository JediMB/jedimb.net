export default class HttpClient {
    constructor() {
        this.baseApiUrl = '/api/';
        this.requestTypeCss = 'background-color: red; color: white;';
    }
    static httpClient = new HttpClient();

    async get(api) {
        const response = await fetch(this.baseApiUrl + api);

        if (response.ok)
            return await response.json();

        console.error(`Error ${response.status}: %c GET %c '${this.baseApiUrl + api}' failed.`, this.requestTypeCss)
        return null;
    }

    async post(api) {

    }

    async put(api) {

    }

    async patch(api) {

    }

    async delete(api) {
        
    }
}