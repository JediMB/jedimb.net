export { textEditor as default };

class TextEditor {
    logFuncs = false;

    #blockElements = new Map([
        ['div', 'Text'],
        ['h2', 'Heading'],
        ['h3', 'Heading 2'],
        ['h4', 'Heading 3'],
        ['h5', 'Heading 4'],
        ['p', 'Paragraph']
    ]);

    #defaultKeys = [
        'Control',
        'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
        'Enter',
        'A', 'C', 'V', 'X', 'Z'
    ].map(v => v.toUpperCase());

    #buttonSets;
    #textBoxes;
    #htmlOutputs;

    constructor() {
        const components = Array.from(document.querySelectorAll('text-editor-component'));
        const fieldsets = components.map(c => c.querySelector('fieldset'));
        const blockSelects = components.map(c => c.querySelector('select[select-blocktype]'));
        this.#buttonSets = components.map(c => Array.from(c.querySelectorAll('button[data-tag]')));
        this.#textBoxes = components.map(c => c.querySelector('text-box'));
        this.#htmlOutputs = components.map(c => c.querySelector('html-output'));

        document.addEventListener('selectionchange', () => {
            const selection = window.getSelection();
            const boxIndex = this.#textBoxes.findIndex(t => t.contains(selection.anchorNode) && t.contains(selection.focusNode));

            fieldsets.forEach((fs, index) => fs.disabled = boxIndex !== index);

            if (boxIndex < 0)
                return;

            const textBox = this.#textBoxes[boxIndex];

            const selectedTextNodes = this.#getTextNodesFromSelection();

            if (selectedTextNodes.length === 0)
                [blockSelects[boxIndex].value] = this.#blockElements.keys();
            else {
                const selectedBlocks = selectedTextNodes.map(n => this.#getBlockElement(n, textBox));

                const identicalBlocks = selectedBlocks.length > 0
                    && selectedBlocks.every((val, _, arr) => val.tagName === arr[0].tagName);

                blockSelects[boxIndex].value = identicalBlocks
                    ? selectedBlocks[0].tagName.toLowerCase()
                    : null;
            }

            this.#buttonSets[boxIndex].forEach(b => b.classList.toggle('active',
                selectedTextNodes.every(n => !!this.#getMatchingAncestor(n, b.dataset.tag, textBox))
            ));
        });

        components.forEach((component, index) => {
            const blockSelect = blockSelects[index];
            const buttons = this.#buttonSets[index];
            const textBox = this.#textBoxes[index];
            const keyInfo = component.querySelector('key-info');

            this.#blockElements.forEach((value, key) => {
                const option = document.createElement('option');
                option.value = key;
                option.textContent = value;
                blockSelect.appendChild(option);
            });
            blockSelect.addEventListener('change', () => this.#toggleTag(index, blockSelect.value));

            buttons.forEach(button => {
                button.addEventListener('click', () => this.#toggleTag(index, button.dataset.tag));
            });

            window.getSelection().setPosition(
                this.#getBlockElement(textBox.firstChild, textBox, blockSelect.value), 0
            );

            textBox.addEventListener('input', () => {
                if (!textBox.textContent.trim())
                    this.#getBlockElement(textBox.firstChild, textBox, blockSelect.value);

                this.#outputHtml(index);
            });

            textBox.addEventListener('keydown', event => {
                this.#textboxInput(index, event);
                keyInfo.textContent = `:: Key: ${event.key} ::\r\n\r\n  Shift:   ${event.shiftKey}\r\n  Control: ${event.ctrlKey}\r\n  Alt:     ${event.altKey}`;
            });

            component.querySelector('[btn-cleanup').addEventListener('click', () => {
                this.#removeEmptyNodes(textBox);
                this.#outputHtml(index);
            });

            this.#outputHtml(index);
        });
    }

    /**
     * Handle keydown events for the text editor
     * @param {Number} index
     * @param {Event} event 
     */
    #textboxInput(index, event) {
        const keyUpper = event.key.toUpperCase();

        if (this.#defaultKeys.some(k => k === keyUpper))
            return;

        const hasModifiers = (modifiers) => modifiers === ((event.shiftKey * 0b1) + (event.ctrlKey * 0b10) + (event.altKey * 0b100));
        const mod = Object.freeze({ none: 0b0, shift: 0b1, ctrl: 0b10, alt: 0b100 });

        if (!hasModifiers(mod.ctrl))
            return;

        event.preventDefault();

        const button = this.#buttonSets[index].find(b => b.dataset.shortcut?.toUpperCase() === keyUpper);

        if (button)
            this.#toggleTag(index, button.dataset.tag);
    }

    /**
     * Add or remove one or more tags of the specified type
     * @param {Number} index 
     * @param {string} tagName 
     */
    #toggleTag(index, tagName) {
        const selection = window.getSelection();
        const textBox = this.#textBoxes[index];
        tagName = tagName.toUpperCase();

        if (!textBox.contains(selection.anchorNode) || !textBox.contains(selection.focusNode))
            return;

        const selectedTextNodes = this.#getTextNodesFromSelection();

        if (selectedTextNodes.length < 1)
            return;

        const oldSelection = {};

        const isForward = selection.direction === 'forward';

        if (selection.isCollapsed || isForward) {
            oldSelection.startNode = selection.anchorNode;
            oldSelection.startOffset = selection.anchorOffset;
        }
        
        if (isForward) {
            oldSelection.endNode = selection.focusNode;
            oldSelection.endOffset = selection.focusOffset;
        }
        else {
            oldSelection.startNode = selection.focusNode;
            oldSelection.startOffset = selection.focusOffset;
            oldSelection.endNode = selection.anchorNode;
            oldSelection.endOffset = selection.anchorOffset;
        }
        

        if (this.#isBlockType(tagName)) {
            const blockMatches = new Set(selectedTextNodes.map(text => this.#getBlockElement(text, textBox, tagName)));

            for (const match of blockMatches) {
                this.#replaceElement(match, tagName);
            }
        }
        else {
            const ancestorMatches = selectedTextNodes.map(n => this.#getMatchingAncestor(n, tagName, textBox));
            const uniqueMatches = new Set(ancestorMatches.filter(match => !!match));
            const noMatches = ancestorMatches.every(match => !match);


        }

        this.#makeSelection(oldSelection);
        this.#outputHtml(index);


        // const node = selection.anchorNode;
        // const ancestor = this.#getMatchingAncestor(node, tagName, textBox);
        

        // switch (node.nodeType) {
        //     case Node.ELEMENT_NODE:
        //         if (ancestor) {
        //             this.#replaceWithContents(ancestor, selection);
        //             break;
        //         }

        //         if (isBlockType) {
        //             this.#changeBlockType(node, tagName, textBox, selection);
        //             break;
        //         }

        //         this.#appendElement(node, tagName);
        //         break;

        //     case Node.TEXT_NODE:
        //         if (ancestor) {
        //             this.#extractFromAncestor(ancestor, tagName, selection);
        //             break;
        //         }

        //         if (isBlockType) {
        //             this.#changeBlockType(node, tagName, textBox, selection);
        //             break;
        //         }

        //         if (!selection.isCollapsed) {
        //             this.#encloseSelection(node, tagName, selection)
        //             break;
        //         }

        //         if (this.#isOnEdge(selection)) {
        //             this.#insertElement(selection, tagName);
        //         }

        //         this.#encloseSurroundings(selection, tagName);
        //         break;


        //     default:
        //         console.error('This node is something else...');
        //         break;
        // }

    }

    /**
     * Searches through parent elements for a block element, until an end node is reached.
     * Creates a new block element in the endNode if none can be found.
     * @param {Node} node 
     * @param {Node} endNode 
     * @returns {HTMLElement}
     */
    #getBlockElement(node, endNode, tagName = null) {
        this.logFuncs && console.log('getBlockElement()');

        if (!endNode)
            return null;

        if (!tagName)
            [tagName] = this.#blockElements.keys();

        if (!node) {
            const newElement = document.createElement(tagName);
            endNode.appendChild(newElement);
            return newElement;
        }

        if (node.nodeType === Node.TEXT_NODE)
            node = node.parentElement;

        while (node && node !== endNode) {
            if (this.#isBlockType(node.tagName))
                return node;

            if (node.parentElement === endNode) {
                const newElement = document.createElement(tagName);
                node.parentElement.insertBefore(newElement, node);
                newElement.appendChild(node);
                return newElement;
            }

            node = node.parentElement;
        }
    }

    #makeSelection({startNode, startOffset, endNode = null, endOffset = null}) {
        if (!endNode || !endOffset) {
            window.getSelection().setPosition(startNode, startOffset);
            return;
        }

        window.getSelection().setBaseAndExtent(startNode, startOffset, endNode, endOffset);
    }

    /**
     * Replaces an element with one with a new tag that takes the old element's children
     * @param {HTMLElement} element 
     * @param {string} newTag 
     * @returns {HTMLElement}
     */
    #replaceElement(element, newTag) {
        if (element.tagName === newTag)
            return element;

        const newElement = document.createElement(newTag);

        for (const child of element.childNodes) {
            newElement.appendChild(child);
        }

        element.parentNode.insertBefore(newElement, element);
        element.remove();

        return newElement;
    }























    /**
     * Appends a new element child to the selected node
     * @param {Node} node 
     * @param {string} tagName 
     */
    #appendElement(node, tagName) {
        this.logFuncs && console.log('appendElement()');

        const element = document.createElement(tagName)
        node.appendChild(element);
        
        window.getSelection().setPosition(element, 0);
    }

    /**
     * Splits the current text node into up to three nodes and returns the new ones
     * @param {Selection} selection 
     * @returns {Node[]}
     */
    #createTextSiblings(selection) {
        this.logFuncs && console.log('createTextSiblings()');

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
     * @param {string} tagName 
     * @param {HTMLElement} textBox 
     * @param {Selection} selection 
     */
    #changeBlockType(node, tagName, textBox, selection) {
        this.logFuncs && console.log('changeBlockType()');

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

        if (container.contains(rangeData.node)) {
            selection.setBaseAndExtent(rangeData.node, rangeData.start, rangeData.node, rangeData.end);
            return;
        }
        
        selection.setPosition(container, 0);
    }

    /**
     * Encloses a selected text node in a new element with the specified tag
     * @param {Node} textNode 
     * @param {string} tagName 
     * @param {Selection} selection 
     */
    #encloseSelection(textNode, tagName, selection) {
        this.logFuncs && console.log('encloseSelection()');

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
        this.logFuncs && console.log('encloseSurroundings()');

        const node = selection.anchorNode;

        if (node.nodeType !== Node.TEXT_NODE)
            return;

        const textContent = node.textContent;
        const offset = selection.anchorOffset;

        let start = textContent.lastIndexOf(' ', offset);
        let end = textContent.indexOf(' ', offset);

        end = end === -1 ? textContent.length : end;

        const range = document.createRange();
        range.setStart(node, ++start);
        range.setEnd(node, end);

        const element = document.createElement(tagName);
        range.surroundContents(element);

        selection.setPosition(element.firstChild, offset - start);
    }

    /**
     * Removes the ancestor element after moving its contents out of it
     * Adds new elements of the same type where necessary
     * @param {HTMLElement} ancestor 
     * @param {string} tagName 
     * @param {Selection} selection 
     */
    #extractFromAncestor(ancestor, tagName, selection) {
        this.logFuncs && console.log('extractFromAncestor()');
        
        const currentNode = selection.anchorNode;
        const hasSelection = !selection.isCollapsed;

        const siblings = this.#getSiblings(ancestor, selection);
        const newSiblings = this.#createTextSiblings(selection); 
        siblings.push(...newSiblings);

        this.#replaceWithContents(ancestor, selection, !newSiblings.length);

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
    #getMatchingAncestor(node, tagName, endNode) {
        this.logFuncs && console.log('getAncestor()');

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
     * Returns siblings/aunties
     * @param {Node} ancestor 
     * @param {Selection} selection 
     * @param {Boolean} split Whether to split into before and after arrays
     * @returns {(Node[]|Node[][])}
     */
    #getSiblings(ancestor, selection) {
        this.logFuncs && console.log('getSiblings()');

        if (selection.isCollapsed)
            return [];

        const selectedNode = selection.anchorNode;

        let nonSibling = ancestor;
        const foundFamily = [];

        while (nonSibling && nonSibling !== selectedNode) {
            const children = Array.from(nonSibling.childNodes);
            foundFamily.push(...children.filter(n => !n.contains(selectedNode)));
            nonSibling = children.find(n => n.contains(selectedNode));
        }
        
        return foundFamily;
    }

    /**
     * Retrieves an array of the text nodes in the current selection
     * @returns {Text[]}
     */
    #getTextNodesFromSelection() {
        const selection = window.getSelection();

        if (!selection.anchorNode)
            return [];

        if (selection.anchorNode === selection.focusNode)
            if (selection.anchorNode.nodeType === Node.TEXT_NODE)
                return [ selection.anchorNode ];
            else
                return [];

        if (!(['forward', 'backward'].includes(selection.direction)))
            return [];

        const isForward = selection.direction === 'forward';

        const startNode = isForward ? selection.anchorNode : selection.focusNode,
            startOffset = isForward ? selection.anchorOffset : selection.focusOffset,
            endNode = isForward ? selection.focusNode : selection.anchorNode,
            endOffset = isForward ? selection.focusOffset : selection.anchorOffset;

        const textNodes = [];

        let foundStart = false,
            foundEnd = false;

        const searchChildren = (start) => {
            for (const node of start.childNodes) {
                if (foundEnd)
                    return;

                if (node === startNode)
                    foundStart = true;

                if (foundStart && node.nodeType === Node.TEXT_NODE) {
                    textNodes.push(node);
                }

                searchChildren(node);

                if (node === endNode)
                    foundEnd = true;
            }
        }

        const range = document.createRange();
        range.setStart(startNode, startOffset);
        range.setEnd(endNode, endOffset);

        searchChildren(range.commonAncestorContainer);

        return textNodes;
    }

    /**
     * Inserts an element at the caret position and fills it with a selected whitespace
     * @param {Selection} selection 
     * @param {string} tagName
     * @returns {(HTMLElement)}
     */
    #insertElement(selection, tagName) {
        if (!selection.isCollapsed)
            return null;

        const textNode = selection.anchorNode;

        if (textNode.nodeType !== Node.TEXT_NODE)
            return null;
        
        const range = document.createRange();
        range.setStart(selection.anchorNode, selection.anchorOffset);
        range.collapse();

        const element = document.createElement(tagName);
        element.innerHTML = '&nbsp;';
        range.insertNode(element);
        range.selectNodeContents(element);

        selection.removeAllRanges();
        selection.addRange(range);

        return element;
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
     * Outputs the innerHTML of the textBox as textContent of the htmlOutput
     * @param {Number} index 
     */
    #outputHtml(index) {
        if (!(index >= 0))
            return;

        // let textContent = source.innerHTML.trim()
        //     .replace(new RegExp(/( +<)/, 'g'), '<');

        // for (const key in this.#blockElements.keys()) {
        //     textContent = textContent
        //         .replace(`<${key}>`, `<${key}>\r\n`)
        //         .replace(`</${key}>`, `\r\n</${key}>`);
        // }
        
        // container.textContent = textContent;

        const textBox = this.#textBoxes[index];
        const {anchorNode, anchorOffset, focusNode, focusOffset} = window.getSelection();
        let nodeText = '';

        if (textBox.contains(anchorNode) && textBox.contains(focusNode))
            nodeText = `Anchor: ${anchorNode.tagName ?? 'text'} @ ${anchorOffset}\r\n` +
                        `Focus: ${focusNode.tagName ?? 'text'} @ ${focusOffset}\r\n\r\n`;

        this.#htmlOutputs[index].textContent = nodeText + textBox.innerHTML;
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
    #replaceWithContents(node, selection, mergeWithSiblings) {
        this.logFuncs && console.log('replaceWithContents()');

        const currentNode = selection.anchorNode;
        let currentOffset = selection.anchorOffset;
        const hasSelection = !selection.isCollapsed;

        const children = Array.from(node.childNodes);
        const parent = node.parentNode;

        children.forEach(child => {
            parent.insertBefore(child, node);
        });

        node.remove();

        if (currentNode.nodeType !== Node.TEXT_NODE)
            return;

        if (mergeWithSiblings) {
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
        }

        selection.setPosition(currentNode, currentOffset);
    }
}
const textEditor = new TextEditor();