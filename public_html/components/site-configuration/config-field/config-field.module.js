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
                    ? textField.dataset.defaultValue.trim()
                    : textField.dataset.inputValue.trim();

                    
                const textChanges = !isDefault && this.#hasNewValue(textField);
                const hasChanges = textChanges || this.#hasNewValue(toggle);

                if (isDefault)
                    errorContainer.innerHTML = '';

                if (textChanges)
                    formValidationService.validateField(textField, errorContainer);

                const isNew = Boolean(toggle.dataset.originalValue.trim());
                restoreButton.classList.toggle('hidden', !textChanges || isNew);
                component.toggleAttribute('has-changes', hasChanges);

                this.#emitChanges(
                    components.some(c => c.hasAttribute('has-changes')),
                    textFields.every(t => t.checkValidity())
                );
            });

            textField.addEventListener('input', () => {
                textField.dataset.inputValue = textField.value.trim();

                const hasChanges = this.#hasNewValue(textField);
                const isNew = Boolean(toggle.dataset.originalValue.trim());
                restoreButton.classList.toggle('hidden', !hasChanges || isNew);
                component.toggleAttribute('has-changes', hasChanges);
                
                this.#emitChanges(
                    components.some(c => c.hasAttribute('has-changes')),
                    textFields.every(t => t.checkValidity())
                );
            });

            textField.addEventListener('change', () => {
                textField.value = textField.value.trim();
                formValidationService.validateField(textField, errorContainer);
            });

            restoreButton.addEventListener('click', event => {
                event.preventDefault();
                const isNew = Boolean(toggle.dataset.originalValue.trim());

                if (isNew)
                    textField.value = textField.dataset.defaultValue.trim();
                else
                    textField.value = textField.dataset.originalValue.trim();
                
                textField.dataset.inputValue = textField.value.trim();
                restoreButton.classList.add('hidden');

                const hasChanges = this.#hasNewValue(toggle);
                component.toggleAttribute('has-changes', hasChanges);
                this.#emitChanges(
                    components.some(c => c.hasAttribute('has-changes')),
                    textFields.every(t => t.checkValidity())
                );
            });

            component.removeAttribute('hidden');
        });
    }

    #emitChanges(hasChanges, isValid) {
        this.#onChanges.forEach(func => func.call(this, hasChanges, isValid));
    }

    async getChanges() {
        return this.#components
            .filter(c => c.hasAttribute('has-changes'))
            .map(c => {
                const id = Number(c.querySelector('input[type="hidden"]').value.trim());
                const textBox = c.querySelector('input[type="text"]');

                if (id < 1)
                    return new Configuration({
                        id: 0,
                        name: textBox.dataset.constant.trim(),
                        value: textBox.value.trim(),
                        isActive: true
                    });

                const toggle = c.querySelector('input[type="checkbox"]');

                const data = { id: id, name: textBox.dataset.constant.trim() };

                if (toggle.checked !== Boolean(toggle.dataset.originalValue))
                    data.isActive = !toggle.checked;

                if (!toggle.checked && this.#hasNewValue(textBox))
                    data.value = textBox.value.trim();
                
                return new Configuration(data);
            });
    }

    #hasNewValue(inputElement) {
        const originalValue = inputElement.dataset.originalValue;

        switch (inputElement.getAttribute('type')) {
            case 'text':
                return inputElement.value.trim() !== originalValue.trim();
            case 'checkbox':
                return inputElement.checked !== Boolean(originalValue.trim());
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