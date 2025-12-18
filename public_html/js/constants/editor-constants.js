/** Key-value pairs of uppercase container element tags and their uses in the text editor
 * @type {[string, string][]} */
export const containerTagsAndLabels = Object.freeze([
    ['DIV', 'Text'],
    ['P', 'Paragraph'],
    ['H3', 'Subheading 1'],
    ['H4', 'Subheading 2'],
    ['H5', 'Subheading 3']
]);

/** Array of allowed uppercase container element tags
 * @type {string[]} */
export const containerTags = Object.freeze(containerTagsAndLabels.map(([k]) => k));

/** Array of allowed uppercase text content element tags
 * @type {string[]} */
export const textContentTags = Object.freeze([ 'A', 'B', 'BR', 'I', 'U' ]);

/** Array of allowed uppsercase non-text content element tags
 * @type {string[]} */
export const nonTextContentTags = Object.freeze([ 'IMG' ]);

/** Complete array of allowed uppercase element tags
 * @type {string[]} */
export const tagWhiteList = Object.freeze([...containerTags, ...textContentTags, ...nonTextContentTags]);

/** Array of uppercase keys that should have their default behavior even when accompanied by modifier keys
 * @type {string[]} */
export const defaultBehaviorKeys = Object.freeze([
    'Control', 'Shift', 'Alt', 'Process', 'CapsLock',
    'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
    'Home', 'End', 'Enter',
    'A', 'C', 'X'
].map(k => k.toUpperCase()));

/** A map-like object containing properties for element tags that can have attributes,
 * where the values are arrays of those allowed attributes.
 * */
export const allowedAttributes = Object.freeze({
    a: [ 'href', 'target', 'title' ],
    img: [ 'src', 'alt', 'data-image-id' ]
});

/** Matches against container tags and their content
 * @type {RegExp} */
export const regexMatchContainers = new RegExp(
    '<(?<tag>' +
    containerTags.join('|') +
    ')\\b[ \\w=\\"\\-#;]*>(.*?)(<\\/\\k<tag>>)',
    'i'
); // /<(?<tag>DIV|H2|P)\b[ \w=\"\-#;]*>(.*?)<\/\k<tag>>/

/** Matches against any attribute text that is not attached to an A tag
 * @type {RegExp} */
export const regexMatchDisallowedAttributes = new RegExp(
    '<(?!(' +
    Object.getOwnPropertyNames(allowedAttributes).join(' )|(') +
    ' ))[a-z][a-z0-9\\-]*( [^>]*)>', 'gi'
);

/** Matches against any elements now in the whitelist
 * @type {RegExp} */
export const regexMatchDisallowedElements = new RegExp('(<\/?(?!(' + tagWhiteList.join('|') + ')\\b)([a-z]*>))', "gi");

/** Matches against indentations (2+ whitespaces)
 * @type {RegExp} */
export const regexMatchIndentations = /\s{2,}/g;