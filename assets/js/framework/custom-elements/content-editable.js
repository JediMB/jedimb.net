import ContentClipboardManager from "/js/utilities/content-clipboard-manager.js";
import ContentTextFormatter from "/js/utilities/content-text-formatter.js";
import ModifierKeys from "/js/utilities/modifier-keys.utility.js";
import { fcToUpperCase } from "/js/utilities/string.utility.js";

export default class ContentEditable extends HTMLElement {
    static INHERIT = Object.freeze('inherit');
    static TRUE = Object.freeze('true');
    static FALSE = Object.freeze('false');
    static PLAINTEXT_ONLY = Object.freeze('plaintext-only');

    #shadowRoot;
    /** @type {HTMLElement} */ #content;
    /** @type {HTMLElement} */ #editable;
    #formatter;
    #clipboard;

    #allowedContentTypes;
    #subContentType;
    /** @type {string[]} */ #validInlineTags = [];

    /** The localName of the content element */
    get contentType() { return this.#content.localName; }

    /**
     * @param {string[]} contentTypes Allowed types (localNames) of the content element
     * @param  {string|null} [subContentType] One or more children of this type are needed in the content element
     */
    constructor(contentTypes, subContentType = null) {
        super();
        this.#handleKeyboardCommands = this.#handleKeyboardCommands.bind(this);
        this.#allowedContentTypes = [...contentTypes];
        this.#subContentType = subContentType || null;

        this.#shadowRoot = this.attachShadow({ mode: 'closed' });
        this.setType(contentTypes[0]);
        this.#shadowRoot.append(this.#content);

        this.#formatter = new ContentTextFormatter(this.#content);
        this.#clipboard = new ContentClipboardManager(this.#content, this.#validInlineTags);

        const css = new CSSStyleSheet();
        css.replaceSync(`
            :focus-visible,
            :-moz-focusring {
                --_focus-color: var(--clr-primary-dark);
                outline: var(--_focus-width) var(--_focus-style) var(--_focus-color);
            }

            ${this.#subContentType || `:is(${this.#allowedContentTypes.join(', ')})`}:not([contenteditable]) {
                cursor: pointer;
            }
        `);
        this.#shadowRoot.adoptedStyleSheets.push(css);
    }

    focusWithin() {
        this.#activate();
        this.#content.focus();

        getSelection().setPosition(
            this.#content.lastChild,
            this.#content.lastChild?.childNodes?.length
                || this.#content.lastChild?.textContent.length
        );
    }

    /**
     * @param {string} contentType The type (localName) of the content element
     */
    setType(contentType) {
        if (contentType.toLowerCase() === this.#content?.localName)
            return;

        if (!this.#allowedContentTypes.includes(contentType))
            return;

        const content = document.createElement(contentType);
        content.tabIndex = 0;

        content.addEventListener('click', event => {
            event.stopPropagation();

            if (!this.#subContentType)
                return this.#activate();
            
            const childTarget = Array.from(this.#content.children).find(element => element.contains(event.target));

            if (childTarget !== this.#editable)
                this.#focusSubContent(childTarget, false);
        });

        content.addEventListener('keypress', event => {
            event.stopPropagation();
            const childTarget = Array.from(this.#content.children).find(element => element.contains(event.target));

            if (childTarget !== this.#editable)
                this.#focusSubContent(childTarget);
        });

        this.addEventListener('blur', event => {
            event.stopPropagation();
            this.#deactivate();
        });

        if (this.#content?.childNodes.length)
            content.append(...this.#content.childNodes);
        else if (this.#subContentType)
            content.append(document.createElement(this.#subContentType));

        this.#content?.replaceWith(content);
        this.#content = content;
    }

    /** @param {string[]} validInlineTags  */
    setValidInlineTags(validInlineTags) {
        this.#validInlineTags = [...validInlineTags];
    }

    /** @param {HTMLElement} [element=null]  */
    #activate(element = null) {
        const newEditable = element ?? (
            this.#subContentType
                ? this.#content.firstChild
                : this.#content
        );
        
        if (newEditable.contentEditable === ContentEditable.TRUE)
            return;

        this.#deactivate();
        this.#editable = newEditable;
        newEditable.contentEditable = ContentEditable.TRUE;
        
        const subContainer = this.#subContentType ? newEditable : null;
        this.#clipboard.setSubContainer(subContainer);
        this.#formatter.setSubContainer(subContainer);
        
        newEditable.addEventListener('keydown', this.#handleKeyboardCommands);
    }

    #deactivate() {
        const editable = this.#editable;

        if (!editable)
            return;

        this.#editable = null;

        if (editable.contentEditable === ContentEditable.INHERIT)
            return;

        if (editable.textContent.trim() === '') {
            editable.remove();

            if (!this.#content?.childNodes.length)
                this.remove();
            return;
        }

        editable.contentEditable = ContentEditable.INHERIT;
        editable.querySelectorAll('*').forEach(element => {
            if (!element)
                return;

            if (!element.textContent.length && this.#isNonVoidElement(element)) {
                element.remove();
                return;
            }

            element.querySelectorAll(element.localName)
                .forEach(match => match.replaceWith(...match.childNodes));

            while (element.localName === element.nextElementSibling?.localName) {
                const inbetweeners = [];
                let searchNode = element.nextSibling;

                while (searchNode.nodeType === Node.TEXT_NODE) {
                    inbetweeners.push(searchNode);
                    searchNode = searchNode.nextSibling;
                }

                if (inbetweeners.some(text => text.textContent.trim()))
                    break;

                element.append(...inbetweeners);
                element.append(...element.nextElementSibling.childNodes);
                element.nextElementSibling.remove();
            }
        });
        editable.normalize();
        editable.removeEventListener('keydown', this.#handleKeyboardCommands);
    }

    /**
     * @param {'new'|'previous'|'next'} type 
     * @param {DocumentFragment} [content=null] 
     */
    #dispatchEditableEvent(type, content = null) {
        this.dispatchEvent(new CustomEvent(this.localName, {
            bubbles: true,
            detail: { type: type, ...(type === 'new' ? {content} : {}) }
        }))
    }

    /**
     * @param {HTMLElement} element 
     * @param {boolean} [setPosition=true] 
     */
    #focusSubContent(element, setPosition = true) {
        if (!this.#subContentType)
            return console.error('focusSubContent() called without subContentType');

        if (element.localName !== this.#subContentType)
            return console.error('focusSubContent called with an invalid element');

        this.#activate(element);
        element.focus();

        if (setPosition)
            getSelection().setPosition(
                element.lastChild,
                element.lastChild?.childNodes?.length
                    || element.lastChild?.textContent.length
            );

    }

    /** @param {KeyboardEvent} event  */
    #handleKeyboardCommands = (event) => {
        const eventModifiers = ModifierKeys.eventKeys(event);

        switch (eventModifiers) {
            case ModifierKeys.NONE:
                switch (event.key) {
                    case 'Enter':
                    case 'Return':
                        this.#interceptParagraphBreak(event);
                        break;

                    case 'ArrowUp':
                    case 'ArrowDown':
                        this.#interceptVerticalArrowMovement(event);
                        break;
                }
                break;

            case ModifierKeys.CTRL:
                const lowerKey = event.key.toLowerCase();

                switch (lowerKey) {
                    case 'b':
                    case 'i':
                    case 'u':
                        event.preventDefault();
                        event.stopPropagation();
                        this.#formatter.toggleTag(lowerKey);
                        break;

                    default:
                        return;
                }
                break;
        }
    }

    /**
     * @param {KeyboardEvent} event 
     */
    #interceptParagraphBreak(event) {
        event.preventDefault();
        event.stopPropagation();

        const selection = getSelection();
        const ranges = selection.getComposedRanges()
            .map((_, index) => selection.getRangeAt(index))
            .reverse();

        const editable = this.#editable;

        const action = this.#subContentType
            ? (fragment) => {
                const newElement = document.createElement(this.#subContentType);
                newElement.append(fragment);
                editable.after(newElement);
                this.#focusSubContent(newElement);
            }
            : (fragment) => {
                this.#dispatchEditableEvent('new', fragment);
            }

        for (const range of ranges) {
            if (!range.collapsed)
                range.deleteContents();

            range.setEnd(editable, editable.childNodes.length);
            action(range.extractContents());
        }
    }

    /** @param {KeyboardEvent} event */
    #interceptVerticalArrowMovement(event) {
        const neighborAnchor = this.#subContentType
            ? this.#editable
            : this;

        const previousSibling = (neighborAnchor.previousElementSibling instanceof ContentToolbarElement)
            ? neighborAnchor.previousElementSibling.previousElementSibling
            : neighborAnchor.previousElementSibling;
        const nextSibling = (neighborAnchor.nextElementSibling instanceof ContentToolbarElement)
            ? neighborAnchor.nextElementSibling.nextElementSibling
            : neighborAnchor.nextElementSibling;
        
        const [edge, target] = event.key === 'ArrowUp'
            ? ['top', previousSibling]
            : ['bottom', nextSibling];

        if (!target || target.className !== neighborAnchor.className)
            return;

        const caretPosition = getSelection().getRangeAt(0).getBoundingClientRect()[edge];
        const elementPosition = this.#editable.getBoundingClientRect()[edge];

        const capEdge = fcToUpperCase(edge);
        const style = getComputedStyle(this.#editable);
        const margin = style[`margin${capEdge}`];
        const borderWidth = style[`border${capEdge}Width`];
        const padding = style[`padding${capEdge}`];

        const expectedDifference = [ margin, borderWidth, padding ]
            .map(p => Number(p.split('px')[0]))
            .reduce((accumulator, value) => accumulator + value, 0);
        const result = caretPosition - (elementPosition + expectedDifference);

        if (result !== 0)
            return;

        event.preventDefault();

        if (target instanceof ContentEditable)
            target.focusWithin();
        else
            this.#focusSubContent(target);
    }

    /** 
     * @param {HTMLElement} element
     * @param {string} element.localName  */
    #isNonVoidElement({localName}) {
        return document.createElement(localName).outerHTML.includes('</');
    }
}