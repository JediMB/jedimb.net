export { formValidationService as default };

class FormValidationService {
    validateField(field, errorContainer = null) {
        const validityState = field.validity;

        if (validityState.valid)
            return true;

        if (!errorContainer)
            return false;

        errorContainer.innerHTML = '';

        if (validityState.valueMissing)
            return !!this.#addErrorMessage(errorContainer, field.dataset.errorValueMissing ?? null);
        
        if (validityState.tooShort)
            this.#addErrorMessage(errorContainer, field.dataset.errorTooShort ?? null);
        else if (validityState.tooLong)
            this.#addErrorMessage(errorContainer, field.dataset.errorTooLong ?? null);

        if (validityState.patternMismatch)
            return !!this.#addErrorMessage(errorContainer, field.dataset.errorPatternMismatch ?? null);

        return false;
    }

    #addErrorMessage(container, message) {
        const newError = document.createElement('div');
        newError.classList.add('error');
        newError.innerHTML = message;
        container.appendChild(newError);
    }
}
const formValidationService = new FormValidationService();