export { textEditor as default };

class TextEditor {
    #blockElements = new Map([
        ['div', 'Text'],
        ['h2', 'Heading'],
        ['h3', 'Heading 2'],
        ['h4', 'Heading 3'],
        ['h5', 'Heading 4'],
        ['p', 'Paragraph']
    ]);

    #defaultKeys = [
        'ArrowUp',
        'ArrowDown',
        'ArrowLeft',
        'ArrowRight',
        'Control',
        'Delete'
    ];

    constructor() {
        const components = Array.from(document.querySelectorAll('text-editor-component'));
        const blockSelects = components.map(c => c.querySelector('select[select-blocktype]'));
        const buttonSets = components.map(c => Array.from(c.querySelectorAll('button[data-tag]')));
        const textBoxes = components.map(c => c.querySelector('text-box'));
        const htmlOutputs = components.map(c => c.querySelector('html-output'));

        components.forEach((component, key) => {
            const blockSelect = blockSelects[key];
            const buttons = buttonSets[key];
            const textBox = textBoxes[key];
            const htmlOutput = htmlOutputs[key];
            const keyInfo = component.querySelector('key-info');

            this.#blockElements.forEach((value, key) => {
                const option = document.createElement('option');
                option.value = key;
                option.textContent = value;
                blockSelect.appendChild(option);
            });
            blockSelect.addEventListener('change', () => this.#toggleTag(blockSelect.value, textBox, htmlOutput));

            buttons.forEach(button => {
                button.addEventListener('click', () => this.#toggleTag(button.dataset.tag, textBox, htmlOutput));
            });

            if (!this.#isBlockType(textBox.firstElementChild?.tagName) || textBox.firstChild.textContent.trim()) {
                const [blockType] = this.#blockElements.keys();
                const element = document.createElement(blockType);
                element.replaceChildren(...textBox.childNodes);
                textBox.appendChild(element);
                const range = document.createRange();
                range.selectNodeContents(element);
                window.getSelection().addRange(range);
            }

            textBox.addEventListener('input', () => this.#outputHtml(htmlOutput, textBox));

            textBox.addEventListener('keydown', event => {
                this.#textboxInput(event, buttons, textBox, htmlOutput);
                keyInfo.textContent = `:: Key: ${event.key} ::\r\n\r\n  Shift:   ${event.shiftKey}\r\n  Control: ${event.ctrlKey}\r\n  Alt:     ${event.altKey}`;
            });

            component.querySelector('[btn-cleanup').addEventListener('click', () => {
                this.#removeEmptyNodes(textBox);
                this.#outputHtml(htmlOutput, textBox);
            });

            this.#outputHtml(htmlOutput, textBox);
        });
    }

    /**
     * Handle keydown events for the text editor
     * @param {Event} event 
     * @param {HTMLButtonElement[]} buttons 
     * @param {HTMLElement} textBox
     * @param {HTMLElement} htmlOutput 
     */
    #textboxInput(event, buttons, textBox, htmlOutput) {
        if (this.#defaultKeys.some(k => k === event.key))
            return;

        const hasModifiers = (event, modifiers) => ((event.shiftKey * 0b1) + (event.ctrlKey * 0b10) + (event.altKey * 0b100)) === modifiers;
        const mod = Object.freeze({ none: 0b0, shift: 0b1, ctrl: 0b10, alt: 0b100 });

        if (event.key === 'Enter') {
            event.preventDefault();

            const selection = window.getSelection();

            if (hasModifiers(event, mod.shift))
                this.#insertBreak(selection, textBox);
            else if (hasModifiers(event, mod.none))
                this.#splitBlock(selection, textBox);

            this.#outputHtml(htmlOutput, textBox);
            return;
        }

        if (!hasModifiers(event, mod.ctrl))
            return;

        event.preventDefault();

        const button = buttons.find(b => b.dataset.shortcut?.toUpperCase() === event.key.toUpperCase());

        if (button)
            this.#toggleTag(button.dataset.tag, textBox, htmlOutput);
    }

    /**
     * Add or remove one or more tags of the specified type
     * @param {string} tagName 
     * @param {Element} textBox 
     * @param {Object} param2 
     */
    #toggleTag(tagName, textBox, htmlOutput = null) {
        const selection = window.getSelection();

        if (selection.type === 'None')
            return;

        if (!textBox.contains(selection.anchorNode))
            return;

        if (selection.anchorNode !== selection.focusNode)
            return;

        tagName = tagName.toUpperCase();
        const isBlock = this.#isBlockType(tagName);

        const node = selection.anchorNode;

        console.log(selection);
        const ancestor = this.#getAncestor(node, tagName, textBox);

        switch (node.nodeType) {
            case Node.ELEMENT_NODE:
                if (ancestor) {
                    this.#replaceWithContents(ancestor, selection);
                    break;
                }

                if (isBlock) {
                    this.#changeBlockType(node, tagName, textBox, selection);
                    break;
                }

                this.#appendElement(node, tagName, selection);
                break;

            case Node.TEXT_NODE:
                if (ancestor) {
                    this.#extractFromAncestor(ancestor, tagName, selection);
                    break;
                }

                if (isBlock) {
                    this.#changeBlockType(node, tagName, textBox, selection);
                    break;
                }

                if (!selection.isCollapsed) {
                    this.#encloseSelection(node, tagName, selection)
                    break;
                }

                if (this.#isOnEdge(selection)) {
                    this.#insertElement(selection, tagName);
                }

                this.#encloseSurroundings(selection, tagName);
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
     * @param {string} tagName 
     * @param {Selection} selection 
     */
    #appendElement(node, tagName, selection) {
        console.log('insertElement()');

        const element = document.createElement(tagName)
        node.appendChild(element);
        
        const range = document.createRange();
        range.setStart(element, 0);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
    }

    /**
     * Splits the current text node into up to three nodes and returns the new ones
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
     * @param {string} tagName 
     * @param {HTMLElement} textBox 
     */
    #changeBlockType(node, tagName, textBox, selection) {
        console.log('changeBlockType()');

        let rangeData = {
            node: selection.anchorNode,
            start: selection.anchorOffset,
            end: selection.focusOffset
        };
        if (rangeData.start > rangeData.end)
            [rangeData.start, rangeData.end] = [rangeData.end, rangeData.start];

        const blockElement = this.#getBlockElement(node, textBox, tagName);

        if (!blockElement)
            return;

        let container = blockElement;

        if (blockElement.tagName !== tagName) {
            container = document.createElement(tagName);
            container.replaceChildren(...blockElement.childNodes);
            blockElement.replaceWith(container);
        }

        const range = document.createRange();
        if (container.contains(rangeData.node)) {
            range.setStart(rangeData.node, rangeData.start);
            range.setEnd(rangeData.node, rangeData.end);
        }
        else {
            range.setStart(container, 0);
            range.collapse();
        }
        selection.removeAllRanges();
        selection.addRange(range);
    }

    /**
     * Encloses a selected text node in a new element with the specified tag
     * @param {Node} textNode 
     * @param {string} tagName 
     * @param {Selection} selection 
     */
    #encloseSelection(textNode, tagName, selection) {
        console.log('encloseSelection()');

        const newElement = document.createElement(tagName);
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
    #encloseSurroundings(selection, tagName) {
        console.log('encloseSurroundings()');

        const node = selection.anchorNode;

        if (node.nodeType !== Node.TEXT_NODE)
            return;

        const textContent = node.textContent;
        const offset = selection.anchorOffset;

        let start = textContent.lastIndexOf(' ', offset);
        let end = textContent.indexOf(' ', offset);

        end = end === -1 ? textContent.length : end;

        const element = document.createElement(tagName);
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
     * Removes the ancestor element after moving its contents out of it
     * Adds new elements of the same type where necessary
     * @param {HTMLElement} ancestor 
     * @param {string} tagName 
     * @param {Selection} selection 
     */
    #extractFromAncestor(ancestor, tagName, selection) {
        console.log('extractFromAncestor()');
        
        const currentNode = selection.anchorNode;
        const hasSelection = !selection.isCollapsed;

        const siblings = this.#getSiblings(ancestor, selection);
        siblings.push(...this.#createTextSiblings(selection));

        this.#replaceWithContents(ancestor, selection);

        for (const sibling of siblings) {
            if (sibling.textContent.trim()) {
                const element = document.createElement(tagName);
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
     * @param {string} tagName 
     * @param {Node} endNode 
     * @returns {(Node|false)}
     */
    #getAncestor(node, tagName, endNode) {
        console.log('getAncestor()');

        if (node.nodeType === Node.TEXT_NODE)
            node = node.parentElement;

        while (node && node !== endNode) {
            if (node.tagName === tagName)
                return node;

            node = node.parentElement;
        }

        return false;
    }

    /**
     * Searches through parent elements for a block element, until an end node is reached.
     * Creates a new block element in the endNode if none can be found.
     * @param {Node} node 
     * @param {Node} endNode 
     * @returns {HTMLElement}
     */
    #getBlockElement(node, endNode, tagName = null) {
        console.log('getBlockElement()');

        if (!endNode)
            return null;

        if (node.nodeType === Node.TEXT_NODE)
            node = node.parentElement;

        while (node && node !== endNode) {
            if (this.#isBlockType(node.tagName))
                return node;

            if (node.parentElement === endNode) {
                if (!tagName)
                    [tagName] = this.#blockElements.keys();
                
                const element = document.createElement(tagName);
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
     * Inserts a <br> element and a text node if necessary, then moves the caret
     * @param {Selection} selection 
     * @param {HTMLElement} textBox 
     */
    #insertBreak(selection, textBox) {
        selection.deleteFromDocument();

        const range = document.createRange();
        let node = selection.anchorNode;
        const offset = selection.anchorOffset;
        
        switch (offset) {
            case 0:
                while (node.parentElement !== textBox) {
                    if (this.#isBlockType(node.parentElement.tagName))
                        break;

                    if (node.previousSibling && node.previousSibling.textContent.trim())
                        break;

                    node = node.parentElement;
                }
                range.setStartBefore(node);
                break;

            case node.textContent.length:
                while (node.parentElement !== textBox) {
                    if (this.#isBlockType(node.parentElement.tagName))
                        break;

                    if (node.nextSibling && node.nextSibling.textContent.trim())
                        break;

                    node = node.parentElement;
                }
                range.setStartAfter(node);
                break;

            default:
                range.setStart(node, offset);
                break;
        }   

        range.collapse();
        const linebreak = document.createElement('br');
        range.insertNode(linebreak);

        if (!linebreak.nextSibling || !linebreak.nextSibling.textContent.trim()) {
            const textNode = document.createTextNode(' ');
            linebreak.parentNode.insertBefore(textNode, linebreak);
            linebreak.parentNode.insertBefore(linebreak, textNode);
            range.selectNode(textNode);
        }
        else
            range.setStartAfter(linebreak);

        range.collapse();
        selection.removeAllRanges();
        selection.addRange(range);
    }

    /**
     * Inserts an element at the caret position and fills it with a selected whitespace
     * @param {Selection} selection 
     * @param {string} tagName
     */
    #insertElement(selection, tagName) {
        if (!selection.isCollapsed)
            return;

        const textNode = selection.anchorNode;

        if (textNode.nodeType !== Node.TEXT_NODE)
            return;
        
        const range = document.createRange();
        range.setStart(selection.anchorNode, selection.anchorOffset);
        range.collapse();
        const element = document.createElement(tagName);
        element.innerHTML = '&nbsp;';
        range.insertNode(element);
        range.selectNodeContents(element);
        selection.removeAllRanges();
        selection.addRange(range);
    }

    /**
     * Checks if the specified tag type is in the list of block tags
     * @param {string} tagName 
     * @returns {boolean}
     */
    #isBlockType(tagName) {
        return this.#blockElements.has(tagName?.toLowerCase());
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

    #splitBlock(selection, textBox) {
        selection.deleteFromDocument();
        const currentBlock = this.#getBlockElement(selection.anchorNode, textBox);

        if (!currentBlock.hasChildNodes())
            return;
        

        // Identify siblings and aunties to be divided between old and new block

        const parent = currentBlock.parentNode;
        const newBlock = document.createElement(currentBlock.tagName);
        parent.insertBefore(newBlock, currentBlock);
        parent.insertBefore(currentBlock, newBlock);
        const range = document.createRange();
        range.selectNodeContents(newBlock);
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

        // let textContent = source.innerHTML.trim()
        //     .replace(new RegExp(/( +<)/, 'g'), '<');

        // for (const key in this.#blockElements.keys()) {
        //     textContent = textContent
        //         .replace(`<${key}>`, `<${key}>\r\n`)
        //         .replace(`</${key}>`, `\r\n</${key}>`);
        // }
        
        // container.textContent = textContent;

        container.textContent = source.innerHTML;
    }
}
const textEditor = new TextEditor();