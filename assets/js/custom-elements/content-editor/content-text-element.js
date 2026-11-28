import ContentToolbarElement from "/js/custom-elements/content-editor/content-toolbar-element.js";
import ContentClipboardManager from "/js/utilities/content-clipboard-manager.js";
import ContentTextFormatter from "/js/utilities/content-text-formatter.js";
import ModifierKeys from "/js/utilities/modifier-keys.utility.js";
import { fcToUpperCase } from "/js/utilities/string.utility.js";

export default class ContentTextElement extends HTMLElement {
    static PLACEHOLDER_TEXT = 'Click here to input text...';
    static PLACEHOLDER_FOCUS_TEXT = 'Start typing to input text...';

    /** @type {ShadowRoot} */ #shadowRoot;
    /** @type {HTMLElement} */ #content;
    /** @type {HTMLElement} */ #toolbar;

    /** @type {ContentTextFormatter} */ #formatter;
    /** @type {ContentClipboardManager} */ #clipboard;

    /** @type {string[]} */ #validInlineTags = [];

    constructor() {
        super();
        this.#handleKeyboardCommands = this.#handleKeyboardCommands.bind(this);
    }

    connectedCallback() {
        if (this.#shadowRoot)
            return;

        this.#shadowRoot = this.attachShadow({mode: 'closed'});

        const content = document.createElement('text-content');
        content.setAttribute('tabindex', '0');
        this.#content = content;
        this.#shadowRoot.append(content);
        this.#formatter = new ContentTextFormatter(content);
        this.#clipboard = new ContentClipboardManager(content, this.#validInlineTags);

        content.dataset.placeholder = ContentTextElement.PLACEHOLDER_TEXT;
        content.dataset.placeholderFocused = ContentTextElement.PLACEHOLDER_FOCUS_TEXT;
        this.ariaLabel = ContentTextElement.PLACEHOLDER_FOCUS_TEXT;

        content.addEventListener('click', event => {
            event.stopPropagation();
            this.#activate();
        });

        content.addEventListener('keypress', event => {
            event.stopPropagation();
            this.#activate(true);
        })

        this.addEventListener('blur', event => {
            event.stopPropagation();
            this.#deactivate();
        });

        this.#toolbar = document.createElement('text-toolbar');
        this.#shadowRoot.append(this.#toolbar);

        this.#attachNewSvgButton({title: 'Bold (Ctrl + B)', symbolId: '#svg-text-bold'})
            .addEventListener('click', () => this.#formatter.toggleTag('b'));
        this.#attachNewSvgButton({title: 'Italics (Ctrl + I)', symbolId: '#svg-text-italics'})
            .addEventListener('click', () => this.#formatter.toggleTag('i'));
        this.#attachNewSvgButton({title: 'Underline (Ctrl + U)', symbolId: '#svg-text-underline'})
            .addEventListener('click', () => this.#formatter.toggleTag('u'));
        this.#attachNewSvgButton({title: 'Strikethrough', symbolId: '#svg-text-strikethrough'})
            .addEventListener('click', () => this.#formatter.toggleTag('s'));

        this.#attachNewSvgButton({title: 'Cut (Ctrl + X)', symbolId: '#svg-content-cut'})
            .addEventListener('click', () => this.#clipboard.cut());
        this.#attachNewSvgButton({title: 'Copy (Ctrl + C)', symbolId: '#svg-content-copy'})
            .addEventListener('click', () => this.#clipboard.copy());
        this.#attachNewSvgButton({title: 'Paste (Ctrl + V)\nShift click: paste unformatted (Ctrl + Shift + V)', symbolId: '#svg-content-paste'})
            .addEventListener('click', () => this.#clipboard.paste());

        const css = new CSSStyleSheet();
        css.replaceSync(`
            :focus-visible,
            :-moz-focusring {
                --_focus-color: var(--clr-primary-dark);
                outline: var(--_focus-width) var(--_focus-style) var(--_focus-color);
            }

            text-content {
                display: block;
            }

            text-content:empty {
                &::before {
                    content: attr(data-placeholder);
                    opacity: 0.5;
                }

                &:focus::before {
                    content: attr(data-placeholder-focused);
                }
            }

            text-content:not([contenteditable]) {
                cursor: pointer;
            }

            text-toolbar {
                display: none;
                width: fit-content;
                height: fit-content;
                padding: var(--size-s);
                gap: var(--size-xs);
            }
            
            text-toolbar:focus-within,
            text-content:focus-within + text-toolbar {
                display: block flex;
            }

            button {
                display: inline flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
                cursor: pointer;
            }
        `);
        this.#shadowRoot.adoptedStyleSheets.push(css);
    }

    disconnectedCallback() {}

    /** @param {DocumentFragment|null} content  */
    appendDocumentFragment(content) {
        if (!content)
            return;

        this.#content.append(content);
    }

    /** @param {string[]} validInlineTags  */
    setValidInlineTags(validInlineTags) {
        this.#validInlineTags = validInlineTags;
    }

    focusWithin() {
        this.#content.focus();
        this.#activate();

        const node = this.#content.lastChild;
        const offset = node?.childNodes.length || node?.textContent.length;

        if (node)
            getSelection().setPosition(node, offset);
    }

    #activate(keyboardActivation = false) {
        const content = this.#content;

        if (content.contentEditable === ContentEditable.TRUE)
            return;

        content.contentEditable = ContentEditable.TRUE;
        content.addEventListener('keydown', this.#handleKeyboardCommands);
    }


    /**
     * @param {{title: string, symbolId: string}} defaultState
     * @param {{title: string, symbolId: string}} activeState
     * @returns {HTMLButtonElement}
     */
    #attachNewSvgButton(defaultState, activeState = null) {
        const button = document.createElement('button');
        button.type = 'button';
        button.title = defaultState.title;
        button.ariaLabel = defaultState.title;

        const defaultSvg = this.#symbolToSvg(defaultState.symbolId)
        const svgs = [ defaultSvg ];

        if (activeState?.title && activeState?.symbolId) {
            const activeSvg = this.#symbolToSvg(activeState.symbolId);

            if (activeSvg) {
                svgs.push(activeSvg);
                defaultSvg.classList.add('inactive-content');
                activeSvg.classList.add('active-content');
            }

            button.dataset.titleActive = activeState.title;
            button.dataset.titleInactive = defaultState.title;
        }

        button.append(...svgs);
        this.#toolbar.append(button);
        return button;
    }

    #deactivate() {
        const content = this.#content;

        if (content.contentEditable === ContentEditable.INHERIT)
            return;

        if (content.textContent.trim() === '') {
            this.remove();
            return;
        }

        content.contentEditable = ContentEditable.INHERIT;
        content.querySelectorAll('*').forEach(element => {
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
        content.normalize();
        content.removeEventListener('keydown', this.#handleKeyboardCommands);
    }


    /**
     * @param {'new'|'previous'|'next'} type  
     * @param {DocumentFragment} [content=null] 
     */
    #dispatchParagraphEvent(type, content = null) {
        this.dispatchEvent(new CustomEvent('content-paragraph', {
            bubbles: true,
            detail: { type, ...(type === 'new' ? {content} : {}) }
        }));
    }

    /** 
     * @param {HTMLElement} element
     * @param {string} element.localName  */
    #isNonVoidElement({localName}) {
        return document.createElement(localName).outerHTML.includes('</');
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

    /** @param {KeyboardEvent} event */
    #interceptVerticalArrowMovement(event) {
        const previousSibling = (this.previousSibling instanceof ContentToolbarElement)
            ? this.previousSibling.previousSibling
            : this.previousSibling;
        const nextSibling = (this.nextSibling instanceof ContentToolbarElement)
            ? this.nextSibling.nextSibling
            : this.nextSibling;

        const [edge, target] = event.key === 'ArrowUp'
            ? ['top', previousSibling]
            : ['bottom', nextSibling];

        const caretPos = getSelection().getRangeAt(0).getBoundingClientRect()[edge];
        const elementPos = this.#content.getBoundingClientRect()[edge];

        const capEdge = fcToUpperCase(edge);
        const style = getComputedStyle(this.#content);
        const margin = style[`margin${capEdge}`];
        const borderWidth = style[`border${capEdge}Width`];
        const padding = style[`padding${capEdge}`];

        const expectedDifference = [ margin, borderWidth, padding ]
            .map(p => Number(p.split('px')[0]))
            .reduce((accumulator, value) => accumulator + value, 0);
        const result = caretPos - (elementPos + expectedDifference);

        if (result)
            return;

        if (result !== 0 || !(target instanceof ContentTextElement))
            return;
        
        event.preventDefault();
        target.focusWithin();
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

        for (const range of ranges) {
            if (!range.collapsed)
                range.deleteContents();

            range.setEnd(this.#content, this.#content.childNodes.length);
            this.#dispatchParagraphEvent('new', range.extractContents());
        }
    }

    /**
     * @param {string} symbolId 
     * @returns {SVGSVGElement|null}
     */
    #symbolToSvg(symbolId) {
        /** @type {SVGSymbolElement} */
        const symbol = document.querySelector(
            symbolId[0] === '#' ? symbolId : `#${symbolId}`
        );

        if (symbol.localName !== 'symbol')
            return null;

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '2em');
        svg.setAttribute('height', '2em');

        for (const {localName, value} of symbol.attributes)
            localName !== 'id' && svg.setAttribute(localName, value);

        svg.innerHTML = symbol.innerHTML;

        return svg;
    }
}

customElements.define('content-text', ContentTextElement);