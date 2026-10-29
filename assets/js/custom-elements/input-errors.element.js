import { toCamelCase } from "/js/utilities/string.utility.js";

export default class InputErrorsElement extends HTMLElement {
    static #errorClasses = Object.freeze({
        required: 'error-required',
        tooShort: 'error-too-short',
        tooLong: 'error-too-long',
        mismatch: 'error-mismatch',
        other: 'error-other'
    });

    /** @type {HTMLInputElement} */ #input;
    /** @type {HTMLDivElement} */ #output;

    constructor() { super(); }

    connectedCallback() {
        this.#input = this.querySelector('input');
        this.#output = this.querySelector('.errors');

        if (!this.#input) {
            console.error(`No input element found in InputErrors element: ${this}`);
            return;
        }

        if (!this.#output) {
            this.#output = document.createElement('div');
            this.#output.classList.add('errors');
            this.appendChild(this.#output);
        }
    }

    connectedMoveCallback() {}
    disconnectedCallback() {}

    get name() { return this.#input.name; }

    /** @param {string|string[]|InputErrors} errorData */
    set(errorData) {
        if (typeof errorData === 'string') {
            this.#addErrorMessage(errorData);
            this.#input.classList.add(InputErrorsElement.#errorClasses.other);
            return;
        }

        if (Array.isArray(errorData)) {
            for (const error of errorData) {
                this.#addErrorMessage(error);
                this.#input.classList.add(InputErrorsElement.#errorClasses.other);
            }
            return;
        }

        for (const error in errorData) {
            const errorClass = InputErrorsElement.#errorClasses[error];

            if (!errorClass) {
                console.error('Unsupported error from backend in InputErrors');
                continue;
            }
            
            this.#input.classList.add(errorClass);

            const message = this.#input.dataset[toCamelCase(errorClass, 'kebab')];

            if (message)
                this.#addErrorMessage(message);
        }

    }

    clear() {
        for (const error in InputErrorsElement.#errorClasses)
            this.#input.classList.remove(InputErrorsElement.#errorClasses[error]);
        
        this.#output.textContent = '';
    }

    /** @param {string} text  */
    #addErrorMessage(text) {
        const div = document.createElement('div');
        div.textContent = text;
        this.#output.appendChild(div);
    }
}
customElements.define('input-errors', InputErrorsElement);

/**
 * @typedef InputErrors
 * @type {object}
 * @property {true=} required
 * @property {true=} tooShort
 * @property {true=} tooLong
 * @property {true=} mismatch
 */