import httpClient from "../../http-client.js";
import User from "../../models/user/user.model.js";
import UserLoginRequest from "../../models/user/user-login-request.model.js";
import UserLoginResponse from "../../models/user/user-login-response.model.js";

export { sessionApiService as default };

class SessionApiService {
    #httpClient;

    constructor() {
        this.#httpClient = httpClient;
    }

    async getStatus() {
        const response = await this.#httpClient.get('session/status');

        if (!response.success)
            return false;

        return response.value;
    }

    async getUser() {
        const response = await this.#httpClient.get('session/user');

        if (!response.success)
            return response;

        if (response.value)
            response.value = new  User(response.value);

        return response;
    }

    async login(formData) {
        const response = await this.#httpClient.post('session/login', new UserLoginRequest(formData));

        if (!response.success)
            return response;

        response.value = new UserLoginResponse(response.value);

        return response;
    }

    async logout() {
        const response = await this.#httpClient.post('session/logout');

        return response;
    }

}
const sessionApiService = new SessionApiService();