export default class ContentTextElement extends HTMLElement {
    static PLACEHOLDER_TEXT = 'Click here to input text...';
    static PLACEHOLDER_FOCUS_TEXT = 'Start typing to input text...';

    /** @type {ShadowRoot} */ #shadowRoot;
    /** @type {HTMLElement} */ #content;
    /** @type {HTMLElement} */ #toolbar;

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
        this.#shadowRoot.append(content)

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

        this.#attachNewSvgButton({title: 'Bold', symbolId: '#svg-text-bold'});
        this.#attachNewSvgButton({title: 'Italics', symbolId: '#svg-text-italics'});
        this.#attachNewSvgButton({title: 'Underline', symbolId: '#svg-text-underline'});

        const css = new CSSStyleSheet();
        css.replaceSync(`
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

        const contenteditable = content.getAttribute('contenteditable');
        if (contenteditable === 'true' || contenteditable === '')
            return;

        content.setAttribute('contenteditable', 'true');
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

        if (!content.hasAttribute('contenteditable'))
            return;

        if (content.textContent.trim() === '') {
            this.remove();
            return;
        }

        content.removeAttribute('contenteditable');
        content.normalize();
        content.querySelectorAll('*').forEach(element => {
            if (!element?.textContent.length)
                element?.remove();
        });
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
     * @param {Node} node
     * @param {string} localName 
     * @returns {HTMLElement|null}
     */
    #findMatchingParent(node, localName) {
        while (node && node.localName !== localName) {
            node = node.parentElement;
        }

        return node;
    }

    /**
     * @param {HTMLElement} parentElement 
     * @param {number} [offset=0] Character offset determining which text node is correct
     * @returns {[Text|null, number]}
     */
    #findTextChild(parentElement, offset = 0) {
        for (const child of parentElement.childNodes) {
            if (child.nodeType === Node.TEXT_NODE) {
                if (offset <= child.textContent.length)
                    return [child, offset];

                offset -= child.textContent.length;
            }

            let descendant = null;
            [ descendant, offset ] = this.#findTextChild(child, offset);

            if (descendant)
                return [ descendant, offset ];
        }

        return [ null, offset ];
    }

    /**
     * @param {HTMLElement} parentElement 
     * @param {(node: Text) => boolean} callbackFn 
     * @returns {Text|null}
     */
    #findTextNodeBy(parentElement, callbackFn) {
        for (const child of parentElement.childNodes) {
            if (child.nodeType === Node.TEXT_NODE && callbackFn(child))
                return child;

            const descendant = this.#findTextNodeBy(child, callbackFn);

            if (descendant)
                return descendant;
        }

        return null;
    }

    /**
     * @param {Selection} selection 
     * @param {string} localName 
     */
    #formatWord(selection, localName) {
        selection.modify('extend', 'backward', 'word');
        const selectionOffset = selection.toString().length;
        selection.collapseToStart();
        selection.modify('extend', 'forward', 'word');

        const range = selection.getRangeAt(0);
        const content = range.extractContents();

        content.querySelectorAll(localName)
            .forEach(match => match.replaceWith(...match.childNodes));
        content.normalize();

        const newNode = document.createElement(localName);
        newNode.append(content);
        range.insertNode(newNode);
        
        const [ foundNode, foundOffset ] = this.#findTextChild(newNode, selectionOffset);
        
        if (foundNode)
            selection.setPosition(foundNode, foundOffset);
    }

    /** @param {string} localName  */
    #handleFormatting(localName) {
        const selection = getSelection();

        const isBackward = selection.direction === 'backward';
        const startNode = isBackward ? selection.focusNode : selection.anchorNode;
        const startOffset = isBackward ? selection.focusOffset : selection.anchorOffset;
        const endNode = isBackward ? selection.anchorNode : selection.focusNode;
        const endOffset = isBackward ? selection.anchorOffset : selection.focusOffset;

        const startMatch = this.#findMatchingParent(startNode, localName);
        const endMatch = this.#findMatchingParent(endNode, localName);

        if (selection.isCollapsed) {
            if (startMatch) {
                startMatch.replaceWith(...startMatch.childNodes);
                selection.setPosition(startNode, startOffset);
                return;
            }
            
            const textContent = startNode.textContent;
            const isInsideAWord = startNode.nodeType === Node.TEXT_NODE
                && startOffset !== 0
                && startOffset !== textContent.length
                && textContent[startOffset] !== ' '
                && textContent[startOffset-1] !== ' ';

            if (isInsideAWord) {
                this.#formatWord(selection, localName);
                return;
            }

            const element = document.createElement(localName);
            const range = selection.getRangeAt(0);
            range.insertNode(element);
            selection.setPosition(element, 0);     
            return;       
        }

        const range = selection.getRangeAt(0);
        const commonAncestor = range.commonAncestorContainer;
        const matchingParent = this.#findMatchingParent(commonAncestor, localName);

        const isAllFormatted = !this.#findTextNodeBy(commonAncestor, node => {
            return (range.isPointInRange(node, 0) || range.isPointInRange(node, node.textContent.length))
                && node.textContent.trim()
                && !this.#findMatchingParent(node, localName);
        });

        if (matchingParent || isAllFormatted) {
            const afterRange = document.createRange();
            afterRange.setStart(endNode, endOffset);
            afterRange.setEnd(this.#content, this.#content.childNodes.length);
            const afterContent = afterRange.extractContents();

            range.setEnd(this.#content, this.#content.childNodes.length);
            const selectedContent = range.extractContents();
            
            selectedContent.querySelectorAll(localName)
                .forEach(match => match.replaceWith(...match.childNodes));
            selectedContent.normalize();
            
            range.insertNode(selectedContent);
            this.#content.append(afterContent);
            return;
        }

        // If all text nodes in range have matching ancestor, unformat them

        // If some text nodes in range do not having matching ancestor, format them
    }

    /** @param {KeyboardEvent} event  */
    #handleKeyboardCommands = (event) => {
        if (this.#interceptedParagraphBreak(event))
            return;

        if (!event.ctrlKey)
            return;

        if (event.shiftKey || event.altKey || event.metaKey)
            return;

        const key = event.key.toLowerCase();

        switch (key) {
            case 'b':
            case 'i':
            case 'u':
                event.preventDefault();
                event.stopPropagation();
                this.#handleFormatting(key);
                break;

            default:
                return;
        }
    }

    /**
     * @param {KeyboardEvent} event 
     * @returns {boolean}
     */
    #interceptedParagraphBreak(event) {
        if (event.key !== 'Enter' && event.key !== 'Return')
            return false;

        if (event.ctrlKey || event.altKey || event.shiftKey || event.metaKey)
            return false;

        event.preventDefault();
        event.stopPropagation();

        const range = getSelection().getRangeAt(0);

        if (!range.collapsed)
            range.deleteContents();

        range.setEnd(this.#content, this.#content.childNodes.length);
        this.#dispatchParagraphEvent('new', range.extractContents());

        return true;
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