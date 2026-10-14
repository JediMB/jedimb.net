export default class Configuration {
    /**
    * @param {Object} param0 
    * @param {number} param0.id 
    * @param {string} param0.name 
    * @param {string} param0.value 
    * @param {string} param0.configType
    * @param {boolean} param0.isInactive  */
    constructor({ id, name, value, configType, isInactive }) {
        this.id = Number(id);
        this.name = name;
        this.value = value;
        this.configType = configType;
        this.isInactive = isInactive;
    }
}