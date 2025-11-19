import SelectionData from "../models/selection-data.model.js";

export { undoManagementService as default };

class UndoManagementService {
    #undoHistories = new Map();
    #redoHistories = new Map();
    #savedInnerHTML;
    #savedSelectionData;

    addUndo(textBox, useSaved = false) {
        this.#undoHistories[textBox] ??= [];

        const innerHTML = useSaved
            ? this.#savedInnerHTML
            : textBox.innerHTML;
        const selectionData = useSaved
            ? this.#savedSelectionData
            : new SelectionData(window.getSelection());
        const node = selectionData.isCollapsed
            ? selectionData.startNode
            : selectionData.endNode;
        const offset = selectionData.isCollapsed
            ? selectionData.startOffset
            : selectionData.endOffset;
        const route = this.#getRoute(textBox, node);
        
        const undo = {
            innerHTML: innerHTML,
            route: route,
            offset: offset
        };

        if (this.#undoHistories[textBox].length > 29)
            this.#undoHistories[textBox].shift();

        this.#undoHistories[textBox].push(undo);
    }

    // addRedo(textBox) {

    // }

    execute(textBox) {
        if (!this.#undoHistories[textBox]?.length)
            return;

        const undo = this.#undoHistories[textBox].pop();
        textBox.innerHTML = undo.innerHTML;

        const node = this.#traceRoute(textBox, undo.route);
        window.getSelection().setPosition(node, undo.offset);
    }

    saveUndoData(containerNode, selectionData) {
        this.#savedInnerHTML = containerNode.innerHTML;
        this.#savedSelectionData = selectionData;
    }

    // #addToHistory(textBox, useSaved = false) {


    // }

    /**
     * 
     * @param {Node} start 
     * @param {Node} target 
     * @param {Number[]} route 
     * @returns {Number[]}
     */
    #getRoute(start, target, route = []) {
        let num = 0;

        for (const child of start.childNodes) {
            if (child === target) {
                route.push(num);
                return route;
            }

            if (child.contains(target)) {
                route.push(num);
                return this.#getRoute(child, target, route);
            }

            num++;
        }

        throw new Error('Could not find target node');
    }

    /**
     * 
     * @param {Node} start 
     * @param {Number[]} route 
     * @returns {Node}
     */
    #traceRoute(start, route) {
        const target = route.shift();

        if (target === undefined || target < 0)
            throw new Error('Invalid route');

        const node = Array.from(start.childNodes)[target];

        if (route.length === 0)
            return node;

        return this.#traceRoute(node, route);
    }

}
const undoManagementService = new UndoManagementService();