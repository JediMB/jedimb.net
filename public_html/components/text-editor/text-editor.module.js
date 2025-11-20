import SelectionData from "/js/models/selection-data.model.js";
import undoManagementService from "/js/services/undo-management.service.js";

export { textEditor as default };

class TextEditor {
    logFuncs = false;

    #blockElementData = [
        ['div', 'Text'],
        ['h2', 'Heading'],
        ['h3', 'Heading 2'],
        ['h4', 'Heading 3'],
        ['h5', 'Heading 4'],
        ['p', 'Paragraph']
    ];

    #blockElementTags = this.#blockElementData.map(pair => pair[0]);

    #regexMatchAttributes = /<[a-zA-z\-]*( [^>]*)>/g;
    #regexMatchBlocks = new RegExp(
        '<(?<tag>' +
        this.#blockElementTags.join('|') +
        ')\\b[ \\w=\\"\\-#;]*>(.*?)(<\\/\\k<tag>>)'
    ); // /<(?<tag>div|h2|p)\b[ \w=\"\-#;]*>(.*?)<\/\k<tag>>/
    #allowedElements = ['br', ...this.#blockElementTags];
    #regexMatchDisallowedElements;

    #defaultKeysUpper = [
        'Control', 'Shift', 'Alt', 'Process', 'CapsLock',
        'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
        'Home', 'End',
        'Enter',
        'A', 'C', 'X'
    ].map(v => v.toUpperCase());

    #tagButtonSets;
    #linkButtons;
    #textBoxes;
    #htmlOutputs;

    #undo = undoManagementService;

    constructor() {
        const components = Array.from(document.querySelectorAll('text-editor-component'));
        const fieldsets = components.map(c => c.querySelector('fieldset'));
        const blockSelects = fieldsets.map(fs => fs.querySelector('select[select-blocktype]'));
        this.#tagButtonSets = fieldsets.map(fs => Array.from(fs.querySelectorAll('button[data-tag]')));
        this.#linkButtons = fieldsets.map(fs => fs.querySelector('[btn-link]'));
        this.#textBoxes = components.map(c => c.querySelector('text-box'));
        this.#htmlOutputs = components.map(c => c.querySelector('html-output'));

        this.#allowedElements.push(...this.#tagButtonSets[0].map(btn => btn.dataset.tag?.toLowerCase()));
        this.#regexMatchDisallowedElements = new RegExp('(<\/?(?!(' + this.#allowedElements.join('|') + ')\\b)([a-z]*>))', "gi");

        document.addEventListener('selectionchange', () => {
            const selection = window.getSelection();
            const boxIndex = this.#textBoxes.findIndex(t => t.contains(selection.anchorNode) && t.contains(selection.focusNode));

            fieldsets.forEach((fs, index) => fs.disabled = boxIndex !== index);

            if (boxIndex < 0)
                return;

            const textBox = this.#textBoxes[boxIndex];

            const selectedTextNodes = this.#getTextNodesFromSelection();

            if (selectedTextNodes.length === 0)
                [blockSelects[boxIndex].value] = this.#blockElementTags;
            else {
                const selectedBlocks = selectedTextNodes.map(n => this.#getBlockElement(n, textBox));

                const identicalBlocks = selectedBlocks.length > 0
                    && selectedBlocks.every((val, _, arr) => val.tagName === arr[0].tagName);

                blockSelects[boxIndex].value = identicalBlocks
                    ? selectedBlocks[0].tagName.toLowerCase()
                    : null;

                this.#linkButtons[boxIndex].disabled = (new Set(selectedBlocks)).size !== 1;
            }

            this.#tagButtonSets[boxIndex].forEach(b => b.classList.toggle('active',
                selectedTextNodes.every(n => !!this.#getMatchingAncestor(n, b.dataset.tag, textBox))
            ));
        });

        components.forEach((component, index) => {
            const blockSelect = blockSelects[index];
            const buttons = this.#tagButtonSets[index];
            const linkButton = this.#linkButtons[index];
            const textBox = this.#textBoxes[index];
            const keyInfo = component.querySelector('key-info');

            this.#blockElementData.forEach(([tag, name]) => {
                const option = document.createElement('option');
                option.value = tag;
                option.textContent = name;
                blockSelect.appendChild(option);
            });
            blockSelect.addEventListener('change', () => this.#toggleTag(index, { name: blockSelect.value }));

            buttons.forEach(button => {
                button.addEventListener('click', () => this.#toggleTag(index, { name: button.dataset.tag }));
            });

            window.getSelection().setPosition(
                this.#getBlockElement(textBox.firstChild, textBox, blockSelect.value), 0
            );

            textBox.addEventListener('input', () => {
                this.#undo.add(textBox, true);

                if (!textBox.textContent.trim())
                    this.#getBlockElement(textBox.firstChild, textBox, blockSelect.value);

                this.#outputHtml(index);
            });

            textBox.addEventListener('keydown', event => {
                this.#textboxKeydown(index, event);
                keyInfo.textContent = `:: Key: ${event.key} ::\r\n\r\n  Shift:   ${event.shiftKey}\r\n  Control: ${event.ctrlKey}\r\n  Alt:     ${event.altKey}`;
            });

            linkButton.addEventListener('click', () => this.#addLink(index, linkButton));

            component.querySelector('[btn-cleanup').addEventListener('click', () => {
                this.#removeEmptyNodes(textBox);
                this.#outputHtml(index);
            });

            this.#outputHtml(index);
        });
    }

    #addLink(index, button) {
        // TODO: alternate logic for if a link already exists

        const selection = window.getSelection();
        let linkText;

        if (selection.isCollapsed) {
            linkText = prompt(button.dataset.textQuery, this.#getWord(selection));

            if (!linkText)
                return;
        }
        
        let linkUrl;

        do {
            linkUrl = prompt(button.dataset.urlQuery, 'https://');
            
            if (!linkUrl)
                return;

            const emailMatch = linkUrl.match(/(?!.*\.{2,})^((mailto:)?[\w\-\.\%\/\+]{1,64}\@[\w\.]{1,64}\.[a-zA-Z0-9\-]{1,32})$/);
            if (emailMatch) {
                if (!emailMatch[2])
                    linkUrl = `mailto:${linkUrl}`;
                break;
            }

            if (!linkUrl.match(/^[a-z]{3,}:/))
                linkUrl = `https://${linkUrl}`;

            // Check if valid address
        }
        while(!linkUrl)

        this.#toggleTag(index, {
            name: 'a',
            content: linkText,
            attributes: {
                href: linkUrl,
                ...(linkUrl.includes('://') && { target: '_blank' })
            }
        });
    }

    /**
     * 
     * @param {Selection} selection 
     */
    #getWord({anchorNode, anchorOffset}) {
        if (
            anchorOffset === 0
            || !anchorNode.textContent[anchorOffset-1].trim()
            || anchorOffset === anchorNode.textContent.length
            || !anchorNode.textContent[anchorOffset].trim()
        )
        return '';

        const text = anchorNode.textContent;

        return text.substring(
            text.lastIndexOf(' ', anchorOffset) + 1,
            text.indexOf(' ', anchorOffset)
        );

    }

    /**
     * Handle keydown events for the text editor
     * @param {Number} index
     * @param {Event} event 
     */
    #textboxKeydown(index, event) {
        this.#undo.saveData(this.#textBoxes[index], new SelectionData(window.getSelection()));

        const keyUpper = event.key.toUpperCase();

        if (this.#defaultKeysUpper.some(k => k === keyUpper))
            return;

        const hasModifiers = (modifiers) => modifiers === ((event.shiftKey * 0b1) + (event.ctrlKey * 0b10) + (event.altKey * 0b100));
        const mod = Object.freeze({ none: 0b0, shift: 0b1, ctrl: 0b10, alt: 0b100 });

        if (!hasModifiers(mod.ctrl))
            return;

        event.preventDefault();

        switch (keyUpper) {
            case 'V':
                this.#paste(this.#textBoxes[index]);
                return;

            case 'Z':
                this.#undo.undo(this.#textBoxes[index]);
                return;

            case 'Y':
                this.#undo.redo(this.#textBoxes[index]);
                return;
        }

        const button = this.#tagButtonSets[index].find(b => b.dataset.shortcut?.toUpperCase() === keyUpper);

        if (button)
            this.#toggleTag(index, { name: button.dataset.tag });
    }

    async #paste(textBox, contentType = 'text/html') {
        this.#undo.add(textBox);

        const selection = window.getSelection();

        const setPosition = (parent, originalLength, cumulativeLength = 0) => {
            const children = Array.from(parent.childNodes).reverse();

            for (const child of children) {
                cumulativeLength += child.textContent.length;

                if (originalLength > cumulativeLength)
                    continue;

                if (child.nodeType === Node.TEXT_NODE) {
                    selection.setPosition(child, cumulativeLength - originalLength);
                    break;
                }

                setPosition(child, originalLength, cumulativeLength - child.textContent.length);
                break;
            }
        }

        const pasted = await navigator.clipboard.read();
        for (const item of pasted) {
            if (item.types.includes(contentType)) {

                selection.deleteFromDocument();

                const isForward = selection.direction !== 'backward';

                let node = isForward ? selection.anchorNode : selection.focusNode,
                    offset = isForward ? selection.anchorOffset : selection.focusOffset;

                let text = await (await item.getType('text/html')).text();

                text = text.replace(this.#regexMatchAttributes, '')
                    .replace(/\s{2,}/g, '')
                    .replace(this.#regexMatchDisallowedElements, '');

                const textRows = [];

                while (text) {
                    const match = text.match(this.#regexMatchBlocks);

                    if (!match) {
                        textRows.push({tagName: null, content: text});
                        break;
                    }

                    if (match.index > 0)
                        textRows.push({tagName: null, content: text.substring(0, match.index)});

                    textRows.push({tagName: match[1].toUpperCase(), content: match[2]});
                    text = text.substring(match.index + match[0].length);
                }

                const currentBlockTag = this.#getBlockElement(node, textBox).tagName;

                if (!textRows[0].tagName || textRows[0].tagName === currentBlockTag) {
                    const parentElement = node.parentElement;
                    const parentLength = parentElement.textContent.length;
                    parentElement.innerHTML = parentElement.innerHTML.substring(0, offset) + textRows.shift().content + parentElement.innerHTML.substring(offset);
                    setPosition(parentElement, parentLength - offset);
                }

                if (textRows.length === 0)
                    return;

                const newBlock = this.#addParagraphBreak(selection.anchorNode, selection.anchorOffset, textBox);
                const blockLength = newBlock.textContent.length;

                const lastTag = textRows[textRows.length - 1].tagName;
                if (!lastTag || lastTag === currentBlockTag) {
                    const lastRow = textRows.pop().content;
                    newBlock.innerHTML = lastRow + newBlock.innerHTML;
                }

                for (const row of textRows) {
                    const betweenBlock = document.createElement(row.tagName ?? this.#blockElementTags[0]);
                    betweenBlock.innerHTML = row.content;
                    newBlock.parentNode.insertBefore(betweenBlock, newBlock);
                }

                setPosition(newBlock, blockLength);

                return;
            }
        }
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
     * 
     * @param {Number} index 
     * @param {Object} tagInfo
     * @param {string} tagInfo.name
     * @param {string} tagInfo.content 
     * @param {Object} tagInfo.attributes 
     */
    #toggleTag(index, tagInfo) {
        this.logFuncs && console.clear();

        const selection = window.getSelection();
        const textBox = this.#textBoxes[index];
        tagInfo.name = tagInfo.name.toUpperCase();

        if (!textBox.contains(selection.anchorNode) || !textBox.contains(selection.focusNode))
            return;

        const selectedTextNodes = this.#getTextNodesFromSelection();

        if (selectedTextNodes.length < 1)
            return;

        const selectionData = new SelectionData(selection);

        this.#undo.add(textBox);

        if (this.#isBlockType(tagInfo.name)) {
            const blockMatches = new Set(selectedTextNodes.map(text => this.#getBlockElement(text, textBox, tagName)));

            for (const match of blockMatches) {
                this.#replaceElement(match, tagInfo.name);
            }
        }
        else {
            const ancestorMatches = selectedTextNodes.map(n => this.#getMatchingAncestor(n, tagInfo.name, textBox));
            const noMatches = ancestorMatches.every(match => !match);

            switch (noMatches) {
                case true:
                    this.#applyInlineTag(selectedTextNodes, tagInfo, selectionData, textBox);
                    break;
            
                case false:
                    const actualMatches = ancestorMatches.filter(match => match !== false);

                    if (actualMatches.length === selectedTextNodes.length) {
                        this.#removeInlineTag(selectedTextNodes, actualMatches, selectionData);
                        break;
                    }

                    this.#applyInlineTag(selectedTextNodes, tagInfo, selectionData, textBox);
                    break;
            }

        }

        this.#makeSelection(selectionData);
        this.#outputHtml(index);
    }

    /**
     * 
     * @param {Text[]} textNodes
     * @param {Object} tagInfo
     * @param {SelectionData} selectionData 
     */
    #applyInlineTag(textNodes, tagInfo, selectionData, textBox) {
        this.logFuncs && console.log('applyInlineTag()');

        let collapsedOffset = false;

        if (selectionData.isCollapsed) {
            if (
                selectionData.startOffset === 0
                || !selectionData.startNode.textContent[selectionData.startOffset-1].trim()
                || selectionData.startOffset === selectionData.startNode.textContent.length
                || !selectionData.startNode.textContent[selectionData.startOffset].trim()
            ) {
                this.#insertElement(selectionData, tagInfo);
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
            this.#encloseNodes(blockMembers, tagInfo);
            blockMembers = [node];
        }

        this.#encloseNodes(blockMembers, tagInfo);

        if (typeof collapsedOffset === 'number') {
            selectionData.startOffset = selectionData.endOffset = collapsedOffset;
        }
    }

    /**
     * 
     * @param {Text[]} nodes 
     * @param {Object} tagInfo
     * @param {String} tagInfo.name
     * @param {String} tagInfo.content
     * @param {Object} tagInfo.attributes
     */
    #encloseNodes(nodes, tagInfo) {
        this.logFuncs && console.log('encloseNodes()');

        const newElement = document.createElement(tagInfo.name);
        
        for (const attribute in tagInfo.attributes) {
            newElement.setAttribute(attribute, tagInfo.attributes[attribute]);
        }

        if (nodes.length === 1) {
            if (nodes[0].tagName === tagInfo.name)
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
        newElement.replaceChildren(...relevantChildren);

        for (const child of relevantChildren) {
            if (child?.tagName === tagInfo.name) {
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
            [tagName] = this.#blockElementTags;

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
     * @param {SelectionData} selectionData 
     * @param {Object} tagInfo
     * @param {String} tagInfo.name
     * @param {String} tagInfo.content
     * @param {Object} tagInfo.attributes
     */
    #insertElement(selectionData, tagInfo) {
        this.logFuncs && console.log('insertElement()');

        const element = document.createElement(tagInfo.name);

        for (const attribute in tagInfo.attributes) {
            element.setAttribute(attribute, tagInfo.attributes[attribute]);
        }

        element.appendChild(document.createTextNode(tagInfo.content ?? ''));
        
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
        return !!this.#blockElementTags.find(tag => tag == tagName?.toLowerCase());
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
        newElement.replaceChildren(...element.childNodes);
        element.parentNode.replaceChild(newElement, element);

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

        for (const tag of this.#blockElementTags) {
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