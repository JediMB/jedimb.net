import ContentEditable from "/js/framework/custom-elements/content-editable.js";

export default class ContentListElement extends ContentEditable {
    constructor() {
        super('ul', 'li');
    }

    connectedCallback() {
    }

    disconnectedCallback() {}

    /** @param {'ul'|'ol'|'menu'} localName  */
    setType(localName) {
        localName = localName.toLowerCase();

        if (localName === this.contentType)
            return;

        if (!['ul', 'ol', 'menu'].includes(localName))
            return;

        super._setType(localName);
    }
}

customElements.define('content-list', ContentListElement);