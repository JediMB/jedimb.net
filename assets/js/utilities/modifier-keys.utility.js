export default class ModifierKeys {
    /** @type {0b0} */ static NONE = Object.freeze(0b0);
    /** @type {0b1} */ static SHIFT = Object.freeze(0b1);
    /** @type {0b10} */ static CTRL = Object.freeze(0b10);
    /** @type {0b100} */ static ALT = Object.freeze(0b100);
    /** @type {0b1000} */ static META = Object.freeze(0b1000);

    /**
     * @param {KeyboardEvent} event 
     * @returns {number} 
     */
    static eventKeys(event) {
        return (event.shiftKey * ModifierKeys.SHIFT)
            + (event.ctrlKey * ModifierKeys.CTRL)
            + (event.altKey * ModifierKeys.ALT)
            + (event.metaKey * ModifierKeys.META);
    }

    /**
     * @param {KeyboardEvent} event 
     * @param {number} modifiers 
     * @returns {boolean}
     */
    static inEvent(event, modifiers) {
        return modifiers === ModifierKeys.eventKeys(event);
    }
}