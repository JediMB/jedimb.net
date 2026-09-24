export default class User {
    /**
    * @param {Object} user 
    * @param {string} user.username 
    * @param {string} user.email 
    * @param {number} user.role 
    * @param {{date: string, timezone: string}} user.passwordTimestamp 
    * @param {{date: string, timezone: string}} user.registeredOn 
    * @param {{date: string, timezone: string}} [user.lastLogin] */
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