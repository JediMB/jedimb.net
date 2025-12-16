/** Key-value pairs of lower-case container element tags and their uses in the text editor
 * @type {[string, string][]} */
export const containerTagsAndLabels = Object.freeze([
    ['div', 'Text'],
    ['p', 'Paragraph'],
    ['h3', 'Subheading 1'],
    ['h4', 'Subheading 2'],
    ['h5', 'Subheading 3']
]);

/** Array of allowed lower-case container element tags
 * @type {string[]} */
export const containerTags = Object.freeze(containerTagsAndLabels.map(([k]) => k));

/** Array of allowed lower-case content element tags
 * @type {string[]} */
export const contentTags = Object.freeze([ 'a', 'b', 'br', 'i', 'img', 'u' ]);

/** Complete array of allowed lower-case element tags
 * @type {string[]} */
export const tagWhiteList = Object.freeze([...containerTags, ...contentTags]);