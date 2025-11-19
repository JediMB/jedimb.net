import SelectionData from "../models/selection-data.model.js";

export { undoManagementService as default };

class UndoManagementService {
    #undoHistories = new Map();
    #redoHistories = new Map();
    #savedInnerHTML;
    #savedSelectionData;

    /**
     * 
     * @param {HTMLElement} container The root element of the editable content
     * @param {Boolean} useSaved Whether to use the data saved with the saveData function
     */
    add(container, useSaved = false) {
        this.#undoHistories[container] ??= [];
        this.#addTo(this.#undoHistories[container], container, useSaved);
    }

    /**
     * Undo the latest change
     * @param {HTMLElement} container The root element of the editable content
     */
    execute(container) {
        this.#redoHistories[container] ??= [];
        this.#restore(
            this.#undoHistories[container],
            this.#redoHistories[container],
            container
        );
    }

    redo(container) {
        this.#undoHistories[container] ??= [];
        this.#restore(
            this.#redoHistories[container],
            this.#undoHistories[container],
            container
        );
    }

    #restore(sourceList, targetList, container) {
        if (!sourceList?.length)
            return;

        this.#addTo(targetList, container, false);

        const undo = sourceList.pop();
        container.innerHTML = undo.innerHTML;

        const node = this.#traceRoute(container, undo.route);
        window.getSelection().setPosition(node, undo.offset);
    }

    /**
     * 
     * @param {HTMLElement} containerElement 
     * @param {SelectionData} selectionData 
     */
    saveData(containerElement, selectionData) {
        this.#savedInnerHTML = containerElement.innerHTML;
        this.#savedSelectionData = selectionData;
    }

    /**
     * 
     * @param {Object[]} list 
     * @param {HTMLElement} container 
     * @param {Boolean} useSaved 
     */
    #addTo(list, container, useSaved) {
        const innerHTML = useSaved
            ? this.#savedInnerHTML
            : container.innerHTML;
        const selectionData = useSaved
            ? this.#savedSelectionData
            : new SelectionData(window.getSelection());
        const node = selectionData.isCollapsed
            ? selectionData.startNode
            : selectionData.endNode;
        const offset = selectionData.isCollapsed
            ? selectionData.startOffset
            : selectionData.endOffset;
        const route = this.#getRoute(container, node);
        
        const undo = {
            innerHTML: innerHTML,
            route: route,
            offset: offset
        };

        if (list.length > 29)
            list.shift();

        list.push(undo);
    }

    /**
     * 
     * @param {HTMLElement} start 
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
     * @param {HTMLElement} start 
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