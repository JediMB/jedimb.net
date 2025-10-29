export default class Configuration {
    constructor({ id, name, value, isActive }) {
        this.id = Number(id);
        this.name = name;
        this.value = value;
        this.isActive = isActive;
    }
}