export class InputFileElement extends HTMLElement {
    /** @type {InputFileElement} */
    #self;
    #buttonAttributes = [ 'title' ];
    #fileInputAttributes = [ 'name', 'accept', 'required' ];
    /** @type {HTMLInputElement} */
    #input;

    constructor() {
        const component = super();
        this.#self = component;
    }

    connectedCallback() {
        const self = this.#self;
        const shadow = self.attachShadow({ mode: 'open' });
        const text = self.textContent;
        self.textContent = '';

        const input = document.createElement('input');
        this.#input = input;
        input.type = 'file';
        input.style.display = 'none';
        for (const attribute of this.#fileInputAttributes)
            self.hasAttribute(attribute) && input.setAttribute(attribute, self.getAttribute(attribute));

        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = text;
        for (const attribute of this.#buttonAttributes) {
            self.hasAttribute(attribute) && button.setAttribute(attribute, self.getAttribute(attribute));
            self.removeAttribute(attribute);
        }
        button.addEventListener('click', () => input.click());

        self.appendChild(input);
        shadow.appendChild(button);
    }

    disconnectedCallback() {}

    connectedMoveCallback() {}

    /** @returns {FileList} */
    get files() { return this.#input.files; }

    /** @returns {string} */
    get value() { return this.#input.value; }

    /** @returns {string} */
    get defaultValue() { return this.#input.defaultValue; }

    /** @returns {boolean} */
    checkValidity() { return this.#input.checkValidity(); }
}

customElements.define('input-file', InputFileElement);