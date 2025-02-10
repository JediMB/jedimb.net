export default class HttpClient {
    constructor() {
        this.baseApiUrl = '/api/';
    }
    static httpClient = new HttpClient();

    async get(api) {
        const response = await fetch(this.baseApiUrl + api);

        if (response.ok)
            return await response.json();

        console.log(`Error ${response.status}: GET ${this.baseApiUrl + api} failed.`)
        return null;
    }

    async post(api) {

    }

    async put(api) {

    }

    async delete(api) {
        
    }
}