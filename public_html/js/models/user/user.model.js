export default class User {
    constructor({
        username, email, role, passwordTimestamp, registeredOn, lastLogin
    }) {
        this.username = username;
        this.email = email;
        this.role = role;
        this.passwordTimestamp = new Date(passwordTimestamp.date + passwordTimestamp.timezone);
        this.registeredOn = new Date(registeredOn.date + registeredOn.timezone);
        this.lastLogin = lastLogin ? new Date(lastLogin.date + lastLogin.timezone) : undefined;
    }
}