export { textEditor as default };

class TextEditor {
    logFuncs = true;

    #blockElements = new Map([
        ['div', 'Text'],
        ['h2', 'Heading'],
        ['h3', 'Heading 2'],
        ['h4', 'Heading 3'],
        ['h5', 'Heading 4'],
        ['p', 'Paragraph']
    ]);

    #allowedElements = ['br', ...this.#blockElements.keys()];
    #regexAllowedElements;

    #defaultKeys = [
        'Control',
        'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
        'Enter',
        'A', 'C', 'X', 'Z'
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

        this.#allowedElements.push(...this.#buttonSets[0].map(btn => btn.dataset.tag?.toLowerCase()));
        this.#regexAllowedElements = new RegExp('(<\/?(?!(' + this.#allowedElements.join('|') + ')\\b)([a-z]*>))', "g");

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
    async #textboxInput(index, event) {
        const keyUpper = event.key.toUpperCase();

        if (this.#defaultKeys.some(k => k === keyUpper))
            return;

        const hasModifiers = (modifiers) => modifiers === ((event.shiftKey * 0b1) + (event.ctrlKey * 0b10) + (event.altKey * 0b100));
        const mod = Object.freeze({ none: 0b0, shift: 0b1, ctrl: 0b10, alt: 0b100 });

        if (!hasModifiers(mod.ctrl))
            return;

        event.preventDefault();

        if (keyUpper === 'V') {
            const pasted = await navigator.clipboard.read();
            for (const item of pasted) {
                if (item.types.includes('text/html')) {
                    const blob = await item.getType('text/html');
                    let text = await blob.text();

                    text = text.replace(/<[a-zA-z]*( [^>]*)>/g, '')
                        .replace(/\s{2,}/g, '')
                        .replace(this.#regexAllowedElements, '')
                        .split(/<\/?div>|<\/?p>/g);

                    console.log(text);
                    this.#addParagraphBreak(window.getSelection().anchorNode, window.getSelection().anchorOffset, this.#textBoxes[index]);
                }
            }
        }

        const button = this.#buttonSets[index].find(b => b.dataset.shortcut?.toUpperCase() === keyUpper);

        if (button)
            this.#toggleTag(index, button.dataset.tag);
    }

    #addParagraphBreak(textNode, offset, textBox) {
        const blockNode = this.#getBlockElement(textNode, textBox);
        const newBlock = document.createElement(blockNode.tagName);
        blockNode.insertAdjacentElement('afterend', newBlock);

        const splitTree = (start, destination) => {
            let foundCenter = false;

            for (const node of Array.from(start.childNodes)) {
                if (node.contains(textNode)) {
                    foundCenter = true;

                    switch (node.nodeType) {
                        case Node.ELEMENT_NODE:
                            const twin = document.createElement(node.tagName);
                            destination.appendChild(twin);
                            splitTree(node, twin);
                            break;

                        case Node.TEXT_NODE:
                            const newHalf = document.createTextNode(node.textContent.substring(offset));
                            node.textContent = node.textContent.substring(0, offset);
                            destination.appendChild(newHalf);
                            break;
                    }

                    continue;
                }

                if (foundCenter)
                    destination.appendChild(node);
            }
        }

        splitTree(blockNode, newBlock);

        return newBlock;
    }

    /**
     * Add or remove one or more tags of the specified type
     * @param {Number} index 
     * @param {string} tagName 
     */
    #toggleTag(index, tagName) {
        this.logFuncs && console.clear();

        const selection = window.getSelection();
        const textBox = this.#textBoxes[index];
        tagName = tagName.toUpperCase();

        if (!textBox.contains(selection.anchorNode) || !textBox.contains(selection.focusNode))
            return;

        const selectedTextNodes = this.#getTextNodesFromSelection();

        if (selectedTextNodes.length < 1)
            return; // Create element at caret and append new text node?

        const selectionData = { isCollapsed: selection.isCollapsed };

        const isForward = selection.direction !== 'backward';

        if (selection.isCollapsed || isForward) {
            selectionData.startNode = selection.anchorNode;
            selectionData.startOffset = selection.anchorOffset;
        }
        
        if (isForward) {
            selectionData.endNode = selection.focusNode;
            selectionData.endOffset = selection.focusOffset;
        }
        else {
            selectionData.startNode = selection.focusNode;
            selectionData.startOffset = selection.focusOffset;
            selectionData.endNode = selection.anchorNode;
            selectionData.endOffset = selection.anchorOffset;
        }
        

        if (this.#isBlockType(tagName)) {
            const blockMatches = new Set(selectedTextNodes.map(text => this.#getBlockElement(text, textBox, tagName)));

            for (const match of blockMatches) {
                this.#replaceElement(match, tagName);
            }
        }
        else {
            const ancestorMatches = selectedTextNodes.map(n => this.#getMatchingAncestor(n, tagName, textBox));
            const noMatches = ancestorMatches.every(match => !match);

            switch (noMatches) {
                case true:
                    this.#applyInlineTag(selectedTextNodes, tagName, selectionData, textBox);
                    break;
            
                case false:
                    const actualMatches = ancestorMatches.filter(match => match !== false);

                    if (actualMatches.length === selectedTextNodes.length) {
                        this.#removeInlineTag(selectedTextNodes, actualMatches, selectionData);
                        break;
                    }

                    this.#applyInlineTag(selectedTextNodes, tagName, selectionData, textBox);
                    break;
            }

        }

        this.#makeSelection(selectionData);
        this.#outputHtml(index);
    }

    /**
     * 
     * @param {Text[]} textNodes
     * @param {string} tagName
     * @param {Object} selectionData 
     */
    #applyInlineTag(textNodes, tagName, selectionData, textBox) {
        this.logFuncs && console.log('applyInlineTag()');

        let collapsedOffset = false;

        if (selectionData.isCollapsed) {
            if (
                selectionData.startOffset === 0
                || !selectionData.startNode.textContent[selectionData.startOffset-1].trim()
                || selectionData.startOffset === selectionData.startNode.textContent.length
                || !selectionData.startNode.textContent[selectionData.startOffset].trim()
            ) {
                this.#insertElement(selectionData, tagName);
                return;
            }
            const start = textNodes[0].textContent.lastIndexOf(' ', selectionData.startOffset) + 1;
            const end = textNodes[0].textContent.indexOf(' ', selectionData.startOffset);

            collapsedOffset = selectionData.startOffset - start;

            selectionData.startOffset = start;
            selectionData.endOffset = (end === -1) ? textNodes[0].textContent.length : end;
        }

        if (textNodes[0] === selectionData.startNode && selectionData.startOffset > 0) {
            const node = textNodes[0];
            const newNode = document.createTextNode(node.textContent.substring(0, selectionData.startOffset));
            node.parentNode.insertBefore(newNode, node);
            node.textContent = node.textContent.substring(selectionData.startOffset);

            if (textNodes.length === 1)
                selectionData.endOffset -= selectionData.startOffset;

            selectionData.startOffset = 0;
        }

        if (textNodes[textNodes.length-1] === selectionData.endNode && selectionData.endOffset < textNodes[textNodes.length-1].textContent.length) {
            const node = textNodes[textNodes.length-1];
            const newNode = document.createTextNode(node.textContent.substring(selectionData.endOffset));
            node.parentNode.insertBefore(newNode, node);
            node.parentNode.insertBefore(node, newNode);
            node.textContent = node.textContent.substring(0, selectionData.endOffset);

            selectionData.endOffset = node.textContent.length;
        }

        let latestBlock = null;
        let blockMembers = [ ];
        
        for (const node of textNodes) {
            let newBlock = this.#getBlockElement(node, textBox);
            latestBlock ??= newBlock;

            if (newBlock === latestBlock) {
                blockMembers.push(node);
                continue;
            }

            latestBlock = newBlock;
            this.#encloseNodes(blockMembers, tagName);
            blockMembers = [node];
        }

        this.#encloseNodes(blockMembers, tagName);

        if (typeof collapsedOffset === 'number') {
            selectionData.startOffset = selectionData.endOffset = collapsedOffset;
        }
    }

    /**
     * 
     * @param {Text[]} nodes 
     * @param {string} tagName
     */
    #encloseNodes(nodes, tagName) {
        this.logFuncs && console.log('encloseNodes()');

        const newElement = document.createElement(tagName);

        if (nodes.length === 1) {
            if (nodes[0].tagName === tagName)
                return;

            nodes[0].parentNode.insertBefore(newElement, nodes[0]);
            newElement.appendChild(nodes[0]);
            return;
        }

        const range = document.createRange();
        range.setStart(nodes[0], 0);
        const endNode = nodes[nodes.length-1]; 
        range.setEnd(endNode, endNode.length);

        const ancestor = range.commonAncestorContainer;
        let inRange = false;
        const relevantChildren = Array.from(ancestor.childNodes).filter(c => {
            if (!inRange && c.contains(nodes[0]))
                inRange = true;

            if (inRange && c.contains(endNode)) {
                inRange = false;
                return true;
            }

            return inRange;
        });

        ancestor.insertBefore(newElement, relevantChildren[0]);
        relevantChildren.forEach(c => newElement.appendChild(c));

        for (const child of relevantChildren) {
            if (child?.tagName === tagName) {
                Array.from(child.childNodes).forEach(grandchild => {
                    child.parentNode.insertBefore(grandchild, child);
                });
                child.remove();
            }
        }
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

    /**
     * Searches through parent elements for an ancestor, until an end node is reached
     * @param {Node} node 
     * @param {string} tagName 
     * @param {Node} endNode 
     * @returns {(HTMLElement|false)}
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
     * Retrieves an array of the text nodes in the current selection
     * @returns {Text[]}
     */
    #getTextNodesFromSelection() {
        this.logFuncs && console.log('getTextNodesFromSelection');
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
     * Inserts an element containing a text node
     * @param {Object} selectionData 
     * @param {string} tagName
     */
    #insertElement(selectionData, tagName) {
        this.logFuncs && console.log('insertElement()');

        const element = document.createElement(tagName);
        element.appendChild(document.createTextNode(''));
        
        const range = document.createRange();
        range.setStart(selectionData.startNode, selectionData.startOffset);
        range.collapse();
        range.insertNode(element);

        selectionData.isCollapsed = false;
        selectionData.startNode = selectionData.endNode = element;
        selectionData.startOffset = 0;
        selectionData.endOffset = 1;
    }

    /**
     * Checks if the specified tag type is in the list of block tags
     * @param {string} tagName 
     * @returns {boolean}
     */
    #isBlockType(tagName) {
        return this.#blockElements.has(tagName?.toLowerCase());
    }

    #makeSelection({startNode, startOffset, endNode = null, endOffset = null}) {
        if (!endNode || !endOffset) {
            window.getSelection().setPosition(startNode, startOffset);
            return;
        }

        window.getSelection().setBaseAndExtent(startNode, startOffset, endNode, endOffset);
    }

    /**
     * 
     * @param {Text[]} selectedText 
     * @param {HTMLElement[]} elements 
     */
    #removeInlineTag(textNodes, elements, selectionData) {
        this.logFuncs && console.log('removeInlineTag()');

        if (textNodes.length !== elements.length) {
            console.error('removeInlineTag called without matching in-data');
            return;
        }

        const uniqueElements = new Set(elements);
        const tagName = elements[0].tagName;

        if (!selectionData.isCollapsed) {
            if (textNodes[0] === selectionData.startNode && selectionData.startOffset > 0) {
                const node = textNodes[0];
                const newText = document.createTextNode(node.textContent.substring(0, selectionData.startOffset));
                const newElement = document.createElement(tagName);
                newElement.appendChild(newText);
                node.parentNode.insertBefore(newElement, node);
                node.textContent = node.textContent.substring(selectionData.startOffset);

                if (textNodes.length === 1)
                    selectionData.endOffset -= selectionData.startOffset;

                selectionData.startOffset = 0;
            }

            if (textNodes[textNodes.length-1] === selectionData.endNode && selectionData.endOffset < textNodes[textNodes.length-1].textContent.length) {
                const node = textNodes[textNodes.length-1];
                const newText = document.createTextNode(node.textContent.substring(selectionData.endOffset));
                const newElement = document.createElement(tagName);
                newElement.appendChild(newText);
                node.parentNode.insertBefore(newElement, node);
                node.parentNode.insertBefore(node, newElement);
                node.textContent = node.textContent.substring(0, selectionData.endOffset);

                selectionData.endOffset = node.textContent.length;
            }
        }

        for (const element of uniqueElements) {
            const parent = element.parentNode;
            const children = Array.from(element.childNodes);
            children.forEach(child => parent.insertBefore(child, element));
            element.remove();

            const firstChild = children[0];
            const lastChild = children[children.length-1];
            if (firstChild.nodeType === Node.TEXT_NODE && firstChild.previousSibling?.nodeType === Node.TEXT_NODE) {
                if (element === elements[0]) {
                    selectionData.startOffset += firstChild.previousSibling.textContent.length;

                    if (selectionData.startNode === selectionData.endNode)
                        selectionData.endOffset += firstChild.previousSibling.textContent.length;
                }
                firstChild.textContent = firstChild.previousSibling.textContent + firstChild.textContent;
                firstChild.previousSibling.remove();
            }
            else if (lastChild.nodeType === Node.TEXT_NODE && lastChild.nextSibling?.nodeType === Node.TEXT_NODE) {
                lastChild.textContent += lastChild.nextSibling.textContent;
                lastChild.nextSibling.remove();
            }
        }
    }

    /**
     * Replaces an element with one with a new tag that takes the old element's children
     * @param {HTMLElement} element 
     * @param {string} newTag 
     * @returns {HTMLElement}
     */
    #replaceElement(element, newTag) {
        this.logFuncs && console.log('replaceElement()');

        if (element.tagName === newTag)
            return element;

        const newElement = document.createElement(newTag);

        for (const child of Array.from(element.childNodes)) {
            newElement.appendChild(child);
        }

        element.parentNode.insertBefore(newElement, element);
        element.remove();

        return newElement;
    }























    /**
     * Outputs the innerHTML of the textBox as textContent of the htmlOutput
     * @param {Number} index 
     */
    #outputHtml(index) {
        if (!(index >= 0))
            return;

        const textBox = this.#textBoxes[index];
        const {anchorNode, anchorOffset, focusNode, focusOffset} = window.getSelection();
        let nodeText = '';

        if (textBox.contains(anchorNode) && textBox.contains(focusNode))
            nodeText = `Anchor: ${anchorNode.tagName ?? 'text'} @ ${anchorOffset}\r\n` +
                        `Focus: ${focusNode.tagName ?? 'text'} @ ${focusOffset}\r\n\r\n`;

        let htmlOutput = textBox.innerHTML;

        for (const [tag] of this.#blockElements) {
            htmlOutput = htmlOutput.replaceAll(`><${tag}>`, `>\r\n<${tag}>`);
        }

        this.#htmlOutputs[index].textContent = nodeText + htmlOutput;
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
}
const textEditor = new TextEditor();