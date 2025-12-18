import { containerTags, regexMatchContainers } from "/js/constants/editor-constants.js";

/** A row/block of pasted text
 * @typedef {Object} TextRow
 * @property {(string|null)} tagName
 * @property {string} content
*/

/**
 * @param {TextRow[]} textRows The rows/blocks of pasted text
 * @param {Node} node Node derived from the current selection
 * @param {number} offset Offset derived from the current selection
 */
export function fillFirstContainer(textRows, node, offset) {
    const parentElement = node.parentElement;
    const parentLength = parentElement.textContent.length;
    parentElement.innerHTML = parentElement.innerHTML.substring(0, offset) + textRows.shift().content + parentElement.innerHTML.substring(offset);
    stripUnwantedLinkAttributes(parentElement);
    setCaretPosition(parentElement, parentLength - offset);
}

/**
 * @param {TextRow[]} textRows 
 * @param {HTMLElement} container 
 */
export function fillLastContainer(textRows, container) {
    const lastRow = textRows.pop().content;
    container.innerHTML = lastRow + container.innerHTML;
    stripUnwantedLinkAttributes(container);
}

/**
 * @param {TextRow[]} textRows 
 * @param {HTMLElement} lastContainer 
 * @param {Number} originalLength
 */
export function fillRemainingContainers(textRows, lastContainer, originalLength) {
    for (const row of textRows) {
        const betweenBlock = document.createElement(row.tagName ?? containerTags[0]);
        betweenBlock.innerHTML = row.content;
        stripUnwantedLinkAttributes(betweenBlock);
        lastContainer.parentNode.insertBefore(betweenBlock, lastContainer);
    }

    setCaretPosition(lastContainer, originalLength);
}

/**
 * @param {HTMLElement} parent 
 * @param {number} originalLength 
 * @param {number} cumulativeLength 
 */
export function setCaretPosition(parent, originalLength, cumulativeLength = 0) {
    const children = Array.from(parent.childNodes).reverse();

    for (const child of children) {
        cumulativeLength += child.textContent.length;

        if (originalLength > cumulativeLength)
            continue;

        if (child.nodeType === Node.TEXT_NODE) {
            window.getSelection().setPosition(child, cumulativeLength - originalLength);
            break;
        }

        setCaretPosition(child, originalLength, cumulativeLength - child.textContent.length);
        break;
    }
}

/**
 * @param {string} text
 * @return {TextRow[]}
 */
export function splitIntoContainerRows(text) {
    const textRows = [];

    while (text) {
        const match = text.match(regexMatchContainers);

        if (!match) {
            textRows.push({tagName: null, content: text});
            break;
        }

        if (match.index > 0)
            textRows.push({tagName: null, content: text.substring(0, match.index)});

        textRows.push({tagName: match[1].toUpperCase(), content: match[2]});
        text = text.substring(match.index + match[0].length);
    }

    return textRows;
}

/**
 * @param {HTMLElement} node 
 */
export function stripUnwantedLinkAttributes(node) {
    /** @type {HTMLAnchorElement[]} */
    const links = node.querySelectorAll('a');
    for (const link of links) {
        for (const attribute of Array.from(link.attributes)) {
            if (!['href', 'target', 'title'].find(attrName => attrName === attribute.localName))
                link.removeAttribute(attribute.localName);
        }
    }
}