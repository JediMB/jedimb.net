import BlogPostDTO from "/js/models/blog-post.dto.js";
import { TextEditorComponent } from "/js/components/text-editor/text-editor.module.js";

customElements.define('blog-head-component', class BlogHeadComponent extends HTMLElement {
    #scheduledTimeout = { id: null };
    constructor() { super(); }

    connectedCallback() {
        const content = this.querySelector('blog-head-content');

        const body = content.querySelector('blog-head-body');
        const title = body.querySelector('#blog-head__title');
        const permadate = body.querySelector('#blog-head__permadate');
        const permalink = body.querySelector('#blog-head__permalink');
        const btnResetPermalink = body.querySelector('#blog-head__reset_permalink');
        /** @type {TextEditorComponent} */ const textEditor = this.querySelector('#blog-head__text-editor');
        const description = body.querySelector('#blog-head__description');
        const sociallink = body.querySelector('#blog-head__sociallink');

        const footer = content.querySelector('blog-head-footer');
        const tglPinned = footer.querySelector('#blog-head__toggle-pinned');
        const tglScheduled = footer.querySelector('#blog-head__toggle-schedule');
        /** @type {HTMLInputElement} */ const scheduledDate = footer.querySelector('#blog-head__scheduled-date');
        /** @type {HTMLInputElement} */ const scheduledTime = footer.querySelector('#blog-head__scheduled-time');
        const btnAddPost = footer.querySelector('#blog-head__btn-add');
        const btnCancelPost = footer.querySelector('#blog-head__btn-cancel');
        const btnPublishPost = footer.querySelector('#blog-head__btn-publish');
        const btnDraftPost = footer.querySelector('#blog-head__btn-draft');

        title.addEventListener('input', () => permalink.defaultValue = this.#formatPermalinkTitle(title.value));
        title.addEventListener('change', () => title.value = title.value.trim());

        permalink.addEventListener('change', () => permalink.value = this.#formatPermalinkTitle(permalink.value));
        btnResetPermalink.addEventListener('click', () => permalink.value = permalink.defaultValue);

        textEditor.content.onChange = () => {
            const isEmpty = !textEditor.content.text.length;
            btnPublishPost.disabled = isEmpty;
            btnDraftPost.disabled = isEmpty;
        }

        tglScheduled.addEventListener('change', event => {
            const isScheduled = event.target.checked;

            scheduledDate.toggleAttribute('required', isScheduled);
            scheduledDate.toggleAttribute('hidden', !isScheduled);
            scheduledTime.toggleAttribute('required', isScheduled);
            scheduledTime.toggleAttribute('hidden', !isScheduled);
            btnPublishPost.textContent = isScheduled ? btnPublishPost.dataset.contentSchedule : btnPublishPost.dataset.contentPublish;
            permadate.textContent = isScheduled ? scheduledDate.value.replaceAll('-', '/') : permadate.dataset.default;

            this.#updateDateTimeFields(scheduledDate, scheduledTime, isScheduled);
        });

        btnPublishPost.addEventListener('click', () => {
            console.log(textEditor.content.html, textEditor.content.text);
            console.log(textEditor.content.media);
        });
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

    // /**
    //  * @param {HTMLInputElement} dateInput 
    //  * @param {HTMLInputElement} timeInput 
    //  * @param {boolean} isScheduled
    //  */
    // #updateDateTimeFields(dateInput, timeInput, isScheduled) {
    //     if (!isScheduled)
    //         return clearTimeout(this.#scheduleTimeoutId);
        
    //     const now = new Date();
        
    //     const minTime = new Date(now.getTime() + 900000);
    //     const followingHour = new Date(minTime.getTime() + 3600000);
    //     const targetDateValue = `${followingHour.getFullYear()}-${`${followingHour.getMonth() + 1}`.padStart(2, '0')}-${`${followingHour.getDate()}`.padStart(2, '0')}`;

    //     timeInput.min = `${minTime.getHours()}:${`${minTime.getMinutes()}`.padStart(2, '0')}`;
    //     dateInput.min = targetDateValue;

    //     const defaultTimeValue = `${followingHour.getHours()}:00`;

    //     if (this.isScheduled
    //         && timeInput.value === timeInput.defaultValue
    //         && timeInput.defaultValue !== defaultTimeValue) {
    //             console.log('Ding!');
    //     }

    //     timeInput.defaultValue = defaultTimeValue;
    //     dateInput.defaultValue = targetDateValue;

    //     this.#scheduleTimeoutId = setTimeout(this.#updateDateTimeFields, 60000, dateInput, timeInput, isScheduled);
    // }

    /**
     * @param {HTMLInputElement} dateInput 
     * @param {HTMLInputElement} timeInput 
     * @param {boolean} isScheduled
     */
    #updateDateTimeFields(dateInput, timeInput, isScheduled) {
        if (!isScheduled)
            return clearTimeout(this.#scheduledTimeout.id);

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
                    console.log('Ding!');
            }

            timeInput.defaultValue = defaultTimeValue;
            dateInput.defaultValue = targetDateValue;

            scheduledTimeout.id = setTimeout(recursiveLogic, 60000, scheduledTimeout);
        }

        recursiveLogic(this.#scheduledTimeout);
    }

    #isInvalid() {

    }
});