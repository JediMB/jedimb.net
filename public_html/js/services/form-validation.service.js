export { formValidationService as default };

class FormValidationService {
    onChange(field) {
        const errorContainer = field.nextElementSibling;
        const hasErrorContainer = !!errorContainer?.hasAttribute('input-errors');

        const validityState = field.validity;

        if (validityState.valid)
            return true;

        if (!hasErrorContainer)
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

    onInput(field, collection, button) {
        const errorContainer = field.nextElementSibling;
        const hasErrors = (
            errorContainer?.hasAttribute('input-errors')
            && errorContainer.children.length > 0
        );

        let isValid = field.checkValidity();

        if (!isValid) {
            button.disabled = true;
            return false;
        }

        if (hasErrors)
            errorContainer.innerHTML = '';

        isValid = collection.every(input => input.checkValidity());

        button.disabled = !isValid;
        return isValid;
    }

    #addErrorMessage(container, message) {
        const newError = document.createElement('div');
        newError.classList.add('error');
        newError.innerHTML = message;
        container.appendChild(newError);
    }
}
const formValidationService = new FormValidationService();