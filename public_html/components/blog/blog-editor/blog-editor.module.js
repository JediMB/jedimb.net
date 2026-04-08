import BlogFormComponent from "/js/components/blog/blog-form/blog-form.module.js";

export default class BlogEditorComponent extends HTMLElement {
    #scheduledTimeout = { id: null };

    /** @type {HTMLFormElement} */ #form;
    /** @type {BlogFormComponent} */ #blogForm;
    /** @type {BlogFormComponent} */
    /** @type {HTMLInputElement} */ #scheduledDate;
    /** @type {HTMLInputElement} */ #scheduledTime;

    constructor() { super(); }

    connectedCallback() {
        this.#blogForm = this.querySelector('#blog-editor__editor');

        const options = this.querySelector('blog-editor-options');
        const tglScheduled = options.querySelector('#blog-editor__toggle-schedule');
        this.#scheduledDate = options.querySelector('#blog-editor__scheduled-date');
        this.#scheduledTime = options.querySelector('#blog-editor__scheduled-time');

        const buttons = this.querySelector('edit-buttons');
        const btnCancel = buttons.querySelector('#blog-editor__btn-cancel');
        const btnPublish = buttons.querySelector('#blog-editor__btn-publish');
        /** @type {HTMLButtonElement} */
        const btnSave = buttons.querySelector('#blog-editor__btn-save');

        this.#form = btnSave.form;

        tglScheduled.addEventListener('change', event => {
            const isScheduled = tglScheduled.checked;

            this.#scheduledDate.toggleAttribute('required', isScheduled);
            this.#scheduledDate.toggleAttribute('hidden', !isScheduled);
            this.#scheduledTime.toggleAttribute('required', isScheduled);
            this.#scheduledTime.toggleAttribute('hidden', !isScheduled);
            btnPublish.textContent = isScheduled ? btnPublish.dataset.contentSchedule : btnPublish.dataset.contentPublish;

            this.#updateDateTimeFields(isScheduled);
        });
        
        if (tglScheduled.checked) {
            const dateTime = [ this.#scheduledDate.value, this.#scheduledTime.value ];
            this.#scheduledDate.defaultValue = '';
            this.#scheduledTime.defaultValue = '';
            [ this.#scheduledDate.value, this.#scheduledTime.value ] = dateTime;
            btnPublish.textContent = btnPublish.dataset.contentSchedule;

            this.#updateDateTimeFields(true);
        }

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
        const formData = this.#blogForm.getFormData();

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

    /**
     * @param {boolean} isScheduled
     */
    #updateDateTimeFields(isScheduled) {
        const dateInput = this.#scheduledDate;
        const timeInput = this.#scheduledTime;

        if (!isScheduled) {
            this.#blogForm.setPermadate();
            clearTimeout(this.#scheduledTimeout.id);
            return;
        }

        const recursiveLogic = (scheduledTimeout) => {
            const now = new Date();
            
            const minTime = new Date(now.getTime() + 900000);
            const followingHour = new Date(minTime.getTime() + 3600000);
            const targetDateValue = `${followingHour.getFullYear()}-${`${followingHour.getMonth() + 1}`.padStart(2, '0')}-${`${followingHour.getDate()}`.padStart(2, '0')}`;

            timeInput.min = `${minTime.getHours()}:${`${minTime.getMinutes()}`.padStart(2, '0')}`;
            dateInput.min = targetDateValue;

            const defaultTimeValue = `${followingHour.getHours()}:00`;

            if (isScheduled
                && timeInput.value
                && timeInput.value === timeInput.defaultValue
                && timeInput.defaultValue !== defaultTimeValue) {
                    console.log('Ding!'); // TODO: Notification
            }

            timeInput.defaultValue = defaultTimeValue;
            dateInput.defaultValue = targetDateValue;

            this.#blogForm.setPermadate(dateInput.value.replaceAll('-', '/'));

            scheduledTimeout.id = setTimeout(recursiveLogic, 60000, scheduledTimeout);
        }

        recursiveLogic(this.#scheduledTimeout);
    }
}

customElements.define('blog-editor-component', BlogEditorComponent);