export default class ContentEditable extends HTMLElement {
    static INHERIT = Object.freeze('inherit');
    static TRUE = Object.freeze('true');
    static FALSE = Object.freeze('false');
    static PLAINTEXT_ONLY = Object.freeze('plaintext-only');

    #shadowRoot;
    /** @type {HTMLElement} */ #content;

    /** The localName of the content element */
    get contentType() { return this.#content.localName; }

    /**
     * @param {string} contentType The type (localName) of the content element
     * @param  {...string} contentChildTypes A child of each type is appended to the content element
     */
    constructor(contentType, ...contentChildTypes) {
        super();
        this.#shadowRoot = this.attachShadow({ mode: 'closed' });
        this._setType(contentType, contentChildTypes);
        this.#shadowRoot.append(this.#content);
    }

    focusWithin() {
        this.#content.focus();
        this.#content.contentEditable = ContentEditable.TRUE;

        getSelection().setPosition(
            this.#content.lastChild,
            this.#content.lastChild?.childNodes?.length
                || this.#content.lastChild?.textContent.length
        );
    }

    /**
     * @param {string} contentType The type (localName) of the content element
     * @param {string[]} [contentChildTypes] A child of each type is appended to the content element
     * @param {string[]} [allowedContentTypes] An optional whitelist of content types
     */
    _setType(contentType, contentChildTypes = [], allowedContentTypes = null) {
        if (contentType.toLowerCase() === this.#content?.localName)
            return;

        if (allowedContentTypes && !allowedContentTypes.includes(contentType))
            return;

        const content = document.createElement(contentType);

        if (contentChildTypes?.length)
            for (const childType of contentChildTypes)
                content.append(document.createElement(childType));
        else if (this.#content?.childNodes.length)
            content.append(...this.#content.childNodes);

        this.#content?.replaceWith(content);
        this.#content = content;
    }
}