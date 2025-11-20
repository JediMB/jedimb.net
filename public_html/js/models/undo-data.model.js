export default class UndoData {
    /**
     * @param {String} innerHTML 
     * @param {Number[]} route 
     * @param {Number} offset 
     */
    constructor(innerHTML, route, offset) {
        this.innerHTML = innerHTML;
        this.route = route;
        this.offset = offset;
    }
}