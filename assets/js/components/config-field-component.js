export default class ConfigFieldComponent extends HTMLElement {
    /** @type {HTMLButtonElement} */ #buttonAdd;
    /** @type {HTMLButtonElement} */ #buttonSave;
    /** @type {HTMLButtonElement} */ #buttonUndo;
    /** @type {HTMLFieldSetElement} */ #fieldset;
    /** @type {HTMLInputElement} */ #input;
    /** @type {HTMLInputElement[]|undefined} */ #inputsCSV;
    /** @type {HTMLUListElement} */ #listCSV;
    /** @type {HTMLTemplateElement} */ #itemTemplate;
    /** @type {HTMLInputElement} */ #toggleDefault;

    /** @type {string} */#currentValue;
    /** @type {string} */#defaultValue;
    /** @type {string} */#startingValue;

    /** @type {string} */ #undoEnabledTitle;
    /** @type {string} */ #undoDisabledTitle;

    constructor() { super(); }

    connectedCallback() {
        const inputRow = this.querySelector('input-row');

        this.#input = inputRow.querySelector('[input-config]');

        const listCSV = this.querySelector('[list-csv]');
        this.#listCSV = listCSV;
        
        if (listCSV) {
            this.#fieldset = this.querySelector('fieldset');
            this.#inputsCSV = Array.from(listCSV.querySelectorAll('[input-csv'));
            this.#buttonAdd = listCSV.querySelector('[btn-add]');
            this.#itemTemplate = listCSV.querySelector('template');
        }

        this.#buttonSave = inputRow.querySelector('[btn-save');
        this.#buttonUndo = inputRow.querySelector('[btn-undo]');

        this.#toggleDefault = this.querySelector('[toggle-default]');

        this.#setup(!!listCSV);
    }

    connectedMoveCallback() {}

    disconnectedCallback() {}

    /** @returns {string} */
    #getCSVString() {
        return String.prototype.concat(
            this.#inputsCSV.map(input =>
                input.checkValidity()
                    ? input.value.trim()
                    : `<${input.dataset.errorInvalid}>`
            )
        ).replaceAll(/,\s*/g, ', ');
    }

    #setUndoButtonStatus() {
        this.#buttonUndo.disabled = this.#toggleDefault.checked
            || this.#currentValue === this.#startingValue;
        this.#buttonUndo.title = this.#buttonUndo.disabled
            ? this.#undoDisabledTitle
            : this.#undoEnabledTitle;
    }

    /** @param {boolean} setupCSV  */
    #setup(setupCSV) {
        this.#startingValue = this.#input.value;
        this.#currentValue = this.#input.value;
        this.#defaultValue = this.#input.dataset.defaultValue;

        this.#undoEnabledTitle = this.#buttonUndo.dataset.enabledTitle;
        this.#undoDisabledTitle = this.#buttonUndo.dataset.disabledTitle;

        if (setupCSV)
            return this.#setupCSV();
        
        this.#input.addEventListener('input', () => {
            this.#currentValue = this.#input.value;
            this.#setUndoButtonStatus();
        });

        this.#buttonUndo.addEventListener('click', () => {
            this.#buttonUndo.disabled = true;
            this.#buttonUndo.title = this.#undoDisabledTitle;
            this.#input.value = this.#startingValue;
        });

        this.#toggleDefault.addEventListener('change', event => {
            const isDefault = event.currentTarget.checked;
            this.#input.disabled = isDefault;
            this.#input.value = isDefault
                ? this.#defaultValue
                : this.#currentValue;
            this.#setUndoButtonStatus();
        });
    }

    #setupCSV() {
        this.#toggleDefault.addEventListener('change', event => {
            const isDefault = event.currentTarget.checked;
            this.#input.hidden = !isDefault;
            this.#input.disabled = isDefault;
            this.#input.value = isDefault
                ? this.#defaultValue
                : this.#currentValue;
            this.#setUndoButtonStatus();
            this.#fieldset.hidden = isDefault;
        });

        const listItems = this.#listCSV.querySelectorAll('[item-csv]');
        for (const item of listItems) {
            this.#setupCSVItem(item);
        }

        this.#buttonUndo.addEventListener('click', () => {
            this.#buttonUndo.disabled = true;
            this.#buttonUndo.title = this.#undoDisabledTitle;

            // TODO: Restore list of items
            //this.#input.value = this.#startingValue;
        });
    }

    /**
     * @param {HTMLLIElement} listItem
     */
    #setupCSVItem(listItem) {
        /** @type {HTMLInputElement} */
        const itemInput = listItem.querySelector('[input-csv]');
        /** @type {HTMLButtonElement} */
        const itemButton = listItem.querySelector('[btn-remove]');

        itemInput.addEventListener('input', () => {
            itemInput.size = itemInput.value.length
                ? itemInput.value.length
                : Number(itemInput.dataset.defaultSize);
            
            this.#currentValue = this.#getCSVString();
            this.#setUndoButtonStatus();
        });

        itemButton.addEventListener('click', () => {
            this.#inputsCSV = this.#inputsCSV.filter(
                input => input !== itemInput
            );

            this.#currentValue = this.#getCSVString();
            this.#setUndoButtonStatus();

            listItem.remove();
        });
    }
}

customElements.define('config-field-component', ConfigFieldComponent);
