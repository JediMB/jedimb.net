import sessionService from "/js/services/session.service.js";

export default class AccountMenuComponent extends HTMLElement {
    /** @type {HTMLFormElement} */ #form;
    /** @type {NodeListOf<HTMLInputElement>} */ #inputs;
    /** @type {HTMLButtonElement} */ #loginButton;
    /** @type {HTMLDivElement} */ #errorContainer;

    constructor() { super(); }

    connectedCallback() {
        const toggle = this.querySelector('#account-menu-toggle');
        const accountMenu = this.querySelector('account-menu');
        const menuLoggedOut = accountMenu.querySelector('[menu-logged-out]');
        const menuLoggedIn = accountMenu.querySelector('[menu-logged-in]');
        this.#form = accountMenu.querySelector('form');

        toggle.addEventListener('click', (event) => {
            event.preventDefault();
            accountMenu.toggleAttribute('hidden');
        });

        accountMenu.querySelector('.account-menu__logout').addEventListener('click',
            (event) => {
                event.preventDefault();
                sessionService.logout();
            }
        );

        sessionService.isLoggedIn.subscribe({
            next: value => {
                menuLoggedIn.toggleAttribute('hidden', !value);
                menuLoggedOut.toggleAttribute('hidden', !!value);
            }
        });

        this.#loginFormSetup();
    }

    connectedMoveCallback() {}

    disconnectedCallback() {}

    /**
     * @param {HTMLElement} element 
     * @param {string} message 
     */
    #addErrorMessage(element, message) {
        const newError = document.createElement('div');
        newError.classList.add('error');
        newError.innerHTML = message;
        element.appendChild(newError);
    }

    /** @param {HTMLInputElement} inputField */
    #clearErrorStatus(inputField) {
        inputField.classList.remove('error');

        if (inputField.nextElementSibling?.hasAttribute('input-errors'))
            inputField.nextElementSibling.innerHTML = '';
    }

    async login() {
        this.#loginButton.disabled = true;
        this.#errorContainer.textContent = '';
        const formData = new FormData(this.#form);

        const response = await sessionService.login(formData);

        if (response.success) {
            this.#form.reset();
            return;
        }

        this.#errorContainer.innerHTML = '';
        response.errors.forEach(
            error => this.#addErrorMessage(this.#errorContainer, error)
        );
    }

    #loginFormSetup() {
        const form = this.#form;
        this.#inputs = form.querySelectorAll('[pattern]');
        this.#loginButton = form.querySelector('[type="submit"]');
        this.#errorContainer = form.querySelector('#login-errors');

        let disableInput = false;
        this.#inputs.forEach(input => {
            if (!input.checkValidity())
                disableInput = true;

            input.addEventListener('input', () => this.#validateForm(input, 'input'));
            input.addEventListener('change', () => this.#validateForm(input, 'change'));
        });
        this.#loginButton.disabled = disableInput;

        form.addEventListener('submit', (event) => {
            event.preventDefault();
            this.login();
        });
    }

    /** @param {HTMLInputElement} inputField */
    #updateErrorStatus(inputField) {
        inputField.classList.add('error');

        if (inputField.nextElementSibling?.hasAttribute('input-errors')) {
            inputField.nextElementSibling.textContent = '';

            if (inputField.validity.tooShort)
                this.#addErrorMessage(inputField.nextElementSibling, inputField.dataset.tooShort);
            else if (inputField.validity.tooLong)
                this.#addErrorMessage(inputField.nextElementSibling, inputField.dataset.tooLong);
            if (inputField.validity.patternMismatch)
                this.#addErrorMessage(inputField.nextElementSibling, inputField.dataset.mismatch);
        }
    }

    /**
     * @param {HTMLInputElement} source 
     * @param {'change'|'input'} eventType 
     */
    #validateForm(source, eventType) {
        let isValid = true;

        this.#inputs.forEach(input => {
            if (input.checkValidity()) {
                if (eventType === 'input' && input === source)
                    this.#clearErrorStatus(input);

                return;
            }

            if (eventType === 'change' && input === source)
                this.#updateErrorStatus(input);

            isValid = false;
        });

        this.#loginButton.disabled = !isValid;
    }
}

customElements.define('account-menu-component', AccountMenuComponent);
