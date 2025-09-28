export default class UserLoginResponse {
    constructor({
        isSuccess, token, validator
    }) {
        this.isSuccess = Boolean(isSuccess);
        this.token = token;
        this.validator = validator;
    }
}