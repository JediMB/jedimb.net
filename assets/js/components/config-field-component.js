import InputErrorsElement from "/js/custom-elements/input-errors.element.js";
import Configuration from "/js/models/configuration.model.js";
import configurationService from "/js/services/configuration.service.js";

export default class ConfigFieldComponent extends HTMLElement {
    /** @type {HTMLButtonElement} */ #buttonAdd;
    /** @type {HTMLButtonElement} */ #buttonSave;
    /** @type {HTMLButtonElement} */ #buttonUndo;
    /** @type {HTMLFieldSetElement} */ #fieldset;
    /** @type {HTMLInputElement} */ #input;
    /** @type {InputErrorsElement} */ #inputErrors;

    /** @type {HTMLUListElement} */ #listCSV;
    /** @type {HTMLInputElement[]|undefined} */ #inputsCSV;
        /** @type {HTMLTemplateElement} */ #itemTemplate;

    /** @type {HTMLInputElement} */ #toggleUseDefault;

    /** @type {number} */ #id;
    /** @type {string} */ #name;
    /** @type {string} */ #configType;

    /** @type {boolean} */ #startingUseDefault;
    /** @type {boolean} */ #currentUseDefault;
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

    #saveable = new Emitter(false);
    #undoable = new Emitter(false);

    get name() { return this.#name; }
    get saveable() { return this.#saveable.getValue(); }

    constructor() { super(); }

    connectedCallback() {
        const inputRow = this.querySelector('input-row');
        
        this.#input = inputRow.querySelector('[input-config]');

        const listCSV = this.querySelector('[list-csv]');
        this.#listCSV = listCSV;
        
        if (listCSV) {
            this.#fieldset = this.querySelector('fieldset');
            this.#inputsCSV = Array.from(listCSV.querySelectorAll('[input-csv'));
                        this.#buttonAdd = this.#fieldset.querySelector('[btn-add]');
            this.#itemTemplate = this.#fieldset.querySelector('template');
        }

        this.#buttonSave = inputRow.querySelector('[btn-save');
        this.#buttonUndo = inputRow.querySelector('[btn-undo]');

        this.#inputErrors = this.querySelector('input-errors');

        this.#toggleUseDefault = this.querySelector('[toggle-default]');

        this.#setup(!!listCSV);
    }

    connectedMoveCallback() {}

    disconnectedCallback() {}

    

    /** @returns {Configuration} */
    getConfiguration() {
        const value = !this.#currentUseDefault && this.#hasChangedValue
            ? this.#currentValue
            : null;

        const isInactive = this.#hasChangedChecked
            ? this.#currentUseDefault
            : null;
        
        return new Configuration({
            id: this.#id,
            name: this.#name,
            value: value,
            configType: this.#configType,
            isInactive: isInactive
        });
    }

    /** @param {(status: boolean) => void} callbackFn */
    onSaveableChange(callbackFn) { return this.#saveable.subscribe({ next: callbackFn }); }

    /** @param {Configuration} configuration */
    updateConfiguration(configuration) {
        this.#id = configuration.id;
        const value = configuration.value;
        this.#currentValue = value;
        this.#startingValue = value;

        if (this.#listCSV) {
            this.#input.defaultValue = this.#defaultValue;
            this.#input.value = this.#defaultValue;

            this.#listCSV.textContent = '';
this.#inputsCSV = [];

            const values = value.split(',').map(v => v.trim());
            for (const csv of values)
                this.#addCSVItem(csv);

            this.#startingList = this.#listCSV.cloneNode(true);
        }
        else {
            this.#input.defaultValue = value;
            this.#input.value = value;
        }

        this.#startingUseDefault = response.isInactive;
    }

    #addCSVItem(inputValue = '') {
        /** @type {DocumentFragment} */
        const fragment = this.#itemTemplate.content.cloneNode(true);
        const input = fragment.querySelector('input');
        input.defaultValue = inputValue;
if (inputValue.length)
            input.size = inputValue.length;
        this.#listCSV.append(fragment);
        const item = this.#listCSV.lastElementChild;
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
        this.#updateStatus({forceSaveable: false, forceUndoable: false});
        this.#buttonSave.setAttribute('btn-loading', 'true');
        this.#inputErrors.clear();

        const config = this.getConfiguration();

        configurationService.saveConfiguration(config,
            response => {
                this.updateConfiguration(response);
                this.#buttonSave.removeAttribute('btn-loading');
            },
            errors => {
                if (typeof errors === 'string')
                    this.#inputErrors.set(errors);
                else if (typeof errors === 'object')
                    this.#inputErrors.set(errors.value);

                this.#updateStatus({forceSaveable: false});
                this.#buttonSave.removeAttribute('btn-loading');
            }
        );
    }

    /** @param {boolean} disabled  */
    #setSaveButtonStatus(disabled) {
        this.#buttonSave.disabled = disabled;

        this.#buttonSave.title = disabled
            ? this.#saveDisabledTitle
            : this.#saveEnabledTitle;
    }

    /** @param {boolean} disabled  */
    #setUndoButtonStatus(disabled) {
        this.#buttonUndo.disabled = disabled;

        this.#buttonUndo.title = disabled
            ? this.#undoDisabledTitle
            : this.#undoEnabledTitle;
    }

    /** @param {boolean} setupCSV  */
    #setup(setupCSV) {
        this.#id = Number(this.#input.dataset.id);
        this.#name = this.#input.name;
        this.#configType = this.#input.dataset.configType;

        this.#startingUseDefault = this.#toggleUseDefault.checked;
        this.#currentUseDefault = this.#toggleUseDefault.checked;

        this.#startingValue = this.#input.value;
        this.#currentValue = this.#input.value;
        this.#defaultValue = this.#input.dataset.defaultValue;

        this.#saveEnabledTitle = this.#buttonSave.dataset.enabledTitle;
        this.#saveDisabledTitle = this.#buttonSave.dataset.disabledTitle;
        this.#undoEnabledTitle = this.#buttonUndo.dataset.enabledTitle;
        this.#undoDisabledTitle = this.#buttonUndo.dataset.disabledTitle;

        this.#buttonSave.addEventListener('click', () => this.#save());

        this.#saveable.subscribe({ next: (saveable) => { this.#setSaveButtonStatus(!saveable) }});
        this.#undoable.subscribe({ next: (undoable) => { this.#setUndoButtonStatus(!undoable) }})

        if (setupCSV)
            return this.#setupCSV();
        
        this.#input.addEventListener('input', () => {
            this.#currentValue = this.#input.value;
            this.#hasChangedValue = this.#currentValue !== this.#startingValue;
            this.#isValid = this.#input.checkValidity();
            this.#updateStatus();
        });

        this.#buttonUndo.addEventListener('click', () => {
            this.#updateStatus({ forceSaveable: false, forceUndoable: false });

            this.#currentValue = this.#startingValue;
            this.#input.defaultValue = this.#startingValue;
            this.#input.value = this.#currentValue;
            this.#hasChangedValue = false;
            this.#isValid = this.#input.checkValidity();
        });

        this.#toggleUseDefault.addEventListener('change', event => {
            const isDefault = event.currentTarget.checked;

            this.#currentUseDefault = isDefault;
            this.#hasChangedChecked = this.#currentUseDefault !== this.#startingUseDefault;
            
            this.#input.disabled = isDefault;
            this.#input.defaultValue = isDefault
                ? this.#defaultValue
                : this.#startingValue;
            this.#input.value = isDefault
                ? this.#defaultValue
                : this.#currentValue;
            this.#updateStatus();
        });
    }

    #setupCSV() {
        this.#startingList = this.#listCSV.cloneNode(true);

        this.#toggleUseDefault.addEventListener('change', event => {
            const isDefault = event.currentTarget.checked;

            this.#currentUseDefault = isDefault;
            this.#hasChangedChecked = this.#currentUseDefault !== this.#startingUseDefault;

            this.#input.hidden = !isDefault;
            this.#fieldset.hidden = isDefault;
            this.#updateStatus();
        });

        const listItems = this.#listCSV.querySelectorAll('[item-csv]');
        for (const item of listItems) {
            this.#setupCSVItem(item);
        }

        this.#buttonAdd.addEventListener('click', () => {
            this.#addCSVItem();
        });

        this.#buttonUndo.addEventListener('click', () => {
            this.#updateStatus({forceSaveable: false, forceUndoable: false});

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
            this.#updateStatus();
        });

        if (addInputToList)
            this.#inputsCSV.push(itemInput);
        
        itemButton.addEventListener('click', () => {
            this.#inputsCSV = this.#inputsCSV.filter(
                input => input !== itemInput
            );
            listItem.remove();

            this.#currentValue = this.#getCSVString();
            this.#hasChangedValue = this.#currentValue !== this.#startingValue;
            this.#isValid = this.#fieldset.checkValidity();
            this.#updateStatus();
        });
    }

    /** @param {{ forceSaveable?: boolean, forceUndoable?: boolean}} force */
    #updateStatus({forceSaveable, forceUndoable} = {}) {
        if (typeof forceSaveable === 'boolean')
            this.#saveable.setValue(forceSaveable);
        else
            this.#saveable.setValue(
                this.#isValid
                && (!this.#currentUseDefault || this.#hasChangedChecked )
                && (this.#currentUseDefault || this.#hasChangedValue)
            );

        if (typeof forceUndoable === 'boolean')
            this.#undoable.setValue(forceUndoable);
        else
            this.#undoable.setValue(!this.#currentUseDefault && this.#hasChangedValue);
            
    }
}

customElements.define('config-field-component', ConfigFieldComponent);