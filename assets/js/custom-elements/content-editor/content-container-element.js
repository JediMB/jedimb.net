import ContentEditable from "/js/enums/content-editable.enum.js";

export default class ContentContainerElement extends HTMLElement {
    /** @type {boolean} */ #isSetup = false;
    /** @type {HTMLHeadingElement} */ #heading = null;
    /** @type {2|3|4|5|6} */ #headingLevel = 0;

    get hasHeading() { return !!this.#heading; }

    get headingLevel() { return this.#headingLevel; }

    constructor() { super(); }

    connectedCallback() {
        this.setAttribute('tabindex', '0');
    }

    disconnectedCallback() {}

    decreaseHeadingLevel() {
        this.#headingLevel--;

        if (this.#heading)
            this.#addOrReplaceHeading();
    }

    increaseHeadingLevel() {
        this.#headingLevel++;

        if (this.#heading)
            this.#addOrReplaceHeading();
    }

    removeHeading() {
        if (!this.#heading)
            return;

        this.#headingLevel--;
        /** @type {NodeListOf<ContentContainerElement>} */
        const descendants = this.querySelectorAll(customElements.getName(ContentContainerElement));
        descendants.forEach(container => container.decreaseHeadingLevel());

        this.#heading.remove();
        this.#heading = null;
    }

    setHeading() {
        if (!this.#isValidHeadingLevel())
            return console.error(`Cannot add heading while at invalid heading level (${this.#headingLevel})`);

        if (!this.#heading) {
            this.#headingLevel++;
            /** @type {NodeListOf<ContentContainerElement>} */
            const descendants = this.querySelectorAll(customElements.getName(ContentContainerElement));
            descendants.forEach(container => container.increaseHeadingLevel());
        }

        this.#addOrReplaceHeading();
    }

    #addOrReplaceHeading() {
        const newHeading = this.#isValidHeadingLevel()
            ? document.createElement(`h${this.#headingLevel}`)
            : document.createElement('content-invalid-heading');
        newHeading.textContent = this.#heading?.textContent;
        this.#heading?.remove();
        this.#heading = newHeading;
        this.prepend(newHeading);


        newHeading.addEventListener('click', () => {
            if (!newHeading.isContentEditable)
                newHeading.contentEditable = ContentEditable.PLAINTEXT_ONLY;
        });

        newHeading.addEventListener('keypress', () => {
            if (!newHeading.isContentEditable)
                newHeading.contentEditable = ContentEditable.PLAINTEXT_ONLY;
        });

        newHeading.addEventListener('keydown', event => {
            event.stopPropagation();

            if (event.key === 'Enter' || event.key === 'Return')
                event.preventDefault();
        });

        newHeading.addEventListener('paste', event => {
            event.preventDefault();

            if (!newHeading.isContentEditable)
                return;

            const pasteText = event.clipboardData.getData('text').replaceAll("\n", ' ');
            const selection = getSelection();

            if (!newHeading.contains(selection.anchorNode) || !newHeading.contains(selection.focusNode)) {
                newHeading.textContent += pasteText;
                selection.setPosition(newHeading, newHeading.childNodes.length);
                return;
            }

            selection.deleteFromDocument();
            selection.getRangeAt(0).insertNode(document.createTextNode(pasteText));
            selection.collapseToEnd();
        });

        newHeading.addEventListener('blur', () => {
            if (!newHeading.textContent.trim())
                this.removeHeading();

            newHeading.contentEditable = ContentEditable.INHERIT;
        });

        newHeading.tabIndex = 0;
        newHeading.contentEditable = ContentEditable.PLAINTEXT_ONLY;
        newHeading.focus();
    }

    /** @param {number} headingLevel  */
    setup(headingLevel) {
        if (this.#isSetup) {
            console.error('Cannot setup ContentContainerElement more than once');
            return;
        }
        this.#isSetup = true;

        this.#headingLevel = Math.floor(Number(headingLevel));
        if (!this.#isValidHeadingLevel())
            this.#headingLevel = 0;
    }

    #isValidHeadingLevel() {
        return Number.isInteger(this.#headingLevel)
            && this.#headingLevel >= 2
            && this.#headingLevel <= 6;
    }
}

customElements.define('content-container', ContentContainerElement);