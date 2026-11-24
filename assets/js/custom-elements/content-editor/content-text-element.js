import ContentTextFormatter from "/js/utilities/content-text-formatter.js";
import ModifierKeys from "/js/utilities/modifier-keys.utility.js";

export default class ContentTextElement extends HTMLElement {
    static PLACEHOLDER_TEXT = 'Click here to input text...';
    static PLACEHOLDER_FOCUS_TEXT = 'Start typing to input text...';

    /** @type {ShadowRoot} */ #shadowRoot;
    /** @type {HTMLElement} */ #content;
    /** @type {HTMLElement} */ #toolbar;

    /** @type {ContentTextFormatter} */ #formatter;

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

        this.#attachNewSvgButton({title: 'Bold', symbolId: '#svg-text-bold'})
            .addEventListener('click', () => this.#formatter.toggleTag('b'));
        this.#attachNewSvgButton({title: 'Italics', symbolId: '#svg-text-italics'})
            .addEventListener('click', () => this.#formatter.toggleTag('i'));
        this.#attachNewSvgButton({title: 'Underline', symbolId: '#svg-text-underline'})
            .addEventListener('click', () => this.#formatter.toggleTag('u'));
        this.#attachNewSvgButton({title: 'Strikethrough', symbolId: '#svg-text-strikethrough'})
            .addEventListener('click', () => this.#formatter.toggleTag('s'));

        this.#attachNewSvgButton({title: 'Cut', symbolId: '#svg-content-cut'})
            .addEventListener('click', () => {

            });
        this.#attachNewSvgButton({title: 'Copy', symbolId: '#svg-content-copy'})
            .addEventListener('click', async () => {
                const selection = getSelection();

                if (selection.isCollapsed)
                    return;

                try {
                    const selectedContents = selection.getComposedRanges()
                        .map((_, index) => selection.getRangeAt(index))
                        .map(range => {
                            let contents = range.cloneContents();
                            
                            let element = range.commonAncestorContainer;
                            if (element.nodeType === Node.TEXT_NODE)
                                element = element.parentElement;

                            while (element && element !== this.#content) {
                                const newElement = document.createElement(element.localName);
                                newElement.append(contents);
                                contents = newElement;
                                element = element.parentElement;
                            }

                            return contents;
                        });

                    const container = document.createElement('div');
                    container.append(...selectedContents);
                    const html = container.innerHTML;
                    const text = container.innerText;

                    const clipboardItem = new ClipboardItem({
                        'text/html': new Blob([html], { type: 'text/html' }),
                        'text/plain': new Blob([text], { type: 'text/plain' })
                    });

                    await navigator.clipboard.write([clipboardItem]);
                }
                catch (_) {
                    document.execCommand('copy');
                    console.error('Fell back to execCommand copy functionality');
                }
            });
        this.#attachNewSvgButton({title: 'Paste', symbolId: '#svg-content-paste'})
            .addEventListener('click', () => {
                
            });

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

    focusWithin() {
        this.#content.focus();
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
            
            if (element.textContent.length === 0) {
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
                        console.log(getSelection());
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