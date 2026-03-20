/** Key-value pairs of lowercase container element tags and their uses in the text editor
 * @type {[string, string][]} */
export const containerTagsAndLabels = Object.freeze([
    ['div', 'Default'],
    ['p', 'Paragraph'],
    ['h3', 'Subheading 1'],
    ['h4', 'Subheading 2'],
    ['h5', 'Subheading 3']
]);

/** Array of allowed lowecase container element tags
 * @type {string[]} */
export const containerTags = Object.freeze(containerTagsAndLabels.map(([k]) => k));

/** Array of allowed lowercase text content element tags
 * @type {string[]} */
export const textContentTags = Object.freeze([ 'a', 'b', 'i', 'u' ]);

/** Array of allowed uppsercase non-text content element tags
 * @type {string[]} */
export const nonTextContentTags = Object.freeze([ 'br', 'img-gallery', 'img-wrapper' ]);

/** Complete array of allowed lowercase element tags
 * @type {string[]} */
export const tagWhiteList = Object.freeze([...containerTags, ...textContentTags, ...nonTextContentTags]);

/** @type {string[]} */
export const textAlignAttributes = Object.freeze([ 'text-left', 'text-center', 'text-right', 'text-justify' ]);

/** A map-like object containing properties for element tags that can have attributes,
 * where the values are arrays of those allowed attributes.
 * */
export const allowedAttributes = Object.freeze({
    div: textAlignAttributes,
    p: textAlignAttributes,
    h3: textAlignAttributes,
    h4: textAlignAttributes,
    h5: textAlignAttributes,
    a: [ 'href', 'target', 'title' ],
    'img-gallery': [ 'gallery-id', 'aspect-ratio', 'width', 'transition-time', 'wait-time' ],
    'img-wrapper': [ 'image-id', 'aspect-ratio', 'width', 'height', 'fullscreen-click' ]
});

/** @type {Object.<string, string[]>} */
export const elementsWithOptions = Object.freeze({
    hr: [ 'delete' ],
    'img-gallery': [ 'aspect-ratio', 'delete', 'transition-time', 'wait-time', 'width' ],
    'img-wrapper': [ 'aspect-ratio', 'delete', 'fullscreen-click', 'height', 'width' ]
});

/** Array of uppercase keys that should have their default behavior even when accompanied by modifier keys
 * @type {string[]} */
export const defaultBehaviorKeys = Object.freeze([
    'Control', 'Shift', 'Alt', 'Process', 'CapsLock',
    'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
    'Home', 'End', 'Enter',
    'A', 'C', 'X'
].map(k => k.toUpperCase()));

/** Matches against container tags and their content
 * @type {RegExp} */
export const regexMatchContainers = new RegExp(
    '<(?<tag>' +
    containerTags.join('|') +
    ')\\b[ \\w=\\"\\-#;]*>(.*?)(<\\/\\k<tag>>)',
    'i'
); // /<(?<tag>div|h2|p|etc)\b[ \w=\"\-#;]*>(.*?)<\/\k<tag>>/

/** Matches against any attribute text that is not specified in the whitelist
 * @type {RegExp} */
export const regexDisallowedAttributes = new RegExp(
    '<(?!(' +
    Object.getOwnPropertyNames(allowedAttributes).join(' )|(') +
    ' ))[a-z][a-z0-9\\-]*( [^>]*)>', 'gi'
);

/** Matches against any elements not in the whitelist
 * @type {RegExp} */
export const regexDisallowedElements = new RegExp('(<\/?(?!(' + tagWhiteList.join('|') + ')\\b)([a-z0-9\-]*>))', "gi");

/** Matches against indentations (2+ whitespaces)
 * @type {RegExp} */
export const regexIndentations = /\s{2,}/g;