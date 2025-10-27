import Configuration from "/js/models/configuration.model.js";
import formValidationService from "/js/services/form-validation.service.js";

export { configField as default };

class ConfigField {
    #components;
    #onChanges = [];

    constructor() {
        const components = Array.from(document.querySelectorAll('config-field-component'));
        this.#components = components;

        const textFields = components.map(c => c.querySelector('input[type="text"]'));
        const toggles = components.map(c => c.querySelector('input[type="checkbox"]'));
        const errorContainers = components.map(c => c.querySelector('[input-errors]'));
        const restoreButtons = components.map(c => c.querySelector('button[restore-input]'));
        
        components.forEach((component, key) => {
            const textField = textFields[key];
            const restoreButton = restoreButtons[key];
            const toggle = toggles[key];
            const errorContainer = errorContainers[key];

            toggle.addEventListener('change', () => {
                const isDefault = toggle.checked;

                textField.disabled = isDefault;
                textField.value = isDefault
                    ? textField.dataset.defaultValue
                    : textField.dataset.originalValue;

                const textChanges = !isDefault && this.#hasNewValue(textField);
                const hasChanges = textChanges || this.#hasNewValue(toggle);

                if (isDefault)
                    errorContainer.innerHTML = '';

                if (textChanges)
                    formValidationService.validateField(textField, errorContainer);

                restoreButton.classList.toggle('hidden', !textChanges);
                component.toggleAttribute('has-changes', hasChanges);

                this.#emitChanges(
                    components.some(c => c.hasAttribute('has-changes'))
                    && textFields.every(t => t.checkValidity())
                );
            });

            textField.addEventListener('input', () => {
                textField.dataset.inputValue = textField.value;

                const hasChanges = this.#hasNewValue(textField);
                restoreButton.classList.toggle('hidden', !hasChanges);
                component.toggleAttribute('has-changes', hasChanges);
                
                this.#emitChanges(
                    components.some(c => c.hasAttribute('has-changes'))
                    && textFields.every(t => t.checkValidity())
                );
            });

            textField.addEventListener('change', () => { formValidationService.validateField(textField, errorContainer); });

            restoreButton.addEventListener('click', event => {
                event.preventDefault();
                textField.value = textField.dataset.originalValue;
                textField.dataset.inputValue = textField.value;
                restoreButton.classList.add('hidden');

                const hasChanges = this.#hasNewValue(toggle);
                component.toggleAttribute('has-changes', hasChanges);
                this.#emitChanges(
                    components.some(c => c.hasAttribute('has-changes'))
                    && textFields.every(t => t.checkValidity())
                );
            });

            component.removeAttribute('style');
        });
    }

    #emitChanges(hasValidChanges) {
        this.#onChanges.forEach(func => func.call(this, hasValidChanges));
    }

    async getChanges() {
        return this.#components
            .filter(c => c.hasAttribute('has-changes'))
            .map(c => {
                const id = Number(c.querySelector('input[type="hidden"]').value);
                const textBox = c.querySelector('input[type="text"]');

                if (id < 1)
                    return new Configuration({
                        id: 0,
                        name: textBox.dataset.constant,
                        value: textBox.value,
                        isActive: true
                    });

                const toggle = c.querySelector('input[type="checkbox"]');

                const data = { id: id, name: textBox.dataset.constant };

                if (toggle.checked !== Boolean(toggle.dataset.originalValue))
                    data.isActive = !toggle.checked;

                if (!toggle.checked && textBox.value !== textBox.dataset.originalValue)
                    data.value = textBox.value;
                
                return new Configuration(data);
            });
    }

    #hasNewValue(inputElement) {
        const originalValue = inputElement.dataset.originalValue;

        switch (inputElement.getAttribute('type')) {
            case 'text':
                return inputElement.value !== originalValue;
            case 'checkbox':
                return inputElement.checked !== Boolean(originalValue);
            default:
                throw new Error('Input type not implemented!');
        }
    }

    onChanges(func) {
        if (typeof func === 'function')
            this.#onChanges.push(func);
    }
}
const configField = new ConfigField();