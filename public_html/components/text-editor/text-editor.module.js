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

                this.#insertElement(node, tagType, selection);
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
     * 
     * @param {Selection} selection 
     * @returns {Node[]}
     */
    #createTextSiblings(selection) {
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

        return siblings;
    }

    /**
     * 
     * @param {Node} node 
     * @param {string} tagType 
     * @param {Selection} selection 
     */
    #encloseNode(node, tagType) {
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
        const node = selection.anchorNode;

        if (!isInline) {
            this.#encloseNode(node, tagType);
            return;
        }

        if (node.nodeType !== Node.TEXT_NODE)
            return;

        const textContent = node.textContent;
        const offset = selection.anchorOffset;
        let start = textContent.lastIndexOf(' ', offset) + 1;
        let end = textContent.indexOf(' ', offset);

        // TODO: Fix off-by-one for [end] when cursor is between a word and a blankspace

        console.log(offset, ':', start, end);

        start = start === -1 ? 0 : start;
        end = end === -1 ? textContent.length : end;

        
        const range = document.createRange();
        range.setStart(node, start);
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
     * 
     * @param {Node} node 
     * @param {string} tagType 
     * @param {Selection} selection 
     */
    #insertElement(node, tagType, selection) {
        const element = document.createElement(tagType)
        node.appendChild(element);
        
        const range = document.createRange();
        range.setStart(element, 0);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
    }

    /**
     * Replaces the provided node with its contents
     * @param {Element} node 
     * @param {Selection} selection 
     */
    #replaceWithContents(node, selection) {
        // TODO: If contents is a text node, merge with adjacent text nodes

        if (!node.hasChildNodes()){
            node.remove();
        }

        const children = Array.from(node.childNodes);

        children.forEach(child => {
            node.parentNode.insertBefore(child, node);
        });

        node.remove();
    }
}
const textEditor = new TextEditor();