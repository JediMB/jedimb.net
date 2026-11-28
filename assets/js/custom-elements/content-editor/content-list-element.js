import ContentEditable from "/js/framework/custom-elements/content-editable.js";

export default class ContentListElement extends ContentEditable {
    constructor() { super(['ul', 'ol', 'menu'], 'li'); }

    connectedCallback() { }

    disconnectedCallback() {}

    /** @param {'ul'|'ol'|'menu'} localName  */
    setType(localName) { super.setType(localName); }
}

customElements.define('content-list', ContentListElement);