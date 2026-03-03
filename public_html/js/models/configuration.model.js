export default class Configuration {
    /** @param {Object} param0 
    * @param {number} param0.id 
    * @param {string} param0.name 
    * @param {number|string} param0.value 
    * @param {boolean} param0.isActive  */
    constructor({ id, name, value, isActive }) {
        this.id = Number(id);
        this.name = name;
        this.value = value;
        this.isActive = isActive;
    }
}