/**
 * Returns an identical string with the first character changed to uppercase
 * @param {string} text 
 * @returns {string}
 */
export function fcToLowerCase(text) {
    return text.charAt(0).toLowerCase() + text.slice(1);
}

/**
 * Returns an identical string with the first character changed to uppercase
 * @param {string} text 
 * @returns {string}
 */
export function fcToUpperCase(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * @param {string} text 
 * @param {'pascal' | 'snake' | 'kebab'} oldCase 
 * @returns {string}
 */
export function toCamelCase(text, oldCase) {
    switch (oldCase) {
        case 'kebab':
            return text.toLowerCase().replaceAll(/\-([a-z0-9])/g, (_, char) => char.toUpperCase());

        case 'pascal':
            return fcToLowerCase(text);

        case 'snake':
            return text.toLowerCase().replaceAll(/\_([a-z0-9])/g, (_, char) => char.toUpperCase());

        default:
            throw new Error('Invalid old case type argument');
    }
}