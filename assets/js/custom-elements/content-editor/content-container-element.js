export default class ContentContainerElement extends HTMLElement {
    /** @type {2|3|4|5|6|null} */ #headingLevel = null;

    /** @param {2|3|4|5|6} val  */
    set headingLevel(val) {
        const level = Math.floor(Number(val));

        if (level < 2 || level > 6)
            this.#headingLevel = null;
        else
            this.#headingLevel = level;
    }

    get headingLevel() {
        return this.#headingLevel;
    }

    constructor() { super(); }

    connectedCallback() {
        this.setAttribute('tabindex', '0');
    }

    disconnectedCallback() {}
}

customElements.define('content-container', ContentContainerElement);