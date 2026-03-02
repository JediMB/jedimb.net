import * as c from "/js/constants/editor-constants.js";
import * as p from "/js/utilities/paste.utility.js";
import { fillSelect } from "/js/utilities/form.utility.js";
import Gallery from "/js/models/image-gallery/gallery.model.js";
import Image from "/js/models/image-gallery/image.model.js";
import SelectionData from "/js/models/selection-data.model.js";
import undoManagementService from "/js/services/undo-management.service.js";

export class TextEditorComponent extends HTMLElement {
    static #keyMods = Object.freeze({ none: 0b0, shift: 0b1, ctrl: 0b10, alt: 0b100 });

    /** @type {TextEditorComponent} */ #self;
    #undo = undoManagementService;
    /** @type {SelectionData} */
    #latestSelection;

    #fieldset;
    /** @type {HTMLSelectElement} */ #blockSelector;
    #tagButtons;
    #linkButton;
    #pageBreakButton;
    /** @type {HTMLElement} */ #textBox;
    /** @type {HTMLTextAreaElement} */  #htmlEditor;
    /** @type {MutationObserver} */ #mutationObserver;

    /** @type {Function[]} */ #onChange = [];

    constructor() {
        const component = super();
        this.#self = component;

        this.#onSelectionChange = this.#onSelectionChange.bind(this);
    }

    connectedCallback() {
        const self = this.#self;
        self.toggleAttribute('hidden', true);

        this.#fieldset = self.querySelector('fieldset');
        this.#blockSelector = this.#fieldset.querySelector('[select-blocktype]');
        this.#tagButtons = Array.from(this.#fieldset.querySelectorAll('[data-tag]'));
        this.#linkButton = this.#fieldset.querySelector('[btn-link]');
        this.#pageBreakButton = this.#fieldset.querySelector('[btn-pagebreak]');
        this.#textBox = self.querySelector('text-box');
        this.#htmlEditor = self.querySelector('[html-editor]');

        const htmlCheck = self.querySelector('[checkbox-html]');

        document.addEventListener('selectionchange', this.#onSelectionChange);

        fillSelect(this.#blockSelector, c.containerTagsAndLabels);

        this.#blockSelector.addEventListener('change', event => {
            event.stopPropagation();

            if (document.getSelection().anchorNode !== this.#textBox)
                this.#toggleTag({ name: this.#blockSelector.value });

            this.#textBox.focus();
        });

        this.#tagButtons.forEach(button => button.dataset.shortcut && button.addEventListener('click', () => this.#toggleTag({ name: button.dataset.tag.toLowerCase() })));

        this.#linkButton.addEventListener('click', () => this.#addLink(this.#linkButton));

        this.#pageBreakButton.addEventListener('click', () => this.#insertPageBreak());

        this.#textBox.addEventListener('click', (event) => {
            const link = this.#getMatchingAncestor(event.target, 'a');

            if (link && link.href && this.#hasKeyMods(event, TextEditorComponent.#keyMods.ctrl)) {
                event.preventDefault();
                window.open(link.href, '_blank');
                return;
            }
        });

        this.#textBox.addEventListener('input', () => {
            const selection = document.getSelection();
            const node = selection.anchorNode;
            if (node.nodeType === Node.TEXT_NODE && node.parentElement === this.#textBox) {
                this.#getBlockElement(node);
                selection.setPosition(node, node.textContent.length);
            }

            this.#undo.add(this.#textBox, true);
        });

        this.#textBox.addEventListener('keydown', event => {
            this.#textboxKeydown(event);
        });

        this.#mutationObserver = new MutationObserver((mutationList, _) => {
            for (const record of mutationList) {
                if (record.target !== self.#textBox)
                    continue;

                switch (record.attributeName) {
                    case 'data-gallery-insert':
                        if (!self.#textBox.hasAttribute('data-gallery-insert'))
                            continue;
                        
                        this.#addGallery();
                        break;

                    case 'data-image-insert':
                        if (!self.#textBox.hasAttribute('data-image-insert'))
                            continue;
                
                        this.#addImage();
                        break;

                    default:
                        continue;
                }
                break;
            }

            if (this.#onChange.length)
                this.#onChange[0].call(this);
        });
        this.#mutationObserver.observe(
            this.#textBox, {
                characterData: true,
                childList: true,
                subtree: true,
                attributeFilter: ['data-image-insert', 'data-gallery-insert']
            }
        );

        this.#htmlEditor.addEventListener('input', () => {
            this.#undo.clear(this.#textBox);
            const lines = this.#htmlEditor.value.split(/\r?\n|\r|\n/g);
            this.#textBox.innerHTML = lines.map(line => line.trim()).join('');
        });
        this.#htmlEditor.addEventListener('change', event => event.stopPropagation());

        htmlCheck.addEventListener('change', event => {
            event.stopPropagation();

            const editHtml = htmlCheck.checked;

            if (editHtml)
                this.#htmlEditor.value = this.#getContent(true);

            this.#textBox.toggleAttribute('hidden', editHtml);
            this.#htmlEditor.toggleAttribute('hidden', !editHtml);
        });

        self.removeAttribute('hidden');
    }

    disconnectedCallback() {
        document.removeEventListener('selectionchange', this.#onSelectionChange);
    }

    connectedMoveCallback() {}

    /** Gives outside access to the text-box content */
    get content() {
        const self = this;

        return {
            get html() {
                self.#encloseRootText();
                return {
                    get full() { return self.#textBox.innerHTML ?? ''; },
                    get rest() { return self.#textBox.innerHTML.match(/^.*(?:<hr page-break(?:="")?>)(.+)$/si)?.at(1) ?? ''; },
                    get short() { return self.#textBox.innerHTML.match(/^(.*<hr page-break(?:="")?>)/si)?.at(1) ?? self.#textBox.innerHTML ?? ''; }
                };
            },
            get text() { return self.#textBox.textContent; },
            get media() {
                return [
                    ...self.#textBox.querySelectorAll('img-gallery'),
                    ...self.#textBox.querySelectorAll('img-wrapper')
                ];
            },
            /** @param {() => void} func  */
            set onChange(func) {
                if (typeof func !== 'function')
                    throw new Error('onChange parameter is not a function');

                while (self.#onChange.length) {
                    self.#onChange.pop();
                }

                self.#onChange.push(func);
            },
            reset() {
                self.#textBox.textContent = '';
                self.#htmlEditor.textContent = '';
            }
        };
    }

    #addGallery() {
        /** @type {Gallery} */
        const gallery = JSON.parse(this.#textBox.getAttribute('data-gallery-insert'));
        this.#textBox.removeAttribute('data-gallery-insert');

        this.#makeSelection(this.#latestSelection);

        this.#toggleTag({
            name: 'img-gallery',
            attributes: {
                'gallery-id': gallery.id,
                'aspect-ratio': '16/9',
                'width': '50%',
                'transition-time': '2000',
                'wait-time': '2000'
            }
        });
    }

    /** Add an image using data from the component's data-image-insert attribute */
    #addImage() {
        /** @type {Image} */
        const image = JSON.parse(this.#textBox.getAttribute('data-image-insert'));
        this.#textBox.removeAttribute('data-image-insert');

        this.#makeSelection(this.#latestSelection);

        this.#toggleTag({
            name: 'img-wrapper',
            attributes: {
                'image-id': image.id
            }
        });
    }

    /**
     * Add a hyperlink to the selected text
     * 
     * @param {HTMLButtonElement} button 
     */
    #addLink(button) {
        const selection = window.getSelection();
        const tagName = button.dataset.tag.toLowerCase();

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
            linkText = prompt(button.dataset.textQuery ?? 'Please input display text:', this.#getWord(selection));

            if (!linkText)
                return;
        }
        
        let linkUrl;
        let urlQuery = button.dataset.urlQuery ?? 'Please input link:';

        do {
            linkUrl = prompt(urlQuery, 'https://');
            
            if (!linkUrl)
                return;

            const emailMatch = linkUrl.match(/(?!.*\.{2,})^(mailto:)?[\w\-\.\%\/\+]{1,64}\@[\w\.]{1,64}\.[a-zA-Z0-9\-]{1,32}$/);
            if (emailMatch) {
                if (!emailMatch[1])
                    linkUrl = `mailto:${linkUrl}`;
                break;
            }

            if (!linkUrl.match(/^[\w\/][\w\-\.\/\?\+:#=%@]+$/)) {
                linkUrl = '';
                urlQuery = button.dataset.urlInvalid ?? 'Invalid link. Please try again:';
                continue;
            }

            const isRelative = linkUrl.match(/^(?:\/?\w[\w\-]*)+(?:\.[a-zA-Z0-9]+)?(?:(?:\?|\#)[=\w%]*)?$/);

            if (!isRelative && !linkUrl.match(/^[a-z]{3,}:/))
                linkUrl = `https://${linkUrl}`;
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
        const newBlock = document.createElement(blockNode.localName);
        blockNode.insertAdjacentElement('afterend', newBlock);

        const splitTree = (start, destination) => {
            let foundCenter = false;

            for (const node of Array.from(start.childNodes)) {
                if (node.contains(textNode)) {
                    foundCenter = true;

                    switch (node.nodeType) {
                        case Node.ELEMENT_NODE:
                            const twin = document.createElement(node.localName);
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
    #applyContentTag(textNodes, tagInfo, selectionData) {
        let collapsedOffset = false;

        if (selectionData.isCollapsed) {
            if (
                selectionData.startOffset === 0
                || !selectionData.startNode.textContent[selectionData.startOffset-1].trim()
                || selectionData.startOffset === selectionData.startNode.textContent.length
                || !selectionData.startNode.textContent[selectionData.startOffset].trim()
            ) {
                this.#insertContentElement(tagInfo, selectionData);
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
     * @param {Node[]} nodes 
     * @param {Object} tagInfo
     * @param {String} tagInfo.name
     * @param {String} tagInfo.content
     * @param {Object} tagInfo.attributes
     * @param {Object} tagInfo.dataset
     */
    #encloseNodes(nodes, tagInfo) {
        const newElement = document.createElement(tagInfo.name);
        
        for (const attribute in tagInfo.attributes) {
            newElement.setAttribute(attribute, tagInfo.attributes[attribute]);
        }
        
        for (const dataKey in tagInfo.dataset) {
            newElement.dataset[dataKey] = tagInfo.dataset[dataKey];
        }

        if (nodes.length === 1) {
            nodes[0].parentNode.insertBefore(newElement, nodes[0]);
            newElement.appendChild(nodes[0]);
            
            if (tagInfo.content)
                nodes[0].textContent = tagInfo.content;

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
            if (child?.localName === tagInfo.name) {
                Array.from(child.childNodes).forEach(grandchild => {
                    child.parentNode.insertBefore(grandchild, child);
                });
                child.remove();
            }
        }
    }

    /** Encloses any text nodes placed directly in the text-box in an appropriate container element */
    #encloseRootText() {
        for (const rootChild of this.#textBox.childNodes) {
            if (rootChild.nodeType !== Node.TEXT_NODE)
                continue;

            const tag = rootChild.previousSibling?.localName
                ?? rootChild.nextSibling?.localName
                ?? c.containerTags[0];

            const newElement = document.createElement(tag);
            this.#textBox.insertBefore(newElement, rootChild);
            newElement.appendChild(rootChild);
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
        if (textNodes.length !== elements.length) {
            console.error('removeInlineTag called without matching in-data');
            return;
        }

        const uniqueElements = new Set(elements);
        const tagName = elements[0].localName;

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
        const textBox = this.#textBox;

        if (!tagName)
            tagName = this.#blockSelector.value
                ? this.#blockSelector.value
                : c.containerTags[0];

        if (!childNode || childNode === textBox) {
            const newElement = document.createElement(tagName);
            textBox.appendChild(newElement);
            return newElement;
        }

        if (childNode.nodeType === Node.TEXT_NODE && childNode.parentElement !== textBox)
            childNode = childNode.parentElement;

        while (childNode && childNode !== textBox) {
            if (this.#isBlockType(childNode.localName))
                return childNode;

            if (childNode.parentElement === textBox)
                break;

            childNode = childNode.parentElement;
        }

        const newElement = document.createElement(tagName);
        textBox.insertBefore(newElement, childNode);
        newElement.appendChild(childNode);
        return newElement;
    }

    /**
     * @param {Boolean} doFormat 
     * @returns {String}
     */
    #getContent(doFormat = false) {
        let htmlOutput = this.#textBox.innerHTML;

        if (!doFormat)
            return htmlOutput;

        for (const tag of c.containerTags)
            htmlOutput = htmlOutput.replaceAll(`><${tag}>`, `>\r\n<${tag}>`);

        return htmlOutput.replaceAll('><!--', '>\r\n<!--');
    }

    /**
     * Searches through parent elements for an ancestor, until an end node is reached
     * @param {Node} node 
     * @param {string} tagName 
     * @returns {(HTMLElement|false)}
     */
    #getMatchingAncestor(node, tagName) {
        if (node.nodeType === Node.TEXT_NODE)
            node = node.parentElement;

        while (node && node !== this.#textBox) {
            if (node.localName === tagName)
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
     * Checks of the event has exactly the specified modifiers.
     * Uses static keyModifiers enum
     * 
     * @param {Event} event 
     * @param {Number} modifiers 
     * @returns {Boolean}
     */
    #hasKeyMods(event, modifiers) {
        return modifiers === ((event.shiftKey * 0b1) + (event.ctrlKey * 0b10) + (event.altKey * 0b100));
    }

    /**
     * Inserts an element containing a text node
     * @param {Object} tagInfo 
     * @param {String} tagInfo.name 
     * @param {String} tagInfo.content 
     * @param {Object} tagInfo.attributes 
     * @param {Object} tagInfo.dataset
     * @param {SelectionData} selectionData 
     */
    #insertContentElement(tagInfo, selectionData) {
        selectionData ??= new SelectionData(window.getSelection());
        const isTextElement = c.textContentTags.some(t => t === tagInfo.name);

        const element = document.createElement(tagInfo.name);

        for (const attribute in tagInfo.attributes) {
            element.setAttribute(attribute, tagInfo.attributes[attribute]);
        }

        for (const dataKey in tagInfo.dataset) {
            element.dataset[dataKey] = tagInfo.dataset[dataKey];
        }

        let textNode;
        if (isTextElement) {
            element.innerHTML = tagInfo.content ?? '&nbsp';
            textNode = element.firstChild;
        }
        
        const range = document.createRange();
        range.setStart(selectionData.startNode, selectionData.startOffset);
        range.collapse();

        if (selectionData.startNode === this.#textBox) {
            const block = document.createElement(this.#blockSelector.value);
            block.appendChild(element);
            range.insertNode(block);
        }
        else
            range.insertNode(element);

        if (textNode) {
            selectionData.isCollapsed = false;
            selectionData.startNode = selectionData.endNode = textNode;
            selectionData.startOffset = 0;
            selectionData.endOffset = textNode.textContent.length;
            return;
        }
        
        selectionData.isCollapsed = true;
        selectionData.startNode = selectionData.endNode = element.nextSibling ?? element.parentElement;
        selectionData.startOffset = selectionData.endOffset = element.nextSibling ? 0 : 1;
    }

    #insertPageBreak() {
        const textBox = this.#textBox;
        const selectionData = new SelectionData(getSelection());

        const existingPageBreaks = textBox.querySelectorAll('hr[page-break]');

        for (const pageBreak of existingPageBreaks)
            pageBreak.remove();

        const blockElement = this.#getBlockElement(selectionData.startNode);
        const pageBreak = document.createElement('hr');
        pageBreak.toggleAttribute('page-break', true);

        if (selectionData.startNode === blockElement || selectionData.startNode === this.#textBox) {
            selectionData.startNode = selectionData.endNode = pageBreak;
            selectionData.startOffset = selectionData.endOffset = 1;
        }

        if (!blockElement.firstChild || blockElement.innerHTML === '<br>')
            blockElement.replaceWith(pageBreak);
        else
            blockElement.insertAdjacentElement('afterend', pageBreak);
    }

    /**
     * Checks if the specified tag type is in the list of block tags
     * 
     * @param {string} tagName 
     * @returns {boolean}
     */
    #isBlockType(tagName) {
        return !!c.containerTags.find(tag => tag === tagName);
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
        this.#textBox.focus();

        if (!endNode || !endOffset) {
            window.getSelection().setPosition(startNode, startOffset);
            return;
        }

        window.getSelection().setBaseAndExtent(startNode, startOffset, endNode, endOffset);
    }

    /**
     * SelectionChange event handler for the document root
     */
    #onSelectionChange = () => {
        const selection = window.getSelection();
        const isCurrentTextbox = this.#textBox.contains(selection.anchorNode)
                              && this.#textBox.contains(selection.focusNode);

        this.#fieldset.disabled = !isCurrentTextbox;

        if (!isCurrentTextbox) {
            this.#tagButtons.forEach(b => b.classList.remove('highlight'));
            return;
        }

        this.#latestSelection = new SelectionData(selection);

        const selectedTextNodes = this.#getTextNodesFromSelection(this.#latestSelection);

        if (selectedTextNodes.length === 0)
            [this.#blockSelector.value] = c.containerTags;
        else {
            const selectedBlocks = selectedTextNodes.map(n => this.#getBlockElement(n));

            const identicalBlocks = selectedBlocks.length > 0
                && selectedBlocks.every((block, _, arr) => block && block.localName === arr[0].localName);

            this.#blockSelector.value = identicalBlocks
                ? selectedBlocks[0].localName
                : null;

            this.#linkButton.disabled = (new Set(selectedBlocks)).size !== 1;
        }

        for (const btn of this.#tagButtons) {
            btn.classList.toggle('highlight',
                !!selectedTextNodes.length
                && selectedTextNodes.every(n => !!this.#getMatchingAncestor(n, btn.dataset.tag.toLowerCase()))
            );
        }

        this.#pageBreakButton.disabled = !this.#latestSelection.isCollapsed;
    }

    async #paste(pasteHtml = true) {
        const textBox = this.#textBox;
        this.#undo.add(textBox);

        const selection = window.getSelection();

        const clipboardContent = await navigator.clipboard.read();
    
        let pasted,
            contentType;

        if (pasteHtml) {
            pasted = clipboardContent.find(i => i.types.includes('text/html'));
            contentType = 'text/html';
        }

        if (!pasted) {
            pasted = clipboardContent.find(i => i.types.includes('text/plain'));
            contentType = 'text/plain';

            if (!pasted)
                return;
        }

        selection.deleteFromDocument();

        const isForward = selection.direction !== 'backward';
        let node = isForward ? selection.anchorNode : selection.focusNode,
            offset = isForward ? selection.anchorOffset : selection.focusOffset;

        const currentBlock = this.#getBlockElement(node);
        const currentBlockTag = currentBlock.localName;

        if (node === textBox || node === currentBlock) {
            node = document.createTextNode('');
            offset = 0;

            if (currentBlock.childNodes.length === 1 && currentBlock.innerHTML === '<br>')
                currentBlock.replaceChildren(node);
            else
                currentBlock.appendChild(node);
        }

        let text = await (await pasted.getType(contentType)).text();

        if (contentType === 'text/plain') {
            const textNode = document.createTextNode(text);
            const range = document.createRange();
            range.setStart(node, offset);
            range.insertNode(textNode);
            return;
        }

        text = text.replaceAll(c.regexDisallowedAttributes, '')
            .replaceAll(c.regexIndentations, '')
            .replaceAll(c.regexDisallowedElements, '');

        const textRows = p.splitIntoContainerRows(text);

        if (!textRows[0].tag || textRows[0].tag === currentBlockTag)
            p.fillFirstContainer(textRows, node, offset);

        if (textRows.length === 0)
            return;

        const lastContainer = this.#addParagraphBreak(selection.anchorNode, selection.anchorOffset);
        const originalLength = lastContainer.textContent.length;

        const lastTag = textRows[textRows.length - 1].tag;
        if (!lastTag || lastTag === currentBlockTag)
            p.fillLastContainer(textRows, lastContainer);

        p.fillRemainingContainers(textRows, lastContainer, originalLength);
    }

    /**
     * Replaces an element with one with a new tag that takes the old element's children
     * 
     * @param {HTMLElement} element 
     * @param {string} newTag 
     * @returns {HTMLElement}
     */
    #replaceElement(element, newTag) {
        if (element.localName === newTag)
            return element;

        const newElement = document.createElement(newTag);
        newElement.replaceChildren(...element.childNodes);
        element.replaceWith(newElement);

        return newElement;
    }

    /**
     * Handle keydown events for the text editor
     * @param {Event} event 
     */
    #textboxKeydown(event) {
        const textBox = this.#textBox;
        const keyUpper = event.key.toUpperCase();

        const selectionData = new SelectionData(window.getSelection());

        const selectionNode = selectionData.startNode;
        if (keyUpper === 'BACKSPACE' && selectionNode.nodeType === Node.ELEMENT_NODE) {
            selectionData.isCollapsed = true;
            selectionData.startNode = selectionData.endNode = selectionNode.previousSibling ?? selectionNode.parentNode;
            selectionData.startOffset = selectionData.endOffset = selectionNode.previousSibling
                ? ( selectionNode.previousSibling.nodeType === Node.TEXT_NODE
                    ? selectionNode.textContent.length
                    : 1
                )
                : 0
        }
        this.#undo.saveData(textBox, selectionData);

        if (c.defaultBehaviorKeys.some(k => k === keyUpper))
            return;

        if (!this.#hasKeyMods(event, TextEditorComponent.#keyMods.ctrl))
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

        const button = this.#tagButtons.find(b => b.dataset.shortcut?.toUpperCase() === keyUpper);

        if (button)
            this.#toggleTag({ name: button.dataset.tag.toLowerCase() });
    }

    /**
     * Add or remove one or more tags of the specified type
     * 
     * @param {{name: string, content: string, attributes: {}, dataset: {}}} tagInfo
     */
    #toggleTag(tagInfo) {
        const textBox = this.#textBox;
        const selectionData = new SelectionData(window.getSelection());
        tagInfo.name = tagInfo.name;

        if (!textBox.contains(selectionData.startNode) || !textBox.contains(selectionData.endNode))
            return;

        this.#undo.add(textBox);

        const selectedTextNodes = this.#getTextNodesFromSelection(selectionData);

        if (this.#isBlockType(tagInfo.name)) {
            if (selectedTextNodes.length < 1) {
                this.#replaceElement(this.#getBlockElement(selectionData.startNode, tagInfo.name), tagInfo.name);
            }
            else {
                const blockMatches = new Set(selectedTextNodes.map(textNode => this.#getBlockElement(textNode, tagInfo.name)));

                for (const match of blockMatches) {
                    this.#replaceElement(match, tagInfo.name);
                }
            }
        }
        else {
            if (selectedTextNodes.length < 1) {
                this.#insertContentElement(tagInfo, selectionData);
            }
            else {
                const ancestorMatches = selectedTextNodes.map(n => this.#getMatchingAncestor(n, tagInfo.name));
                const noMatches = ancestorMatches.every(match => !match);

                switch (noMatches) {
                    case true:
                        this.#applyContentTag(selectedTextNodes, tagInfo, selectionData);
                        break;
                
                    case false:
                        const actualMatches = ancestorMatches.filter(match => match !== false);

                        if (actualMatches.length === selectedTextNodes.length) {
                            this.#extractSelectionFromTags(selectedTextNodes, actualMatches, selectionData);
                            break;
                        }

                        this.#applyContentTag(selectedTextNodes, tagInfo, selectionData);
                        break;
                }
            }
        }

        this.#makeSelection(selectionData);
    }
};

customElements.define('text-editor-component', TextEditorComponent);