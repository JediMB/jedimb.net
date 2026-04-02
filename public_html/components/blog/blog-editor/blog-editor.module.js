import { TextEditorComponent } from "/js/components/text-editor/text-editor.module.js";
import Emitter from "/js/utilities/emitter.js";

export default class BlogEditorComponent extends HTMLElement {
    #isLoaded = Object.freeze(new Emitter(false));
    #isValid = Object.freeze(new Emitter(false));

    /** @type {HTMLInputElement[]} */ #inputsToValidate;

    /** @type {HTMLFormElement} */ #form;
    /** @type {HTMLElement} */ #permadate;
    /** @type {TextEditorComponent} */ #textEditor;

    constructor() { super(); }

    connectedCallback() {
        const formId = this.getAttribute('form-id');
        if (!formId)
            throw new Error('No form-id attribute provided');

        this.#form = this.querySelector(`#${formId}`);
        const inputs = this.#form.elements;

        this.#permadate = this.querySelector(`#${formId}__permadate`);
        this.#textEditor = this.querySelector(`#${formId}__text-editor`);
        this.#form.onreset = () => this.#textEditor.content.reset();

        inputs['title'].addEventListener('input', () => inputs['permalink'].defaultValue = this.#formatPermalinkTitle(inputs['title'].value));
        inputs['title'].addEventListener('change', () => inputs['title'].value = inputs['title'].value.trim());

        this.#inputsToValidate = [
            inputs['title'],
            inputs['description'],
            inputs['mastolink']
        ];

        if (!inputs['isPublished']) {
            inputs['permalink']?.addEventListener('change', () => inputs['permalink'].value = this.#formatPermalinkTitle(inputs['permalink'].value));
            this.querySelector(`#${formId}__reset-permalink`).addEventListener('click', () => inputs['permalink'].value = inputs['permalink'].defaultValue);
            this.#inputsToValidate.push(inputs['permalink']);
        }

        for (const field of this.#inputsToValidate) {
            field.addEventListener('input', () => this.#validation());
        }
        this.#textEditor.content.onChange = () => this.#validation();

        this.#isLoaded.setValue(true);
    }

    connectedMoveCallback() {}

    disconnectedCallback() {}

    /** @param {{ required: boolean, tooShort: boolean, tooLong: boolean, mismatch: boolean }[]} errors  */
    error(errors) {
        for (const input of this.#form.elements) {
            const error = errors[input.name];

            if (!error) {
                if (!input.classList.length)
                    continue;

                input.classList.remove('error-required');
                input.classList.remove('error-too-short');
                input.classList.remove('error-too-long');
                input.classList.remove('error-mismatch');
                continue;
            }

            input.classList.toggle('error-required', !!error.required);
            input.classList.toggle('error-too-short', !!error.tooShort);
            input.classList.toggle('error-too-long', !!error.tooLong);
            input.classList.toggle('error-mismatch', !!error.mismatch);
        }
    }

    get formData() {
        const content = this.#textEditor.content.html;
        this.#form.elements['contentShort'].value = content.short;
        this.#form.elements['contentRest'].value = content.rest;

        return new FormData(this.#form);
    }

    get isValid() { return this.#isValid; }

    /** @param {() => void} func  */
    onLoaded(func) {
        if (typeof func !== 'function')
            throw new Error('onLoaded argument is not a function');

        if (this.#isLoaded.getValue()) {
            func.call(this);
            return;
        }

        this.#isLoaded.first(func);
    }

    /** @param {(event) => void} func  */
    onSubmit(func) {
        this.#form.addEventListener('submit', func);
    }

    reset() {
        if (this.#form.elements['permalink'])
            this.#form.elements['permalink'].defaultValue = '';
        
        this.#form.reset();

        for (const input of this.#form.elements) {
            if (!input.classList.length)
                continue;

            input.classList.remove('error-required');
            input.classList.remove('error-too-short');
            input.classList.remove('error-too-long');
            input.classList.remove('error-mismatch');
        }
    }

    /** 
     * Set the permadate text to a provided string, or its default value
     * @param {string} value 
     */
    setPermadate(value = undefined) {
        value ??= this.#permadate.dataset.default;

        this.#permadate.textContent = value;
    }

    /**
     * @param {string} input 
     * @returns {string}
     */
    #formatPermalinkTitle(input) {
        return input.toLowerCase()
                .replaceAll(/\s/g, '-')
                .replaceAll(/[^\-a-z0-9]+/g, '')
                .replaceAll(/\-{2,}/g, '')
                .replaceAll(/(^\-)|(\-$)/g, '');
    }

    #validation() {
        const textEditorValid = this.#textEditor.content.text.length || this.#textEditor.content.media.length;

        const isValid = textEditorValid
            && this.#inputsToValidate.every(input => input.checkValidity());

        this.#isValid.setValue(isValid);
    }
}

customElements.define('blog-editor-component', BlogEditorComponent);