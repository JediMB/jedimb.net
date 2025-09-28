export default class UserLoginRequest {
    constructor(formData) {
        this.username = formData.get('username');
        this.password = formData.get('password');
        this.persistent = Boolean(formData.get('rememberme'));
    }
}