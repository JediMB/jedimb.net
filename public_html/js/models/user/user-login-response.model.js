export default class UserLoginResponse {
    constructor({
        id, token, validator
    }) {
        this.id = Number(id);
        this.token = token;
        this.validator = validator;
    }
}