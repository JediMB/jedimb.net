export { textEditor as default };

class TextEditor {
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

            component.querySelector('[btn-cleanup').addEventListener('click', () => this.#removeEmptyNodes(textBox));
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

                if (selection.isCollapsed) {
                    this.#encloseSurroundings(selection, tagType, inline);
                    break;
                }

                this.#encloseSelection(node, tagType, selection)
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
    #encloseSurroundings(selection, tagType, isInline) {
        console.log('encloseSurroundings()');

        const node = selection.anchorNode;

        if (!isInline) {
            this.#encloseNode(node, tagType);
            return;
        }

        if (node.nodeType !== Node.TEXT_NODE)
            return;

        const textContent = node.textContent;
        const offset = selection.anchorOffset;

        console.log(`Offset: ${offset}, char: '${textContent[offset]}'`);
        if (offset === 0 || offset === textContent.length || textContent[offset] === ' ') {
            this.#insertElement(selection, tagType);
            console.log('node enclosed');
            return;
        }

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

        if (!node.hasChildNodes()) {
            node.remove();
            return;
        }

        const children = Array.from(node.childNodes);
        const parent = node.parentNode;

        children.forEach(child => {
            parent.insertBefore(child, node);
        });

        node.remove();
        parent.normalize();
    }
}
const textEditor = new TextEditor();