export default class ConfigFieldComponent extends HTMLElement {
    /** @type {HTMLInputElement} */ #input;
    /** @type {HTMLButtonElement} */ #buttonSave;
    /** @type {HTMLButtonElement} */ #buttonUndo;
    /** @type {HTMLUListElement} */ #listCSV;
    /** @type {HTMLInputElement[]|undefined} */ #inputsCSV;
    /** @type {HTMLInputElement} */ #toggleDefault;

    constructor() { super(); }

    connectedCallback() {
        const inputRow = this.querySelector('input-row');

        this.#input = inputRow.querySelector('[input-config]');

        const listCSV = this.querySelector('[list-csv]');
        this.#listCSV = listCSV;
        if (listCSV)
            this.#inputsCSV = Array.from(listCSV.querySelectorAll('[input-csv'));

        this.#buttonSave = inputRow.querySelector('[btn-save');
        this.#buttonUndo = inputRow.querySelector('[btn-undo]');

        this.#toggleDefault = this.querySelector('[toggle-default]');

        this.#setup();
    }

    connectedMoveCallback() {}

    disconnectedCallback() {}

    #setup() {
        if (this.#inputsCSV)
            this.#toggleDefault.addEventListener('change', event => {
                const isDefault = event.currentTarget.checked;
                this.#input.hidden = !isDefault;
                this.#input.disabled = isDefault;
                this.#listCSV.hidden = isDefault;
            });
        else
            this.#toggleDefault.addEventListener('change', event => {
                const isDefault = event.currentTarget.checked;
                this.#input.disabled = isDefault;
            });
    }
}

customElements.define('config-field-component', ConfigFieldComponent);
