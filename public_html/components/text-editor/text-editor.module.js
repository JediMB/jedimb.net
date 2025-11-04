export { textEditor as default };

class TextEditor {
    #blockElements = [
        'h2', 'h3', 'h4', 'h5', 'div', 'p'
    ];

    constructor() {
        const components = Array.from(document.querySelectorAll('text-editor-component'));
        const textBoxes = components.map(c => c.querySelector('text-box'));
        const htmlOutputs = components.map(c => c.querySelector('html-output'));

        components.forEach((component, key) => {
            const textBox = textBoxes[key];
            const htmlOutput = htmlOutputs[key];

            textBox.addEventListener('input', () => this.#outputHtml(htmlOutput, textBox));

            const buttons = Array.from(component.querySelectorAll('button[data-tag]'));

            buttons.forEach(button => {
                button.addEventListener('click', () => this.#toggleTag(button.dataset.tag, textBox, htmlOutput));
            });

            textBox.addEventListener('keydown', event => {
                if (event.key === "Control")
                    return;

                if (!event.ctrlKey)
                    return;

                event.preventDefault();

                const button = buttons.find(b => b.dataset.shortcut?.toUpperCase() === event.key.toUpperCase());

                if (button)
                    this.#toggleTag(button.dataset.tag, textBox, htmlOutput);
            });

            component.querySelector('[btn-h2]').addEventListener('click', () => this.#toggleTag('h2', textBox, htmlOutput));

            component.querySelector('[btn-cleanup').addEventListener('click', () => {
                this.#removeEmptyNodes(textBox);
                this.#outputHtml(htmlOutput, textBox);
            });

            this.#outputHtml(htmlOutput, textBox);
        });
    }

    /**
     * 
     * @param {string} tagType 
     * @param {Element} textBox 
     * @param {Object} param2 
     */
    #toggleTag(tagType, textBox, htmlOutput = null) {
        const selection = window.getSelection();

        if (!textBox.contains(selection.anchorNode))
            return;

        if (selection.anchorNode !== selection.focusNode)
            return;

        tagType = tagType.toUpperCase();
        const isBlock = this.#isBlockType(tagType);

        const node = selection.anchorNode;

        console.log(selection);
        const ancestor = this.#getAncestor(node, tagType, textBox);

        switch (node.nodeType) {
            case Node.ELEMENT_NODE:
                if (ancestor) {
                    this.#replaceWithContents(ancestor, selection);
                    break;
                }

                this.#appendElement(node, tagType, selection);
                break;

            case Node.TEXT_NODE:
                if (ancestor) {
                    this.#extractFromAncestor(ancestor, tagType, selection);
                    break;
                }

                if (isBlock) {
                    this.#changeBlockType(node, tagType, textBox, selection);
                    break;
                }

                if (!selection.isCollapsed) {
                    this.#encloseSelection(node, tagType, selection)
                    break;
                }

                if (this.#isOnEdge(selection)) {
                    this.#insertElement(selection, tagType);
                }

                this.#encloseSurroundings(selection, tagType);
                break;


            default:
                console.error('This node is something else...');
                break;
        }

        this.#outputHtml(htmlOutput, textBox);
    }

    /**
     * Appends a new element child to the selected node
     * @param {Node} node 
     * @param {string} tagType 
     * @param {Selection} selection 
     */
    #appendElement(node, tagType, selection) {
        console.log('insertElement()');

        const element = document.createElement(tagType)
        node.appendChild(element);
        
        const range = document.createRange();
        range.setStart(element, 0);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
    }

    /**
     * 
     * @param {Selection} selection 
     * @returns {Node[]}
     */
    #createTextSiblings(selection) {
        console.log('createTextSiblings()');

        if (selection.isCollapsed)
            return [];

        const node = selection.anchorNode;

        if (node.nodeType !== Node.TEXT_NODE)
            return [];

        let start = selection.anchorOffset,
            end = selection.focusOffset;
        if (start > end) [start, end] = [end, start];

        const siblings = [];
        const textContent = node.textContent;

        if (start > 0) {
            const newNode = document.createTextNode(textContent.substring(0, start));
            node.parentNode.insertBefore(newNode, node);
            siblings.push(newNode);
        }

        if (end < textContent.length) {
            const newNode = document.createTextNode(textContent.substring(end));
            node.parentNode.insertBefore(newNode, node);
            node.parentNode.insertBefore(node, newNode);
            siblings.push(newNode);
        }

        node.textContent = textContent.substring(start, end);

        console.log('siblings created');
        return siblings;
    }

    /**
     * 
     * @param {Node} node 
     * @param {string} tagType 
     * @param {HTMLElement} textBox 
     */
    #changeBlockType(node, tagType, textBox, selection) {
        console.log('changeBlockType()');

        let rangeData = {
            node: selection.anchorNode,
            start: selection.anchorOffset,
            end: selection.focusOffset
        };
        if (rangeData.start > rangeData.end)
            [rangeData.start, rangeData.end] = [rangeData.end, rangeData.start];

        const blockElement = this.#getBlockElement(node, textBox);

        if (!blockElement || blockElement.tagType === tagType)
            return;

        const element = document.createElement(tagType);
        element.replaceChildren(...blockElement.childNodes);
        blockElement.replaceWith(element);

        const range = document.createRange();
        range.setStart(rangeData.node, rangeData.start);
        range.setEnd(rangeData.node, rangeData.end);
        selection.removeAllRanges();
        selection.addRange(range);
    }

    /**
     * Encloses a selected text node in a new element with the specified tag
     * @param {Node} textNode 
     * @param {string} tagType 
     * @param {Selection} selection 
     */
    #encloseSelection(textNode, tagType, selection) {
        console.log('encloseSelection()');

        const newElement = document.createElement(tagType);
        const range = document.createRange();

        let start = selection.anchorOffset,
            end = selection.focusOffset;
        if (start > end) [start, end] = [end, start];
        
        range.setStart(textNode, start);
        range.setEnd(textNode, end);
        range.surroundContents(newElement);
        selection.removeAllRanges();
        selection.selectAllChildren(newElement);
    }

    /**
     * Encloses the current word if inline; otherwise the entire text node
     * @param {Selection} selection 
     * @param {boolean} inline 
     */
    #encloseSurroundings(selection, tagType) {
        console.log('encloseSurroundings()');

        const node = selection.anchorNode;

        if (node.nodeType !== Node.TEXT_NODE)
            return;

        const textContent = node.textContent;
        const offset = selection.anchorOffset;

        let start = textContent.lastIndexOf(' ', offset);
        let end = textContent.indexOf(' ', offset);

        end = end === -1 ? textContent.length : end;

        const element = document.createElement(tagType);
        const wordRange = document.createRange();
        wordRange.setStart(node, ++start);
        wordRange.setEnd(node, end);
        wordRange.surroundContents(element);

        const range = document.createRange();
        range.setStart(element.firstChild, offset - start);
        range.collapse();
        selection.removeAllRanges();
        selection.addRange(range);
    }

    /**
     * 
     * @param {Node} ancestor 
     * @param {string} tagType 
     * @param {Selection} selection 
     */
    #extractFromAncestor(ancestor, tagType, selection) {
        console.log('extractFromAncestor()');
        
        const currentNode = selection.anchorNode;
        const hasSelection = !selection.isCollapsed;

        const siblings = this.#getSiblings(ancestor, selection);
        siblings.push(...this.#createTextSiblings(selection));

        this.#replaceWithContents(ancestor, selection);

        for (const sibling of siblings) {
            if (sibling.textContent.trim()) {
                const element = document.createElement(tagType);
                sibling.parentElement.insertBefore(element, sibling);
                element.appendChild(sibling);
            }
        }

        if (hasSelection) {
            const range = document.createRange();
            range.selectNode(currentNode);
            selection.removeAllRanges();
            selection.addRange(range);
        }
    }

    /**
     * Searches through parent elements for an ancestor, until an end node is reached
     * @param {Node} node 
     * @param {string} tagType 
     * @param {Node} endNode 
     * @returns {(Node|false)}
     */
    #getAncestor(node, tagType, endNode) {
        console.log('getAncestor()');

        if (node.nodeType === Node.TEXT_NODE)
            node = node.parentElement;

        while (node && node !== endNode) {
            if (node.tagName === tagType)
                return node;

            node = node.parentElement;
        }

        return false;
    }

    /**
     * Searches through parent elements for a block element, until an end node is reached.
     * Creates a new div in the endNode if none can be found.
     * @param {Node} node 
     * @param {Node} endNode 
     * @returns {HTMLElement}
     */
    #getBlockElement(node, endNode) {
        console.log('getBlockElement()');

        if (!endNode)
            return null;

        if (node.nodeType === Node.TEXT_NODE)
            node = node.parentElement;

        while (node && node !== endNode) {
            if (this.#isBlockType(node.tagName))
                return node;

            if (node.parentElement === endNode) {
                const element = document.createElement('div');
                node.parentElement.insertBefore(element, node);
                element.appendChild(node);
                return element;
            }

            node = node.parentElement;
        }

        return null;
    }

    /**
     * Returns siblings/aunties
     * @param {Node} ancestor 
     * @param {Selection} selection 
     * @returns {(Node[])}
     */
    #getSiblings(ancestor, selection) {
        console.log('getSiblings()');

        if (selection.isCollapsed)
            return [];

        const selectedNode = selection.anchorNode;

        let nonSibling = ancestor;
        const foundFamily = [];

        while (nonSibling && nonSibling !== selectedNode) {
            const children = Array.from(nonSibling.childNodes);
            foundFamily.push(...children.filter(n => n !== selectedNode && !n.contains(selectedNode)));
            nonSibling = children.find(n => n === selectedNode && n.contains(selectedNode));
        }
        
        return foundFamily;
    }

    /**
     * Inserts an element at the caret position and fills it with a selected whitespace
     * @param {Selection} selection 
     * @param {string} tagType
     */
    #insertElement(selection, tagType) {
        if (!selection.isCollapsed)
            return;

        const textNode = selection.anchorNode;

        if (textNode.nodeType !== Node.TEXT_NODE)
            return;
        
        const range = document.createRange();
        range.setStart(selection.anchorNode, selection.anchorOffset);
        range.collapse();
        const element = document.createElement(tagType);
        element.innerHTML = '&nbsp;';
        range.insertNode(element);
        range.selectNodeContents(element);
        selection.removeAllRanges();
        selection.addRange(range);
    }

    /**
     * Checks if the specified tag type is in the list of block tags
     * @param {string} tagType 
     * @returns {boolean}
     */
    #isBlockType(tagType) {
        tagType = tagType.toUpperCase();

        return this.#blockElements.some(e => e.toUpperCase() === tagType)
    }

    /**
     * Checks if the caret is at the edge of a text, or on a whitespace
     * @param {Selection} selection 
     * @returns {boolean}
     */
    #isOnEdge(selection) {
        if (!selection.isCollapsed)
            false;

        const textContent = selection.anchorNode.textContent;
        const offset = selection.anchorOffset;

        return (offset === 0 || offset === textContent.length || textContent[offset] === ' ');
    }

    /**
     * Cleans up the DOM by removing empty nodes
     * @param {Node} textBox 
     */
    #removeEmptyNodes(textBox) {
        const treeWalker = document.createTreeWalker(textBox, NodeFilter.SHOW_ELEMENT);
        const emptyNodes = [];
        const isEmpty = node => !node.textContent.trim();

        let currentNode = treeWalker.currentNode;

        while (currentNode) {
            if (isEmpty(currentNode))
                emptyNodes.push(currentNode);

            currentNode = treeWalker.nextNode();
        }

        emptyNodes.forEach(node => node.parentNode.removeChild(node));
    }

    /**
     * Replaces the provided node with its contents
     * @param {Element} node 
     * @param {Selection} selection 
     */
    #replaceWithContents(node, selection) {
        console.log('replaceWithContents()');

        const range = document.createRange();

        if (!node.hasChildNodes()) {
            console.log('no child nodes');

            if (node.previousSibling)
                range.setStartAfter(node.previousSibling);
            else if (node.nextSibling)
                range.setStartBefore(node.nextSibling);
            else
                range.setStart(node.parentNode, 0);

            node.remove();

            selection.removeAllRanges();
            selection.addRange(range);
            return;
        }

        const currentNode = selection.anchorNode;
        let currentOffset = selection.anchorOffset;

        const children = Array.from(node.childNodes);
        const parent = node.parentNode;

        children.forEach(child => {
            parent.insertBefore(child, node);
        });

        node.remove();

        if (currentNode.nodeType !== Node.TEXT_NODE)
            return;

        const prevSibling = currentNode.previousSibling;
        if (prevSibling && prevSibling.nodeType === Node.TEXT_NODE) {
            currentOffset += prevSibling.textContent.length;
            currentNode.textContent = prevSibling.textContent + currentNode.textContent;
            prevSibling.remove();
        }

        const nextSibling = currentNode.nextSibling;
        if (nextSibling && nextSibling.nodeType === Node.TEXT_NODE) {
            currentNode.textContent += nextSibling.textContent;
            nextSibling.remove();
        }

        range.setStart(currentNode, currentOffset);
        range.collapse();
        selection.removeAllRanges();
        selection.addRange(range);
    }

    /**
     * Outputs the innerHTML of the source node as textContent of the container
     * @param {Node} container 
     * @param {Node} source
     */
    #outputHtml(container, source) {
        if (!container || !source)
            return;

        let textContent = source.innerHTML.trim()
            .replace(new RegExp(/( +<)/, 'g'), '<');

        this.#blockElements.forEach(e => textContent = textContent
            .replace(`<${e}>`, `<${e}>\r\n`)
            .replace(`</${e}>`, `\r\n</${e}>`)
        );
        
        container.textContent = textContent;
    }
}
const textEditor = new TextEditor();