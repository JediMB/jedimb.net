import httpClient from "../../http-client.js";
import User from "../../models/user/user.model.js";

export { sessionApiService as default };

class SessionApiService {
    #httpClient;

    constructor() {
        this.#httpClient = httpClient;
    }

    async getUser() {
        const response = this.#httpClient.get('user/session');

        if (!response.success)
            return response;

        if (response.value)
            response.value = new  User(response.value);

        return response;
    }

}
const sessionApiService = new SessionApiService();