import httpClient from "../../http-client.js";
import UserLoginRequest from "../../models/user/user-login-request.model.js";
import UserLoginResponse from "../../models/user/user-login-response.model.js";

export { userApiService as default };

class UserApiService {
    #httpClient;

    constructor() {
        this.#httpClient = httpClient;
    }

    async login(formData) {
        const response = await this.#httpClient.post('user/login', new UserLoginRequest(formData));

        if (!response.success)
            return response;

        response.value = new UserLoginResponse(response.value);

        return response;
    }

    async logout() {
        const response = await this.#httpClient.post('user/logout');

        return response;
    }
}
const userApiService = new UserApiService();