import HttpClient from "../../http-client.js";
import UserLoginRequest from "../../models/user/user-login-request.model.js";
import UserLoginResponse from "../../models/user/user-login-response.model.js";

export default class UserApiService {
    constructor(httpClient = HttpClient.httpClient) {
        this.httpClient = httpClient;
    }

    async login(formData) {
        const response = await this.httpClient.post('user/login', new UserLoginRequest(formData));

        if (!response.success)
            return response;

        response.value = new UserLoginResponse(response.value);

        return response;
    }

    async logout() {
        const response = await this.httpClient.post('user/logout');

        return response;
    }
}