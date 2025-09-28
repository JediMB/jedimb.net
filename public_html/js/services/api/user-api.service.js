import HttpClient from "../../http-client.js";
import UserLoginRequest from "../../models/user/user-login-request.model.js";

export default class UserApiService {
    constructor(httpClient = HttpClient.httpClient) {
        this.httpClient = httpClient;
    }

    async login(formData) {
        const data = await this.httpClient.post('user/login', new UserLoginRequest(formData));

        console.log(data);

    }
}