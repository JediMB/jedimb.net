import { TextEditorComponent } from "/js/components/text-editor/text-editor.module.js";
import BlogPost from "/js/models/blog/blog-post.model.js";
import Emitter from "/js/utilities/emitter.js";

export default class BlogFormComponent extends HTMLElement {
    #isPublished = false;
    #publishedPath = ''
    #scheduledTimeout = { id: null };

    #isLoaded = Object.freeze(new Emitter(false));
    #isChanged = Object.freeze(new Emitter(false));
    #isScheduled = Object.freeze(new Emitter(false));
    #isValid = Object.freeze(new Emitter(false));

    /** @type {HTMLInputElement[]} */ #textInputs;
    /** @type {HTMLInputElement[]} */ #nonScheduleOptions;

    /** @type {HTMLFormElement} */ #form;
    /** @type {HTMLElement} */ #permadate;
    /** @type {TextEditorComponent} */ #textEditor;

    constructor() { super(); }

    connectedCallback() {
        const formId = this.getAttribute('form-id');
        if (!formId)
            throw new Error('No form-id attribute provided');

        this.#form = this.querySelector(`#${formId}`);
        const inputs = this.#form.elements;

        this.#permadate = this.querySelector(`#${formId}__permadate`);
        this.#textEditor = this.querySelector(`#${formId}__text-editor`);
        this.#form.onreset = () => this.#textEditor.content.reset();

        inputs['title'].addEventListener('input', () => inputs['permalink'].defaultValue = this.#formatPermalinkTitle(inputs['title'].value));
        inputs['title'].addEventListener('change', () => inputs['title'].value = inputs['title'].value.trim());

        this.#textInputs = [
            inputs['title'],
            inputs['description'],
            inputs['mastolink']
        ];

        inputs['isPinned'].addEventListener('change', () => this.#isChanged.setValue(true));

        this.#isPublished = !!inputs['isPublished'];

        if (this.#isPublished) {
            this.#publishedPath = inputs['isPublished'].value;
            inputs['isHidden'].addEventListener('change', () => this.#isChanged.setValue(true));
        }
        else {
            inputs['permalink']?.addEventListener('change', () => 
                inputs['permalink'].value = this.#formatPermalinkTitle(inputs['permalink'].value)
            );
            this.querySelector(`#${formId}__reset-permalink`).addEventListener('click', () => inputs['permalink'].value = inputs['permalink'].defaultValue);
            
            this.#textInputs.push(
                inputs['permalink'],
                inputs['scheduledDate'],
                inputs['scheduledTime']
            );

            inputs['isScheduled'].addEventListener('change', () => {
                const isScheduled = inputs['isScheduled'].checked;

                inputs['scheduledDate'].toggleAttribute('disabled', !isScheduled);
                inputs['scheduledDate'].toggleAttribute('hidden', !isScheduled);
                inputs['scheduledTime'].toggleAttribute('disabled', !isScheduled);
                inputs['scheduledTime'].toggleAttribute('hidden', !isScheduled);
                
                this.#isChanged.setValue(true);
                this.#isScheduled.setValue(isScheduled);
                this.#updateDateTimeFields(isScheduled);
            });

            if (inputs['isScheduled'].checked) {
                const dateTime = [ inputs['scheduledDate'].value, inputs['scheduledTime'].value ];
                inputs['scheduledDate'].defaultValue = '';
                inputs['scheduledTime'].defaultValue = '';
                [ inputs['scheduledDate'].value, inputs['scheduledTime'].value ] = dateTime;
                
                this.#isScheduled.setValue(true);
                this.#updateDateTimeFields(true);
            }

            inputs['scheduledDate'].addEventListener('change', () => this.#setPermadate(inputs['scheduledDate'].value.replaceAll('-', '/')));
        }

        for (const field of this.#textInputs) {
            field.addEventListener('input', () => {
                this.#isChanged.setValue(true);
                this.#validation();
            });
        }
        this.#textEditor.content.onChange = () => {
            this.#isChanged.setValue(true);
            this.#validation();
        };
        
        this.#validation();

        this.#isLoaded.setValue(true);
    }

    connectedMoveCallback() {}

    disconnectedCallback() {}

    /**
     * @param {{ required: boolean, tooShort: boolean, tooLong: boolean, mismatch: boolean }[]} errors 
     * @returns {boolean} Whether there were any valid error objects to handle
     */
    error(errors) {
        if (!errors)
            console.error('Errors parameter empty');

        if (!Object.hasOwn(errors[0], 'required'))
            return false;
        
        for (const input of this.#form.elements) {
            const error = errors[input.name];

            if (!error) {
                if (!input.classList.length)
                    continue;

                input.classList.remove('error-required');
                input.classList.remove('error-too-short');
                input.classList.remove('error-too-long');
                input.classList.remove('error-mismatch');
                continue;
            }

            input.classList.toggle('error-required', !!error.required);
            input.classList.toggle('error-too-short', !!error.tooShort);
            input.classList.toggle('error-too-long', !!error.tooLong);
            input.classList.toggle('error-mismatch', !!error.mismatch);
        }

        return true;
    }

    getFormData() {
        const content = this.#textEditor.content.html;
        this.#form.elements['contentShort'].value = content.short;
        this.#form.elements['contentRest'].value = content.rest;

        return new FormData(this.#form);
    }

    get isChanged() { return this.#isChanged; }

    get isPublished() { return this.#isPublished; }

    get isScheduled() { return this.#isScheduled; }

    get isValid() { return this.#isValid; }

    get publishedPath() { return this.#publishedPath; }

    /** @param {() => void} func  */
    onLoaded(func) {
        if (typeof func !== 'function')
            throw new Error('onLoaded argument is not a function');

        if (this.#isLoaded.getValue()) {
            func.call(this);
            return;
        }

        this.#isLoaded.first({
            next: func
        });
    }

    /** @param {(event) => void} func  */
    onSubmit(func) {
        this.#form.addEventListener('submit', func);
    }

    reset() {
        if (this.#form.elements['permalink'])
            this.#form.elements['permalink'].defaultValue = '';
        
        this.#form.reset();

        for (const input of this.#form.elements) {
            if (!input.classList.length)
                continue;

            input.classList.remove('error-required');
            input.classList.remove('error-too-short');
            input.classList.remove('error-too-long');
            input.classList.remove('error-mismatch');
        }
    }

    /** @param {BlogPost} blogPost  */
    updateForm(blogPost) {
        /** @type {Object.<string, HTMLInputElement>} */
        const inputs = this.#form.elements;

        const id = inputs['id'];
        id.value = blogPost.id;
        id.defaultValue = blogPost.id;

        const title = inputs['title'];
        title.value = blogPost.title;
        title.defaultValue = blogPost.title;

        const permalink = inputs['permalink'];
        if (permalink) {
            const permalinkTitle = blogPost.permalink.substring(12);
            permalink.value = permalinkTitle;
            permalink.defaultValue = permalinkTitle;
        }

        this.#textEditor.content.html = blogPost.contentShort + (blogPost.contentRest ?? '');

        const description = inputs['description'];
        description.value = blogPost.description;
        description.defaultValue = blogPost.description;

        const mastolink = inputs['mastolink'];
        mastolink.value = blogPost.mastolink;
        mastolink.defaultValue = blogPost.mastolink;

        const isPinned = inputs['isPinned'];
        isPinned.checked = blogPost.isPinned;
        isPinned.defaultChecked = blogPost.isPinned;

        const isHidden = inputs['isHidden'];
        if (isHidden) {
            isHidden.checked = blogPost.isHidden;
            isHidden.defaultChecked = blogPost.isHidden;
        }
    }

    /**
     * @param {string} input 
     * @returns {string}
     */
    #formatPermalinkTitle(input) {
        return input.toLowerCase()
                .replaceAll(/\s/g, '-')
                .replaceAll(/[^\-a-z0-9]+/g, '')
                .replaceAll(/\-{2,}/g, '')
                .replaceAll(/(^\-)|(\-$)/g, '');
    }

    /** 
     * Set the permadate text to a provided string, or its default value
     * @param {string} value 
     */
    #setPermadate(value = undefined) {
        value ??= this.#permadate.dataset.default;

        this.#permadate.textContent = value;
    }

    /**
     * @param {boolean} isScheduled
     */
    #updateDateTimeFields(isScheduled) {
        const dateInput = this.#form.elements['scheduledDate'];
        const timeInput = this.#form.elements['scheduledTime'];

        if (!isScheduled) {
            this.#setPermadate();
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

            this.#setPermadate(dateInput.value.replaceAll('-', '/'));

            scheduledTimeout.id = setTimeout(recursiveLogic, 60000, scheduledTimeout);
        }

        recursiveLogic(this.#scheduledTimeout);
    }

    #validation() {
        const textEditorValid = this.#textEditor.content.text.length || this.#textEditor.content.media.length;

        const isValid = textEditorValid
            && this.#textInputs.every(input => input.checkValidity());

        this.#isValid.setValue(isValid);
    }
}

customElements.define('blog-form-component', BlogFormComponent);