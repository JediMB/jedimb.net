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
        super._setType(localName, null, ['ul', 'ol', 'menu']);
    }
}

customElements.define('content-list', ContentListElement);