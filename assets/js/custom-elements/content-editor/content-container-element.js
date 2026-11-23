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
        this.#addOrReplaceHeading();
    }

    increaseHeadingLevel() {
        this.#headingLevel++;
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
        // TODO: Use a different element if trying to increment the level to 7 or above

        const newHeading = document.createElement(`h${this.#headingLevel}`);
        newHeading.textContent = this.#heading?.textContent;
        this.#heading?.remove();
        this.#heading = newHeading;
        this.prepend(newHeading);
        newHeading.contentEditable = true;
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
        return Number.isInteger(this.#headingLevel) && this.#headingLevel >= 2 && this.#headingLevel <= 6;
    }
}

customElements.define('content-container', ContentContainerElement);