import BlogPostDTO from "/js/models/blog-post.dto.js";

customElements.define('blog-head-component', class BlogHeadComponent extends HTMLElement {
    #textBox;

    constructor() { super(); }

    connectedCallback() {
        const content = this.querySelector('blog-head-content');

        const body = content.querySelector('blog-head-body');
        const title = body.querySelector('#blog-head__title');
        const permadate = body.querySelector('#blog-head__permadate');
        const permalink = body.querySelector('#blog-head__permalink');
        const btnResetPermalink = body.querySelector('#blog-head__reset_permalink');
        const textEditor = this.querySelector('#blog-head__text-editor');
        const description = body.querySelector('#blog-head__description');
        const sociallink = body.querySelector('#blog-head__sociallink');

        const footer = content.querySelector('blog-head-footer');
        const tglPinned = footer.querySelector('#blog-head__toggle-pinned');
        const tglScheduled = footer.querySelector('#blog-head__toggle-schedule');
        const scheduledDate = footer.querySelector('#blog-head__scheduled-date');
        const scheduledTime = footer.querySelector('#blog-head__scheduled-time');
        const btnAddPost = footer.querySelector('#blog-head__btn-add');
        const btnCancelPost = footer.querySelector('#blog-head__btn-cancel');
        const btnPublishPost = footer.querySelector('#blog-head__btn-publish');
        const btnDraftPost = footer.querySelector('#blog-head__btn-draft');

        title.addEventListener('input', () => permalink.defaultValue = this.#formatPermalinkTitle(title.value));
        title.addEventListener('change', () => title.value = title.value.trim());

        permalink.addEventListener('change', () => permalink.value = this.#formatPermalinkTitle(permalink.value));
        btnResetPermalink.addEventListener('click', () => permalink.value = permalink.defaultValue);

        tglScheduled.addEventListener('change', event => {
            const isScheduled = event.target.checked;

            scheduledDate.toggleAttribute('hidden', !isScheduled);
            scheduledTime.toggleAttribute('hidden', !isScheduled);
            btnPublishPost.textContent = isScheduled ? btnPublishPost.dataset.contentSchedule : btnPublishPost.dataset.contentPublish;
            permadate.textContent = isScheduled ? scheduledDate.value.replaceAll('-', '/') : permadate.dataset.default;
        });

        btnPublishPost.addEventListener('click', () => {
            console.log('click');
        });

        textEditor.addEventListener('text-change', event => {
            this.#textBox = event.detail;
            
            const isEmpty = !this.#textBox.textContent.length;
            btnPublishPost.disabled = isEmpty;
            btnDraftPost.disabled = isEmpty;
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

    #isInvalid() {

    }
});