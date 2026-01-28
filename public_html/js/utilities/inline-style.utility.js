export { inlineStyle as default };

class InlineStyleUtility {
    /** @type {HTMLStyleElement} */ #style;

    constructor() {
        this.#style = document.createElement('style');
        document.querySelector('head').appendChild(this.#style);
    }

    /**
     * 
     * @param {string} element 
     * @param  {...[string: property, string: value]} propertyValues 
     */
    addCSS(element, ...propertyValues) {
        let css = `${element} { `;

        for (const [property, value] of propertyValues) {
            css += `${property}: ${value}; `
        }

        css += '}';

        const text = document.createTextNode(css);
        this.#style.appendChild(text);

        return text;
    }
}
const inlineStyle = new InlineStyleUtility();