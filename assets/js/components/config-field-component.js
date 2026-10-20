import configurationService from "/js/services/configuration.service.js";

export default class ConfigFieldComponent extends HTMLElement {
    /** @type {HTMLButtonElement} */ #buttonAdd;
    /** @type {HTMLButtonElement} */ #buttonSave;
    /** @type {HTMLButtonElement} */ #buttonUndo;
    /** @type {HTMLFieldSetElement} */ #fieldset;
    /** @type {HTMLInputElement} */ #input;
    /** @type {HTMLInputElement[]|undefined} */ #inputsCSV;
    /** @type {HTMLLIElement} */ #itemAdd;
    /** @type {HTMLUListElement} */ #listCSV;
    /** @type {HTMLTemplateElement} */ #itemTemplate;
    /** @type {HTMLInputElement} */ #toggleDefault;

    /** @type {number} */ #id;
    /** @type {string} */ #name;
    /** @type {string} */ #configType;

    /** @type {boolean} */ #startingChecked;
    /** @type {boolean} */ #currentChecked;
    /** @type {string} */ #currentValue;
    /** @type {string} */ #defaultValue;
    /** @type {string} */ #startingValue;

    /** @type {Node} */ #startingList;

    /** @type {string} */ #saveEnabledTitle;
    /** @type {string} */ #saveDisabledTitle;
    /** @type {string} */ #undoEnabledTitle;
    /** @type {string} */ #undoDisabledTitle;

    #isValid = true;
    #hasChangedChecked = false;
    #hasChangedValue = false;

    constructor() { super(); }

    connectedCallback() {
        const inputRow = this.querySelector('input-row');

        this.#input = inputRow.querySelector('[input-config]');

        const listCSV = this.querySelector('[list-csv]');
        this.#listCSV = listCSV;
        
        if (listCSV) {
            this.#fieldset = this.querySelector('fieldset');
            this.#inputsCSV = Array.from(listCSV.querySelectorAll('[input-csv'));
            this.#itemAdd = listCSV.querySelector('[item-add]');
            this.#buttonAdd = this.#itemAdd.querySelector('[btn-add]');
            this.#itemTemplate = listCSV.querySelector('template');
        }

        this.#buttonSave = inputRow.querySelector('[btn-save');
        this.#buttonUndo = inputRow.querySelector('[btn-undo]');

        this.#toggleDefault = this.querySelector('[toggle-default]');

        this.#setup(!!listCSV);
    }

    connectedMoveCallback() {}

    disconnectedCallback() {}

    #addCSVItem() {
        const fragment = this.#itemTemplate.content.cloneNode(true);
        this.#listCSV.insertBefore(fragment, this.#itemAdd);
        const item = this.#itemAdd.previousElementSibling;
        this.#setupCSVItem(item, { addInputToList: true });
    }

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

    async #save() {
        const value = this.#currentChecked && this.#hasChangedValue
            ? this.#currentValue
            : null;

        const isInactive = this.#hasChangedChecked
            ? this.#currentChecked
            : null;
        
        const config = new Configuration({
            id: this.#id,
            name: this.#name,
            value: value,
            configType: this.#configType,
            isInactive: isInactive
        });

        const response = await configurationService.saveConfiguration(config);
    }

    #setSaveButtonStatus() {
        this.#buttonSave.disabled = !this.#isValid
            || (this.#currentChecked && !this.#hasChangedChecked)
            || (!this.#currentChecked && !this.#hasChangedValue);

        this.#buttonSave.title = this.#buttonSave.disabled
            ? this.#saveDisabledTitle
            : this.#saveEnabledTitle;
    }

    #setUndoButtonStatus() {
        this.#buttonUndo.disabled = this.#currentChecked || !this.#hasChangedValue;
        this.#buttonUndo.title = this.#buttonUndo.disabled
            ? this.#undoDisabledTitle
            : this.#undoEnabledTitle;
    }

    /** @param {boolean} setupCSV  */
    #setup(setupCSV) {
        this.#id = Number(this.#input.dataset.id);
        this.#name = this.#input.name;
        this.#configType = this.#input.dataset.configType;

        this.#startingChecked = this.#toggleDefault.checked;
        this.#currentChecked = this.#toggleDefault.checked;

        this.#startingValue = this.#input.value;
        this.#currentValue = this.#input.value;
        this.#defaultValue = this.#input.dataset.defaultValue;

        this.#saveEnabledTitle = this.#buttonSave.dataset.enabledTitle;
        this.#saveDisabledTitle = this.#buttonSave.dataset.disabledTitle;
        this.#undoEnabledTitle = this.#buttonUndo.dataset.enabledTitle;
        this.#undoDisabledTitle = this.#buttonUndo.dataset.disabledTitle;

        if (setupCSV)
            return this.#setupCSV();
        
        this.#input.addEventListener('input', () => {
            this.#currentValue = this.#input.value;
            this.#hasChangedValue = this.#currentValue !== this.#defaultValue;
            this.#isValid = this.#input.checkValidity();
            this.#setSaveButtonStatus();
            this.#setUndoButtonStatus();
        });

        this.#buttonUndo.addEventListener('click', () => {
            this.#buttonSave.disabled = true;
            this.#buttonSave.title = this.#saveDisabledTitle;
            this.#buttonUndo.disabled = true;
            this.#buttonUndo.title = this.#undoDisabledTitle;

            this.#currentValue = this.#startingValue;
            this.#input.defaultValue = this.#startingValue;
            this.#input.value = this.#currentValue;
            this.#hasChangedValue = false;
            this.#isValid = this.#input.checkValidity();
        });

        this.#toggleDefault.addEventListener('change', event => {
            const isDefault = event.currentTarget.checked;

            this.#currentChecked = isDefault;
            this.#hasChangedChecked = this.#currentChecked !== this.#startingChecked;
            
            this.#input.disabled = isDefault;
            this.#input.defaultValue = isDefault
                ? this.#defaultValue
                : this.#startingValue;
            this.#input.value = isDefault
                ? this.#defaultValue
                : this.#currentValue;
            this.#setSaveButtonStatus();
            this.#setUndoButtonStatus();
        });
    }

    #setupCSV() {
        this.#startingList = this.#listCSV.cloneNode(true);

        this.#toggleDefault.addEventListener('change', event => {
            const isDefault = event.currentTarget.checked;

            this.#currentChecked = isDefault;
            this.#hasChangedChecked = this.#currentChecked !== this.#startingChecked;

            this.#input.hidden = !isDefault;
            this.#fieldset.hidden = isDefault;
            this.#setSaveButtonStatus();
            this.#setUndoButtonStatus();
        });

        const listItems = this.#listCSV.querySelectorAll('[item-csv]');
        for (const item of listItems) {
            this.#setupCSVItem(item);
        }

        this.#buttonAdd.addEventListener('click', () => {
            this.#addCSVItem();
        });

        this.#buttonUndo.addEventListener('click', () => {
            this.#buttonSave.disabled = true;
            this.#buttonSave.title = this.#saveDisabledTitle;
            this.#buttonUndo.disabled = true;
            this.#buttonUndo.title = this.#undoDisabledTitle;

            this.#currentValue = this.#startingValue;
            this.#hasChangedValue = false;

            const listClone = this.#startingList.cloneNode(true);
            this.#listCSV.replaceWith(listClone);
            this.#listCSV = listClone;

            const listItems = this.#listCSV.querySelectorAll('[item-csv]');
            for (const item of listItems) {
                this.#setupCSVItem(item);
            }

            this.#isValid = this.#fieldset.checkValidity();
        });
    }

    /**
     * @param {HTMLLIElement} listItem
     * @param {object} [options={}] 
     * @param {boolean} options.addInputToList
     */
    #setupCSVItem(listItem, { addInputToList } = {}) {
        /** @type {HTMLInputElement} */
        const itemInput = listItem.querySelector('[input-csv]');
        /** @type {HTMLButtonElement} */
        const itemButton = listItem.querySelector('[btn-remove]');

        itemInput.addEventListener('input', () => {
            itemInput.size = itemInput.value.length
                ? itemInput.value.length
                : Number(itemInput.dataset.defaultSize);
            
            this.#currentValue = this.#getCSVString();
            this.#hasChangedValue = this.#currentValue !== this.#startingValue;
            this.#isValid = this.#fieldset.checkValidity();
            this.#setSaveButtonStatus();
            this.#setUndoButtonStatus();
        });

        if (addInputToList) {
            this.#inputsCSV.push(itemInput);
        }
        itemButton.addEventListener('click', () => {
            this.#inputsCSV = this.#inputsCSV.filter(
                input => input !== itemInput
            );
            listItem.remove();

            this.#currentValue = this.#getCSVString();
            this.#hasChangedValue = this.#currentValue !== this.#startingValue;
            this.#isValid = this.#fieldset.checkValidity();
            this.#setSaveButtonStatus();
            this.#setUndoButtonStatus();
        });
    }
}

customElements.define('config-field-component', ConfigFieldComponent);
