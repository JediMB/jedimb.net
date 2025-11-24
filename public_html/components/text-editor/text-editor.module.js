import SelectionData from "/js/models/selection-data.model.js";
import undoManagementService from "/js/services/undo-management.service.js";

customElements.define('text-editor-component', class TextEditorComponent extends HTMLElement {
    /** @type {TextEditorComponent} */
    #self;
    #undo = undoManagementService;

    #blockElementData = [
        ['div', 'Text'],
        ['p', 'Paragraph'],
        ['h3', 'Subheading 1'],
        ['h4', 'Subheading 2'],
        ['h5', 'Subheading 3']
    ];
    #blockElementTags = this.#blockElementData.map(pair => pair[0]);
    #defaultKeysUpper = [
        'Control', 'Shift', 'Alt', 'Process', 'CapsLock',
        'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
        'Home', 'End',
        'Enter',
        'A', 'C', 'X'
    ].map(v => v.toUpperCase());

    #regexMatchAttributes = /<(?!a )[a-zA-z][a-zA-z0-9\-]*( [^>]*)>/g;
    #regexMatchBlocks = new RegExp(
        '<(?<tag>' +
        this.#blockElementTags.join('|') +
        ')\\b[ \\w=\\"\\-#;]*>(.*?)(<\\/\\k<tag>>)'
    ); // /<(?<tag>div|h2|p)\b[ \w=\"\-#;]*>(.*?)<\/\k<tag>>/

    constructor() {
        const component = super();
        this.#self = component;
    }

    #allowedElements = ['br', ...this.#blockElementTags];
    #regexMatchDisallowedElements;

    #fieldset;
    #blockSelector;
    #tagButtons;
    #linkButton;
    #textBox;
    /** @type {MutationObserver} */
    #mutationObserver;
    #htmlOutput;

    connectedCallback() {
        const self = this.#self;
        self.style.display = 'none';

        this.#fieldset = self.querySelector('fieldset');
        this.#blockSelector = this.#fieldset.querySelector('[select-blocktype]');
        this.#tagButtons = Array.from(this.#fieldset.querySelectorAll('[data-tag]'));
        this.#linkButton = this.#fieldset.querySelector('[btn-link]');
        this.#textBox = self.querySelector('text-box');
        this.#htmlOutput = self.querySelector('html-output');

        const htmlCheck = self.querySelector('[checkbox-html]');
        const wrapper = self.querySelector('text-box-wrapper');
        const textarea = self.querySelector('[html-editor]');

        const keyInfo = self.querySelector('key-info');
        const cleanUp = this.#fieldset.querySelector('[btn-cleanup');

        this.#allowedElements.push(...this.#tagButtons.map(btn => btn.dataset.tag?.toLowerCase()));
        this.#regexMatchDisallowedElements = new RegExp('(<\/?(?!(' + this.#allowedElements.join('|') + ')\\b)([a-z]*>))', "gi");

        document.addEventListener('selectionchange', () => this.#onSelectionChange());

        for (const [tag, name] of this.#blockElementData) {
            const option = document.createElement('option');
            option.value  = tag;
            option.textContent = name;
            this.#blockSelector.appendChild(option);
        }
        this.#blockSelector.addEventListener('change', (event) => {
            event.stopPropagation();
            this.#toggleTag({ name: this.#blockSelector.value });
        });

        this.#tagButtons.forEach(button => button.dataset.shortcut && button.addEventListener('click', () => this.#toggleTag({ name: button.dataset.tag })));

        this.#linkButton.addEventListener('click', () => this.#addLink(this.#linkButton));

        this.#textBox.addEventListener('input', () => {
            this.#undo.add(this.#textBox, true);

            if (!this.#textBox.textContent.trim())
                this.#getBlockElement(this.#textBox.firstChild, this.#blockSelector.value);

            this.#outputHtml();
        });

        this.#textBox.addEventListener('keydown', event => {
            this.#textboxKeydown(event, this.#tagButtons);
            /* DEBUG FUNCTIONALITY */ keyInfo.textContent = `:: Key: ${event.key} ::\r\n\r\n  Shift:   ${event.shiftKey}\r\n  Control: ${event.ctrlKey}\r\n  Alt:     ${event.altKey}`;
        });

        this.#mutationObserver = new MutationObserver(() => {
            const event = new CustomEvent('change', {
                bubbles: true,
                cancelable: true,
                detail: this.getContent()
            });
            this.dispatchEvent(event);
        });
        this.#mutationObserver.observe(this.#textBox, {characterData: true, childList: true, subtree: true});

        textarea.addEventListener('change', (event) => {
            event.stopPropagation();

            this.#undo.clear(this.#textBox);
            const lines = textarea.value.split(/\r?\n|\r|\n/g);
            this.#textBox.innerHTML = lines.map(line => line.trim()).join('');
        });

        cleanUp.addEventListener('click', () => {
            this.#removeEmptyNodes();
            this.#outputHtml();
        });

        htmlCheck.addEventListener('change', (event) => {
            event.stopPropagation();

            const editHtml = htmlCheck.checked;

            if (editHtml)
                textarea.value = this.getContent(true);

            wrapper.classList.toggle('hidden', editHtml);
            textarea.classList.toggle('hidden', !editHtml);
        });

        self.style.removeProperty('display');

        window.getSelection().setPosition(
            this.#getBlockElement(this.#textBox.firstChild, this.#blockSelector.value), 0
        );

        this.#outputHtml();
    }

    disconnectedCallback() {
        document.removeEventListener('selectionchange', () => this.#onSelectionChange());
    }

    /**
     * @param {Boolean} doFormat 
     * @returns {String}
     */
    getContent(doFormat = false) {
        let htmlOutput = this.#textBox.innerHTML;

        if (!doFormat)
            return htmlOutput;

        for (const tag of this.#blockElementTags)
            htmlOutput = htmlOutput.replaceAll(`><${tag}>`, `>\r\n<${tag}>`);

        return htmlOutput.replaceAll('><!--', '>\r\n<!--');
    }

    /**
     * Add a hyperlink to the selected text
     * 
     * @param {HTMLButtonElement} button 
     */
    #addLink(button) {
        const selection = window.getSelection();
        const tagName = button.dataset.tag.toUpperCase();

        const anchorMatch = this.#getMatchingAncestor(selection.anchorNode, tagName);
        const focusMatch = this.#getMatchingAncestor(selection.focusNode, tagName);

        if (anchorMatch || focusMatch) {
            if (anchorMatch === focusMatch) {
                const selectionData = new SelectionData(selection);
                anchorMatch.replaceWith(...anchorMatch.childNodes);
                selection.setBaseAndExtent(
                    selectionData.startNode,
                    selectionData.startOffset,
                    selectionData.endNode,
                    selectionData.endOffset
                );
            }

            return;
        }

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

            const emailMatch = linkUrl.match(/(?!.*\.{2,})^(mailto:)?[\w\-\.\%\/\+]{1,64}\@[\w\.]{1,64}\.[a-zA-Z0-9\-]{1,32}$/);
            if (emailMatch) {
                if (!emailMatch[1])
                    linkUrl = `mailto:${linkUrl}`;
                break;
            }

            if (!linkUrl.match(/^[a-z]{3,}:/))
                linkUrl = `https://${linkUrl}`;

            // Check if valid address
        }
        while(!linkUrl)

        this.#toggleTag({
            name: tagName,
            content: linkText,
            attributes: {
                href: linkUrl,
                ...(linkUrl.includes('://') && { target: '_blank' })
            }
        });
    }

    #addParagraphBreak(textNode, offset) {
        const blockNode = this.#getBlockElement(textNode);
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
     * 
     * @param {Text[]} textNodes
     * @param {Object} tagInfo
     * @param {SelectionData} selectionData 
     */
    #applyInlineTag(textNodes, tagInfo, selectionData) {
        this.logFuncs && console.log('applyInlineTag()');

        let collapsedOffset = false;

        if (selectionData.isCollapsed) {
            if (
                selectionData.startOffset === 0
                || !selectionData.startNode.textContent[selectionData.startOffset-1].trim()
                || selectionData.startOffset === selectionData.startNode.textContent.length
                || !selectionData.startNode.textContent[selectionData.startOffset].trim()
            ) {
                this.#insertElement(tagInfo, selectionData);
                return;
            }
            const start = textNodes[0].textContent.lastIndexOf(' ', selectionData.startOffset) + 1;
            const end = textNodes[0].textContent.indexOf(' ', selectionData.startOffset);

            collapsedOffset = selectionData.startOffset - start;

            selectionData.startOffset = start;
            selectionData.endOffset = (end < 0) ? textNodes[0].textContent.length : end;
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
            let newBlock = this.#getBlockElement(node);
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
     * @param {Text[]} textNodes 
     * @param {Object} tagInfo
     * @param {String} tagInfo.name
     * @param {String} tagInfo.content
     * @param {Object} tagInfo.attributes
     */
    #encloseNodes(textNodes, tagInfo) {
        this.logFuncs && console.log('encloseNodes()');

        const newElement = document.createElement(tagInfo.name);
        
        for (const attribute in tagInfo.attributes) {
            newElement.setAttribute(attribute, tagInfo.attributes[attribute]);
        }

        if (textNodes.length === 1) {
            if (textNodes[0].tagName === tagInfo.name)
                return;

            textNodes[0].parentNode.insertBefore(newElement, textNodes[0]);
            newElement.appendChild(textNodes[0]);
            return;
        }

        const range = document.createRange();
        range.setStart(textNodes[0], 0);
        const endNode = textNodes[textNodes.length-1]; 
        range.setEnd(endNode, endNode.length);

        const ancestor = range.commonAncestorContainer;
        let inRange = false;
        const relevantChildren = Array.from(ancestor.childNodes).filter(c => {
            if (!inRange && c.contains(textNodes[0]))
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
     * Extracts the selected text from the provided list of elements
     * 
     * @param {Text[]} textNodes 
     * @param {HTMLElement[]} elements 
     * @param {SelectionData} selectionData
     */
    #extractSelectionFromTags(textNodes, elements, selectionData) {
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
            element.replaceWith(...element.childNodes);

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
     * Searches through parent elements for a block element, until an end node is reached.
     * Creates a new block element in the endNode if none can be found.
     * @param {Node} childNode 
     * @param {String} tagName
     * @returns {HTMLElement}
     */
    #getBlockElement(childNode, tagName = null) {
        this.logFuncs && console.log('getBlockElement()');
        const textBox = this.#textBox;

        if (!tagName)
            [tagName] = this.#blockElementTags;

        if (!childNode) {
            const newElement = document.createElement(tagName);
            textBox.appendChild(newElement);
            return newElement;
        }

        if (childNode.nodeType === Node.TEXT_NODE)
            childNode = childNode.parentElement;

        while (childNode && childNode !== textBox) {
            if (this.#isBlockType(childNode.tagName))
                return childNode;

            if (childNode.parentElement === textBox) {
                const newElement = document.createElement(tagName);
                childNode.parentElement.insertBefore(newElement, childNode);
                newElement.appendChild(childNode);
                return newElement;
            }

            childNode = childNode.parentElement;
        }
    }

    /**
     * Searches through parent elements for an ancestor, until an end node is reached
     * @param {Node} node 
     * @param {string} tagName 
     * @returns {(HTMLElement|false)}
     */
    #getMatchingAncestor(node, tagName) {
        this.logFuncs && console.log('getAncestor()');

        if (node.nodeType === Node.TEXT_NODE)
            node = node.parentElement;

        while (node && node !== this.#textBox) {
            if (node.tagName === tagName)
                return node;

            node = node.parentElement;
        }

        return false;
    }

    /**
     * Retrieves an array of the text nodes in the current selection
     * 
     * @param {SelectionData} selectionData 
     * @returns {Text[]}
     */
    #getTextNodesFromSelection(selectionData = null) {
        this.logFuncs && console.log('getTextNodesFromSelection');

        selectionData ??= new SelectionData(window.getSelection());

        if (!selectionData.startNode)
            return [];

        if (selectionData.startNode === selectionData.endNode)
            if (selectionData.startNode.nodeType === Node.TEXT_NODE)
                return [ selectionData.startNode ];
            else
                return [];

        const textNodes = [];

        let foundStart = false,
            foundEnd = false;

        const searchChildren = (start) => {
            for (const node of start.childNodes) {
                if (foundEnd)
                    return;

                if (node === selectionData.startNode)
                    foundStart = true;

                if (foundStart && node.nodeType === Node.TEXT_NODE) {
                    textNodes.push(node);
                }

                searchChildren(node);

                if (node === selectionData.endNode)
                    foundEnd = true;
            }
        }

        const range = document.createRange();
        range.setStart(selectionData.startNode, selectionData.startOffset);
        range.setEnd(selectionData.endNode, selectionData.endOffset);

        searchChildren(range.commonAncestorContainer);

        return textNodes;
    }

    /**
     * Returns the word that surrounds the caret position
     * 
     * @param {Selection} selection 
     * @returns {String}
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

        const end = text.indexOf(' ', anchorOffset);

        return text.substring(
            text.lastIndexOf(' ', anchorOffset) + 1,
            (end < 0)
                ? text.length
                : end
        );
    }

    /**
     * Inserts an element containing a text node
     * @param {Object} tagInfo 
     * @param {String} tagInfo.name 
     * @param {String} tagInfo.content 
     * @param {Object} tagInfo.attributes 
     * @param {SelectionData} selectionData 
     */
    #insertElement(tagInfo, selectionData) {
        this.logFuncs && console.log('insertElement()');
        selectionData ??= new SelectionData(window.getSelection());

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
     * 
     * @param {string} tagName 
     * @returns {boolean}
     */
    #isBlockType(tagName) {
        return !!this.#blockElementTags.find(tag => tag == tagName?.toLowerCase());
    }

    /**
     * Makes a new selection based on the provided SelectionData object
     * 
     * @param {SelectionData} selectionData 
     * @param {Node} selectionData.startNode 
     * @param {Number} selectionData.startOffset 
     * @param {Node} selectionData.endNode 
     * @param {Number} selectionData.endOffset 
     */
    #makeSelection({startNode, startOffset, endNode = null, endOffset = null}) {
        if (!endNode || !endOffset) {
            window.getSelection().setPosition(startNode, startOffset);
            return;
        }

        window.getSelection().setBaseAndExtent(startNode, startOffset, endNode, endOffset);
    }

    /**
     * SelectionChange event handler for the document root
     */
    #onSelectionChange() {
        const selection = window.getSelection();
        const isCurrentTextbox = this.#textBox.contains(selection.anchorNode)
                              && this.#textBox.contains(selection.focusNode);

        this.#fieldset.disabled = !isCurrentTextbox;

        if (!isCurrentTextbox)
            return;

        const selectedTextNodes = this.#getTextNodesFromSelection(new SelectionData(selection));

        if (selectedTextNodes.length === 0)
                [this.#blockSelector.value] = this.#blockElementTags;
            else {
                const selectedBlocks = selectedTextNodes.map(n => this.#getBlockElement(n));

                const identicalBlocks = selectedBlocks.length > 0
                    && selectedBlocks.every((val, _, arr) => val.tagName === arr[0].tagName);

                this.#blockSelector.value = identicalBlocks
                    ? selectedBlocks[0].tagName.toLowerCase()
                    : null;

                this.#linkButton.disabled = (new Set(selectedBlocks)).size !== 1;
            }

            this.#tagButtons.forEach(b => b.classList.toggle('active',
                !!selectedTextNodes.length && selectedTextNodes.every(n => !!this.#getMatchingAncestor(n, b.dataset.tag))
            ));
    }

    /**
     * DEBUG FUNCTION: Outputs the innerHTML of the textBox as textContent of the htmlOutput
     */
    #outputHtml() {
        const textBox = this.#textBox;
        const {anchorNode, anchorOffset, focusNode, focusOffset} = window.getSelection();
        let nodeText = '';

        if (textBox.contains(anchorNode) && textBox.contains(focusNode))
            nodeText = `Anchor: ${anchorNode.tagName ?? 'text'} @ ${anchorOffset}\r\n` +
                        `Focus: ${focusNode.tagName ?? 'text'} @ ${focusOffset}\r\n\r\n`;

        let htmlOutput = textBox.innerHTML;

        for (const tag of this.#blockElementTags) {
            htmlOutput = htmlOutput.replaceAll(`><${tag}>`, `>\r\n<${tag}>`);
        }

        this.#htmlOutput.textContent = nodeText + htmlOutput;
    }

    async #paste(contentType = 'text/html') {
        const textBox = this.#textBox;
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

        const stripUnwantedLinkAttributes = (node) => {
            /** @type {HTMLAnchorElement[]} */
            const links = node.querySelectorAll?.call(this, 'a');
            for (const link of links) {
                for (const attribute of Array.from(link.attributes)) {
                    if (!['href', 'target'].find(attrName => attrName === attribute.localName))
                        link.removeAttribute(attribute.localName);
                }
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

                const currentBlockTag = this.#getBlockElement(node).tagName;

                if (!textRows[0].tagName || textRows[0].tagName === currentBlockTag) {
                    const parentElement = node.parentElement;
                    const parentLength = parentElement.textContent.length;
                    parentElement.innerHTML = parentElement.innerHTML.substring(0, offset) + textRows.shift().content + parentElement.innerHTML.substring(offset);
                    stripUnwantedLinkAttributes(parentElement);
                    setPosition(parentElement, parentLength - offset);
                }

                if (textRows.length === 0) {
                    this.#outputHtml();
                    return;
                }

                const newBlock = this.#addParagraphBreak(selection.anchorNode, selection.anchorOffset);
                const blockLength = newBlock.textContent.length;

                const lastTag = textRows[textRows.length - 1].tagName;
                if (!lastTag || lastTag === currentBlockTag) {
                    const lastRow = textRows.pop().content;
                    newBlock.innerHTML = lastRow + newBlock.innerHTML;
                    stripUnwantedLinkAttributes(newBlock);
                }

                for (const row of textRows) {
                    const betweenBlock = document.createElement(row.tagName ?? this.#blockElementTags[0]);
                    betweenBlock.innerHTML = row.content;
                    stripUnwantedLinkAttributes(betweenBlock);
                    newBlock.parentNode.insertBefore(betweenBlock, newBlock);
                }

                setPosition(newBlock, blockLength);
                this.#outputHtml();

                return;
            }
        }
    }
    /**
     * Cleans up the DOM by removing empty nodes
     */
    #removeEmptyNodes() {
        const treeWalker = document.createTreeWalker(this.#textBox, NodeFilter.SHOW_ELEMENT);
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
     * Replaces an element with one with a new tag that takes the old element's children
     * 
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
        element.replaceWith(newElement);

        return newElement;
    }

    /**
     * Handle keydown events for the text editor
     * @param {Event} event 
     * @param {HTMLButtonElement[]} tagButtons
     */
    #textboxKeydown(event, tagButtons) {
        const textBox = this.#textBox;

        this.#undo.saveData(textBox, new SelectionData(window.getSelection()));

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
                this.#paste();
                return;

            case 'Z':
                this.#undo.undo(textBox);
                return;

            case 'Y':
                this.#undo.redo(textBox);
                return;
        }

        const button = tagButtons.find(b => b.dataset.shortcut?.toUpperCase() === keyUpper);

        if (button)
            this.#toggleTag({ name: button.dataset.tag });
    }

    /**
     * Add or remove one or more tags of the specified type
     * 
     * @param {Object} tagInfo
     * @param {string} tagInfo.name
     * @param {string} tagInfo.content 
     * @param {Object} tagInfo.attributes 
     */
    #toggleTag(tagInfo) {
        this.logFuncs && console.clear();
        const textBox = this.#textBox;
        const selectionData = new SelectionData(window.getSelection());
        tagInfo.name = tagInfo.name.toUpperCase();

        if (!textBox.contains(selectionData.startNode) || !textBox.contains(selectionData.endNode))
            return;

        const selectedTextNodes = this.#getTextNodesFromSelection(selectionData);

        if (selectedTextNodes.length < 1)
            return;

        this.#undo.add(textBox);

        if (this.#isBlockType(tagInfo.name)) {
            const blockMatches = new Set(selectedTextNodes.map(textNode => this.#getBlockElement(textNode, tagInfo.name)));

            for (const match of blockMatches) {
                this.#replaceElement(match, tagInfo.name);
            }
        }
        else {
            const ancestorMatches = selectedTextNodes.map(n => this.#getMatchingAncestor(n, tagInfo.name));
            const noMatches = ancestorMatches.every(match => !match);

            switch (noMatches) {
                case true:
                    this.#applyInlineTag(selectedTextNodes, tagInfo, selectionData);
                    break;
            
                case false:
                    const actualMatches = ancestorMatches.filter(match => match !== false);

                    if (actualMatches.length === selectedTextNodes.length) {
                        this.#extractSelectionFromTags(selectedTextNodes, actualMatches, selectionData);
                        break;
                    }

                    this.#applyInlineTag(selectedTextNodes, tagInfo, selectionData);
                    break;
            }

        }

        this.#makeSelection(selectionData);
        this.#outputHtml();
    }
});