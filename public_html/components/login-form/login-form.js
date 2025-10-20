import sessionService from '/js/services/session.service.js';

class LoginForm {
    #sessionService = sessionService;

    #form;
    #inputs;
    #loginButton;
    #errorContainer;

    constructor() {
        const component = document.querySelector('login-form-container');
        const form = component.querySelector('#form-login');
        this.#form = form;

        this.#inputs = form.querySelectorAll('[pattern]');
        this.#loginButton = form.querySelector('[type="submit"]');
        this.#errorContainer = component.querySelector('#login-errors');

        let disableInput = false;
        this.#inputs.forEach(input => {
            if (!input.checkValidity())
                disableInput = true;

            input.addEventListener('input', () => this.#validateForm(input, 'input'));
            input.addEventListener('change', () => this.#validateForm(input, 'change'));
        });
        this.#loginButton.disabled = disableInput;

        form.addEventListener("submit", (event) => {
            event.preventDefault();
            this.login();
        });
    }

    #addErrorMessage(element, message) {
        const newError = document.createElement('div');
        newError.classList.add('error');
        newError.innerHTML = message;
        element.appendChild(newError);
    }

    #clearErrorStatus(inputField) {
        inputField.classList.remove('error');

        if (inputField.nextElementSibling?.hasAttribute('input-error'))
            inputField.nextElementSibling.innerHTML = '';
    }

    async login() {
        this.#loginButton.disabled = true;
        this.#errorContainer.textContent = '';
        const formData = new FormData(this.#form);

        const response = await this.#sessionService.login(formData);

        if (response.success) {
            this.#form.reset();
            return;
        }

        this.#errorContainer.innerHTML = '';
        response.errors.forEach(error => this.#addErrorMessage(this.#errorContainer, error));
    }

    #updateErrorStatus(inputField) {
        inputField.classList.add('error');
            
        if (inputField.nextElementSibling?.hasAttribute('input-error')) {
            inputField.nextElementSibling.textContent = '';
            
            if (inputField.validity.tooShort)
                this.#addErrorMessage(inputField.nextElementSibling, inputField.dataset.tooShort);
            else if (inputField.validity.tooLong)
                this.#addErrorMessage(inputField.nextElementSibling, inputField.dataset.tooLong);
            if (inputField.validity.patternMismatch)
                this.#addErrorMessage(inputField.nextElementSibling, inputField.dataset.mismatch);
        }
    }

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
const loginForm = new LoginForm();