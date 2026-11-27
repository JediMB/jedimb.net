import ContentEditable from "/js/enums/content-editable.enum.js";

export default class ContentListElement extends HTMLElement {
    /** @type {ShadowRoot} */ #shadowRoot;
    /** @type {HTMLOListElement|HTMLUListElement} */ #list;

    constructor() {
        super();
        this.setType('ul');
    }

    connectedCallback() {
        this.#shadowRoot = this.attachShadow({ mode: 'closed' });
        this.#shadowRoot.append(this.#list);
    }

    disconnectedCallback() {}

    focusWithin() {
        this.#list.focus();
        this.#list.contentEditable = ContentEditable.TRUE;
        getSelection().setPosition(this.#list.lastChild, this.#list.lastChild.childNodes.length);
    }

    /** @param {'ul'|'ol'|'menu'} localName  */
    setType(localName) {
        localName = localName.toLowerCase();

        if (localName === this.#list?.localName)
            return;

        if (!['ul', 'ol', 'menu'].includes(localName))
            return;

        const newList = document.createElement(localName);
        newList.tabIndex = 0;
        newList.append(
            ...( this.#list?.childNodes ?? [document.createElement('li')] )
        );
        this.#list?.replaceWith(newList);
        this.#list = newList;
    }
}

customElements.define('content-list', ContentListElement);