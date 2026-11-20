export default class ContentTextFormatter {
    /** @type {HTMLElement} */ #content;

    /** @param {HTMLElement} shadowRootElement HTMLElement in the root of a shadow DOM */
    constructor(shadowRootElement) {
        if (!(shadowRootElement.getRootNode() instanceof ShadowRoot)) {
            console.error('Invalid shadowRootElement argument: has a parentElement');
            return;
        }

        this.#content = shadowRootElement;
    }

    /** @param {string} tag The tag of the HTMLElement type that is to be removed or applied */
    toggleTag(tag) {
        const localName = tag.toLowerCase();
        const selection = getSelection();
        
        if (selection.isCollapsed)
            this.#toggleAtPosition(localName, selection);
        else
            this.#toggleAtRanges(localName, selection);
    }

    /**
     * @param {Range} range 
     * @param {string} localName 
     * @param {Node} endNode 
     * @param {number} endOffset 
     */
    #escapeTag(range, localName, endNode, endOffset) {
        const afterRange = document.createRange();
        afterRange.setStart(endNode, endOffset);
        afterRange.setEnd(this.#content, this.#content.childNodes.length);
        const afterContents = afterRange.extractContents();

        range.setEnd(this.#content, this.#content.childNodes.length);
        this.#reformatRange(range, localName, 'remove');

        this.#content.append(afterContents);
    }

    /**
     * @param {HTMLElement} element 
     * @param {string} localName 
     * @returns {HTMLElement|null}
     */
    #findMatchingParent(element, localName) {
        while (element && element.localName !== localName) {
            element = element.parentElement;
        }

        return element;
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
                    return [ child, offset ];

                offset -= child.textContent.length;
            }

            const [ descendant, newOffset ] = this.#findTextChild(child, offset);

            if (descendant)
                return [ descendant, newOffset ];

            offset = newOffset;
        }

        return [ null, offset ];
    }

    /**
     * @param {HTMLElement} parentElement 
     * @param {(textNode: Text) => boolean} conditionCallback 
     * @returns {Text|null}
     */
    #findTextNodeBy(parentElement, conditionCallback) {
        for (const child of parentElement.childNodes) {
            if (child.nodeType === Node.TEXT_NODE && conditionCallback(child))
                return child;

            const descendant = this.#findTextNodeBy(child, conditionCallback);

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
        const newElement = this.#reformatRange(range, localName, 'replace');

        const [ foundNode, foundOffset ] = this.#findTextChild(newElement, selectionOffset);

        selection.setPosition(foundNode, foundOffset);
    }

    /**
     * @param {Range} range 
     * @param {string} localName 
     * @param {'replace'|'remove'} formattingMode 
     * @returns {HTMLElement|null} Returns the new HTMLElement if formattingMode is 'replace'
     */
    #reformatRange(range, localName, formattingMode) {
        const contents = range.extractContents();
        contents.querySelectorAll(localName)
            .forEach(match => match.replaceWith(...match.childNodes));
        contents.normalize();

        if (formattingMode === 'remove') {
            range.insertNode(contents);
            return null;
        }

        const newElement = document.createElement(localName);
        newElement.append(contents);
        range.insertNode(newElement);

        return newElement;
    }

    /**
     * @param {string} localName 
     * @param {Selection} selection 
     */
    #toggleAtPosition(localName, selection) {
        const { anchorNode, anchorOffset } = selection;
        const parentMatch = this.#findMatchingParent(anchorNode, localName);

        const textContent = anchorNode.textContent;
        const isInsideAWord = anchorNode.nodeType === Node.TEXT_NODE
            && anchorOffset !== 0
            && anchorOffset !== textContent.length
            && textContent[anchorOffset] !== ' '
            && textContent[anchorOffset-1] !== ' ';

        if (parentMatch) {
            if (isInsideAWord) {
                parentMatch.replaceWith(...parentMatch.childNodes);
                selection.setPosition(anchorNode, anchorOffset);
                return;
            }

            const range = selection.getRangeAt(0);
            this.#escapeTag(range, localName, anchorNode, anchorOffset);
            return;
        }

        if (isInsideAWord) {
            this.#formatWord(selection, localName);
            return;
        }

        const element = document.createElement(localName);
        const range = selection.getRangeAt(0);
        range.insertNode(element);
        selection.setPosition(element, 0);
    }

    /**
     * Which way a range is toggled is calculated independently for each range,
     * which is maybe a bit unintuitive, but also extremely cornercase
     * @param {string} localName 
     * @param {Selection} selection 
     */
    #toggleAtRanges(localName, selection) {
        const ranges = selection.getComposedRanges()
            .map((_, index) => selection.getRangeAt(index))
            .reverse();

        for (const range of ranges) {
            const commonAncestor = range.commonAncestorContainer;
            const matchingParent = this.#findMatchingParent(commonAncestor, localName);

            if (commonAncestor.nodeType === Node.TEXT_NODE && !matchingParent) {
                const newElement = document.createElement(localName);
                range.surroundContents(newElement);
                continue;
            }

            const isAllFormatted = !this.#findTextNodeBy(commonAncestor, textNode => {
                return (range.isPointInRange(textNode, 0) || range.isPointInRange(textNode, textNode.textContent.length))
                    && textNode.textContent.trim()
                    && !this.#findMatchingParent(textNode, localName);
            });

            if (matchingParent || isAllFormatted) {
                this.#escapeTag(range, localName, range.endContainer, range.endOffset);
                continue;
            }

            this.#reformatRange(range, localName, 'replace');
        }
    }
}