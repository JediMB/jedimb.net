export { inlineStyle as default };

class InlineStyleUtility {
    /** @type {HTMLStyleElement} */ #style;

    constructor() {
        this.#style = document.createElement('style');
        document.querySelector('head').appendChild(this.#style);
    }

    /**
     * @param {string} element 
     * @param  {{}} propertyValues 
     */
    addCSS(element, propertyValues = {}) {
        const text = document.createTextNode(this.#createCSS(element, propertyValues));
        this.#style.appendChild(text);

        return text;
    }

    /**
     * @param {Text} cssTextNode
     * @param {string} element 
     * @param  {{}} propertyValues 
     */
    replaceCSS(cssTextNode, element, propertyValues) {
        if (!cssTextNode || cssTextNode.nodeType !== Node.TEXT_NODE)
            throw new Error('First parameter in replaceCSS is not a text node');

        cssTextNode.textContent = this.#createCSS(element, propertyValues);
    }

    /**
     * @param {string} element 
     * @param  {{}} propertyValues 
     * @returns {string}
     */
    #createCSS(element, propertyValues) {
        let css = `${element} { `;

        for (const property in propertyValues) {
            css += `${property}: ${propertyValues[property]}; `
        }

        return css + '}';
    }
}
const inlineStyle = new InlineStyleUtility();