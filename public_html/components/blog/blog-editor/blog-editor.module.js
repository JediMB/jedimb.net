export default class BlogEditorComponent extends HTMLElement {
    #form;

    constructor() { super(); }

    connectedCallback() {
        const editButtons = this.querySelector('edit-buttons');

        const btnCancel = editButtons.querySelector('#blog-editor__btn-cancel');
        const btnPublish = editButtons.querySelector('#blog-editor__btn-publish');

        /** @type {HTMLButtonElement} */
        const btnSave = editButtons.querySelector('#blog-editor__btn-save');

        this.#form = btnSave.form;

        btnCancel.addEventListener('click', event => {
            event.preventDefault();
            this.#cancel();
        });

        btnPublish?.addEventListener('click', event => {
            event.preventDefault();
            this.#publish();
        });

        btnSave.addEventListener('click', event => {
            event.preventDefault();
            this.#save();
        });

        btnCancel.disabled = false;
        if (btnPublish)
            btnPublish.disabled = false;
    }

    connectedMoveCallback() {}

    disconnectedCallback() {}


    #cancel() {
        const formData = new FormData(this.#form);

        if (formData.has('isPublished'))
            window.location.assign(formData.get('isPublished'));
        else
            window.location.assign('/');
    }

    #publish() {
        // Save changes and either publish or schedule publishing
    }

    #save() {
        // Save changes but don't change its publishedOn value
    }
}

customElements.define('blog-editor-component', BlogEditorComponent);