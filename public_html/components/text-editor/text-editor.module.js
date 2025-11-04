export { textEditor as default };

class TextEditor {
    blockElements = [
        "h2", "h3", "h4", "h5", "div", "p"
    ];

    constructor() {
        const components = Array.from(document.querySelectorAll('text-editor-component'));
        const textBoxes = components.map(c => c.querySelector('text-box'));
        const htmlOutputs = components.map(c => c.querySelector('html-output'));

        components.forEach((component, key) => {
            const textBox = textBoxes[key];
            const htmlOutput = htmlOutputs[key];

            textBox.addEventListener('input', () => {
                htmlOutput.textContent = textBox.innerHTML
                    .replace('</div>', '</div>\r\n')
                    .replace('</p>', '</p>\r\n');
            })

            component.querySelector('[btn-bold]').addEventListener('click', () => this.#toggleTag('B', textBox, { htmlOutput: htmlOutput }));
            component.querySelector('[btn-italics]').addEventListener('click', () => this.#toggleTag('I', textBox, { htmlOutput: htmlOutput }));
            component.querySelector('[btn-h2]').addEventListener('click', () => this.#toggleTag('H2', textBox, { htmlOutput: htmlOutput, inline: false }));

            component.querySelector('[btn-cleanup').addEventListener('click', () => {
                this.#removeEmptyNodes(textBox);

                htmlOutput.textContent = textBox.innerHTML
                    .replace('</div>', '</div>\r\n')
                    .replace('</p>', '</p>\r\n');
            });
        });
    }

    /**
     * 
     * @param {string} tagType 
     * @param {Element} textBox 
     * @param {Object} param2 
     */
    #toggleTag(tagType, textBox, { htmlOutput = null, inline = true }) {
        tagType = tagType.toUpperCase();

        const selection = window.getSelection();

        if (!textBox.contains(selection.anchorNode))
            return;

        if (selection.anchorNode !== selection.focusNode)
            return;

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
                    const siblings = this.#getSiblings(ancestor, selection);
                    siblings.push(...this.#createTextSiblings(selection));

                    this.#replaceWithContents(ancestor, selection);

                    siblings.forEach(s => this.#encloseNode(s, tagType, selection));
                    break;
                }

                if (!selection.isCollapsed) {
                    this.#encloseSelection(node, tagType, selection)
                    break;
                }

                if (!inline) {
                    this.#encloseNode(node, tagType);
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

        htmlOutput.textContent = textBox.innerHTML
            .replace('</div>', '</div>\r\n')
            .replace('</p>', '</p>\r\n');
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
     * @param {Selection} selection 
     */
    #encloseNode(node, tagType) {
        console.log('encloseNode()');

        const element = document.createElement(tagType);
        const parent = node.parentElement;
        parent.insertBefore(element, node);
        element.appendChild(node);
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

        const range = document.createRange();
        range.setStart(node, start + 1);
        range.setEnd(node, end);
        selection.removeAllRanges();
        selection.addRange(range);

        this.#createTextSiblings(selection);

        this.#encloseNode(node, tagType);
    }

    #isOnEdge(selection) {
        const textContent = selection.anchorNode.textContent;
        const offset = selection.anchorOffset;

        return (offset === 0 || offset === textContent.length || textContent[offset] === ' ');
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
        const currentOffset = selection.anchorOffset;

        const children = Array.from(node.childNodes);
        const parent = node.parentNode;

        children.forEach(child => {
            parent.insertBefore(child, node);
        });

        node.remove();

        let newOffset = currentOffset;
        const newSiblings = Array.from(parent.childNodes);

        for (const sibling of newSiblings) {
            if (currentNode === sibling)
                break;

            if (sibling.nodeType === Node.TEXT_NODE)
                newOffset += sibling.textContent.length;
        }

        parent.normalize();

        if (parent.contains(currentNode))
            range.setStart(currentNode, currentOffset);
        else {
            const newTextNode = Array.from(parent.childNodes).find(c => c.nodeType === Node.TEXT_NODE);
            range.setStart(newTextNode, newOffset);
        }

        range.collapse();
        selection.removeAllRanges();
        selection.addRange(range);
    }
}
const textEditor = new TextEditor();