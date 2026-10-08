export default class UndoData {
    /**
     * @param {Object} undoData
     * @param {String} undoData.innerHTML 
     * @param {Number[]} undoData.route 
     * @param {Number} undoData.offset 
     */
    constructor({innerHTML, route, offset}) {
        this.innerHTML = innerHTML;
        this.route = route;
        this.offset = offset;
    }
}