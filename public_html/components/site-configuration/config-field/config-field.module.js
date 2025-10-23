export { configField as default };

class ConfigField {
    #textFields = [];

    constructor() {
        const components = Array.from(document.querySelectorAll('config-field-component'));
        this.#textFields = components.map(component => component.querySelector('input[type="text"]'));
        const toggles = components.map(component => component.querySelector('input[type="checkbox"]'));
        
        this.#textFields.forEach((textField, key) => {
            const toggle = toggles[key];

            toggle.addEventListener('change', event => {
                const isChecked = event.target.checked;

                textField.value = isChecked ? textField.dataset.defaultValue : textField.dataset.inputValue;

                textField.disabled = event.target.checked;
            });

            textField.addEventListener('input', event => {
                textField.dataset.inputValue = textField.value;
            });
        });
    }

    getTextFields() { return this.#textFields; }
}
const configField = new ConfigField();