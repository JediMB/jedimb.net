import Configuration from "/js/models/configuration.model.js";

export { configCSV as default };

class ConfigCSV {
    #components;

    constructor() {
        const components = Array.from(document.querySelectorAll('config-csv-component'));
        this.#components = components;

        const addButtons = components.map(c => c.querySelector('button[btn-add]'));
        const textFieldCollections = components.map(c => c.querySelectorAll('input[type="text"]'));
        const deleteButtonCollections = components.map(c => c.querySelectorAll('button[btn-delete]'));

        components.forEach((component, key) => {
            component.dataset.fields = textFieldCollections[key].length;

            addButtons[key].addEventListener('click', () => {
                this.#addItem(component);
            });

            deleteButtonCollections[key].forEach(btn => {
                btn.addEventListener('click', event => this.#deleteItem(event, btn));
            });

            component.removeAttribute('style');
        });
    }

    #addItem(component) {
        const template = component.querySelector('template');
        const itemNumber = Number(component.dataset.fields);

        const newItem = template.content.cloneNode(true);
        const textBox = newItem.querySelector('input[type="text"]');
        textBox.id = textBox.id.replace('template', `${itemNumber}`);

        const deleteButton = newItem.querySelector('button[btn-delete]');
        deleteButton.addEventListener('click', event => {
            this.#deleteItem(event, deleteButton);
        });
        
        template.parentNode.appendChild(newItem);

        component.dataset.fields = itemNumber + 1;
    }

    #deleteItem(event, button) {
        event.preventDefault();

        if (event.shiftKey)
            button.parentNode.remove();
        else
            alert('Hold shift when clicking to delete item.');
    }
}
const configCSV = new ConfigCSV();