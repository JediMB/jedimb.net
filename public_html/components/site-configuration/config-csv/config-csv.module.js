import Configuration from "/js/models/configuration.model.js";

export { configCSV as default };

// TODO: Export configuration object

class ConfigCSV {
    #components;
    #textFieldCollections;
    #stringFields;

    #onChanges = [];

    constructor() {
        const components = Array.from(document.querySelectorAll('config-csv-component'));
        this.#components = components;

        const defaultValues = components.map(c => c.querySelector('default-value'));
        const fieldsets = components.map(c => c.querySelector('fieldset'));
        this.#stringFields = components.map(c => this.#findStringField({ at: c }));
        const addButtons = components.map(c => this.#findAddButton({ at: c }));
        this.#textFieldCollections = components.map(c => this.#findTextField({ at: c, all: true }));
        const deleteButtonCollections = components.map(c => this.#findDeleteButton({ at: c, all: true }));

        const toggles = components.map(c => c.querySelector('[default-toggle'));

        components.forEach((component, key) => {
            component.dataset.fields = this.#textFieldCollections[key].length;

            toggles[key].addEventListener('change', () => {
                const isDefault = toggles[key].checked;

                if (isDefault) {
                    defaultValues[key].removeAttribute('style');
                    defaultValues[key].nextElementSibling.style.display = 'none';
                }
                else {
                    defaultValues[key].style.display = 'none';
                    defaultValues[key].nextElementSibling.removeAttribute('style');
                }
                
                fieldsets[key].disabled = isDefault;

                const textChanges = !isDefault && this.#hasNewValue(this.#stringFields[key]);
                const hasChanges = textChanges || this.#hasNewValue(toggles[key]);
                component.toggleAttribute('has-changes', hasChanges);

                this.#emitChanges(this.#hasValidChanges());
            });

            addButtons[key].addEventListener('click', () => {
                this.#addItem(key);
            });

            this.#textFieldCollections[key].forEach(field => this.#addEventListeners(field, key));

            deleteButtonCollections[key].forEach(btn => {
                btn.addEventListener('click', event => this.#deleteItem(event, key));
            });

            component.removeAttribute('style');
        });
    }

    #addEventListeners(field, key) {
        const component = this.#components[key];

        field.addEventListener('input', () => {
            this.#findAddButton({ at: component }).disabled = this.#isInvalid(key);
            this.#findStringField({ at: component }).value = this.#textFieldCollections[key].map(f => f.value).join(', ');
            component.toggleAttribute('has-changes', this.#hasNewValue(this.#stringFields[key]));
            this.#findAddButton({ at: component }).disabled = this.#isInvalid(key);
            this.#emitChanges(this.#hasValidChanges());
        });

        field.addEventListener('change', () => {
            field.value = field.value.toLocaleLowerCase();
            this.#findStringField({ at: component }).value = this.#textFieldCollections[key].map(f => f.value).join(', ');
            this.#emitChanges(this.#hasValidChanges());
        });
    }

    #addItem(key) {
        const component = this.#components[key];
        this.#findAddButton({ at: component }).disabled = true;

        const template = component.querySelector('template');
        const itemNumber = Number(component.dataset.fields);

        const newItem = template.content.cloneNode(true);
        const textField = this.#findTextField({ at: newItem });
        textField.id = textField.id.replace('template', `${itemNumber}`);
        this.#addEventListeners(textField, key);

        const deleteButton = this.#findDeleteButton({ at: newItem });
        deleteButton.addEventListener('click', event => {
            this.#deleteItem(event, key);
        });
        
        template.parentNode.appendChild(newItem);
        this.#textFieldCollections[key].push(textField);
        textField.focus();

        component.dataset.fields = itemNumber + 1;
        
        this.#emitChanges(this.#hasValidChanges());
    }

    #deleteItem(event, key) {
        event.preventDefault();

        if (event.shiftKey) {
            let item = event.target;
            while (item.localName !== 'li') {
                item = item.parentNode;
            }
            const field = this.#findTextField({ at: item });
            this.#textFieldCollections[key] = this.#textFieldCollections[key].filter(f => f !== field);
            this.#stringFields[key].value = this.#textFieldCollections[key].map(f => f.value).join(', ');

            item.remove();

            this.#emitChanges(this.#hasValidChanges());
        }
        else
            alert('Hold shift when clicking to delete item.');
    }

    #emitChanges([hasChanges, isValid]) {
        this.#onChanges.forEach(func => func.call(this, hasChanges, isValid));
    }

    #findAddButton({ at, all = false }) {
        return this.#findQuery(at, '[btn-add]', all)
    }

    #findDeleteButton({ at, all = false }) {
        return this.#findQuery(at, '[btn-delete]', all)
    }

    #findStringField({ at, all = false }) {
        return this.#findQuery(at, '[input-string]', all);
    }

    #findTextField({ at, all = false }) {
        return this.#findQuery(at, '[text-item]', all);
    }

    #findQuery(container, query, findAll) {
        if (findAll)
            return Array.from(container.querySelectorAll(query));

        return container.querySelector(query);
    }

    async getChanges() {
        return this.#components
            .filter(c => c.hasAttribute('has-changes'))
            .map(c => {
                const id = Number(c.querySelector('[config-id]').value.trim());
                const stringField = this.#findStringField({ at: c });

                if (id < 0)
                    return new Configuration({
                        id: 0,
                        name: stringField.dataset.constant.trim(),
                        value: stringField.value.trim(),
                        isActive: true
                });

                const toggle = c.querySelector('[default-toggle]');

                const data = { id: id, name: stringField.dataset.constant.trim() };

                if (toggle.checked !== Boolean(toggle.dataset.originalValue))
                    data.isActive = !toggle.checked;

                if (!toggle.checked && this.#hasNewValue(stringField))
                    data.value = stringField.value.trim();

                return new Configuration(data);
            });
    }

    #hasNewValue(inputElement) {
        const originalValue = inputElement.dataset.originalValue;

        switch (inputElement.getAttribute('type')) {
            case 'hidden':
                return inputElement.value.trim() !== originalValue.trim();
            case 'checkbox':
                return inputElement.checked !== Boolean(originalValue.trim());
            default:
                throw new Error('Input type not implemented!');
        }
    }

    #hasValidChanges() {
        return [ this.#components.some(c => c.hasAttribute('has-changes')),
            this.#textFieldCollections.every(c => c.every(t => t.checkValidity())) ];
    }

    #isInvalid(key) {
        return this.#textFieldCollections[key].some(f => f.checkValidity() === false);
    }

    onChanges(func) {
        if (typeof func === 'function')
            this.#onChanges.push(func);
    }
}
const configCSV = new ConfigCSV();