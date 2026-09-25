export default class UserLoginResponse {
    constructor({
        userId, token, validator, expiresOn
    }) {
        this.userId = Number(userId);
        this.token = token;
        this.validator = validator;
        this.expiresOn = expiresOn ? new Date(expiresOn.date + expiresOn.timezone) : null;
    }
}