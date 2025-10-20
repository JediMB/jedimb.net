class ConfigField {
    constructor() {
        const components = document.querySelectorAll('config-field-component');

        components.forEach(component => {
            const textField = component.querySelector('input[type="text"]');
            const toggle = component.querySelector('input[type="checkbox"]');

            const id = textField.id;

            const defaultField = component.querySelector(`#${id}-default`);
            const valueField = component.querySelector(`#${id}-value`);

            toggle.addEventListener('change', event => {
                const isChecked = event.target.checked;

                textField.value = isChecked ? defaultField.value : valueField.value;

                textField.disabled = event.target.checked;
            });

            textField.addEventListener('input', event => {
                valueField.value = textField.value;
            });
        });
        
    }
}
const configField = new ConfigField();