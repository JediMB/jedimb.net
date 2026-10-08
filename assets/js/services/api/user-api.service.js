import httpClient from "../../http-client.js";
import User from "../../models/user/user.model.js";

export { userApiService as default };

class UserApiService {
    #httpClient;

    constructor() {
        this.#httpClient = httpClient;
    }
}
const userApiService = new UserApiService();