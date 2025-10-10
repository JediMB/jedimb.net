import UserApiService from '/js/services/api/user-api.service.js';

export class LoginForm {
    #userApiService;

    #form;
    #inputs;
    #loginButton;
    #errorContainer;

    #cookieKeys;

    constructor(component = document.querySelector('login-form-container')) {
        this.#userApiService = new UserApiService(); // Should use singleton implementation?

        const form = component.querySelector('#form-login');
        this.#form = form;

        this.#inputs = form.querySelectorAll('[pattern]');
        this.#loginButton = form.querySelector('[type="submit"]');
        this.#errorContainer = component.querySelector('#login-errors');

        this.#cookieKeys = [
            document.querySelector('meta[name="cookie-user-key"]').content,
            document.querySelector('meta[name="cookie-token-key"]').content,
            document.querySelector('meta[name="cookie-validator-key"]').content
        ];

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

        const response = await this.#userApiService.login(formData);

        if (!response.success) {
            this.#errorContainer.innerHTML = '';
            response.errors.forEach(error => this.#addErrorMessage(this.#errorContainer, error));
            return;
        }

        if (response.value.token) {
            const { userId, token, validator, expiresOn } = response.value;
            const expires = expiresOn.toUTCString();
            document.cookie = `${this.#cookieKeys[0]}=${userId}; expires=${expires};`
            document.cookie = `${this.#cookieKeys[1]}=${token}; expires=${expires};`
            document.cookie = `${this.#cookieKeys[2]}=${validator}; expires=${expires};`;
        }

        // TODO: Let the site know the user is logged in
        return;
    }

    #updateErrorStatus(inputField) {
        inputField.classList.add('error');
            
        if (inputField.nextElementSibling?.hasAttribute('input-error')) {
            inputField.nextElementSibling.textContent = '';
            
            if (inputField.validity.tooShort)
                addErrorMessage(inputField.nextElementSibling, inputField.dataset.tooShort);
            else if (inputField.validity.tooLong)
                addErrorMessage(inputField.nextElementSibling, inputField.dataset.tooLong);
            if (inputField.validity.patternMismatch)
                addErrorMessage(inputField.nextElementSibling, inputField.dataset.mismatch);
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

            this.#loginButton.disabled = !isValid;
        });
    }
}
const loginForm = new LoginForm();