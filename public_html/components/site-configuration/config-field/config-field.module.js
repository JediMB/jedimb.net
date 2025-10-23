export { configField as default };

class ConfigField {
    constructor() {
        const components = document.querySelectorAll('config-field-component');

        components.forEach(component => {
            const textField = component.querySelector('input[type="text"]');
            const toggle = component.querySelector('input[type="checkbox"]');

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
}
const configField = new ConfigField();