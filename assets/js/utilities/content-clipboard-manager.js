export default class ContentClipboardManager {
    /** @type {HTMLElement} */ #container;

    /** @param {HTMLElement} container  */
    constructor(container) {
        this.#container = container;
    }

    async copy() { this.#copyToClipboard(); }

    async cut() { await this.#copyToClipboard({deleteSelection: true}); }

    async paste() {

    }

    /**
     * @param {object} options 
     * @param {boolean} options.deleteSelection
     */
    async #copyToClipboard(options) {
        const selection = getSelection();

        if (selection.isCollapsed)
            return;

        try {
            const validRanges = selection.getComposedRanges()
                .map((_, index) => selection.getRangeAt(index))
                .filter(range => this.#container.contains(range.commonAncestorContainer));

            const selectedContents = validRanges.map(range => {
                let contents = range.cloneContents();
                
                let element = range.commonAncestorContainer;
                if (element.nodeType === Node.TEXT_NODE)
                    element = element.parentElement;

                while (element && element !== this.#container) {
                    const newElement = document.createElement(element.localName);
                    newElement.append(contents);
                    contents = newElement;
                    element = element.parentElement;
                }

                return contents;
            });

            if (options?.deleteSelection)
                validRanges.forEach(range => range.deleteContents());

            if (!selectedContents.length)
                return;

            const [text, html] = this.#getTextAndHTML(selectedContents);

            const clipboardItem = new ClipboardItem({
                'text/plain': new Blob([text], { type: 'text/plain' }),
                'text/html': new Blob([html], { type: 'text/html' })
            });

            await navigator.clipboard.write([clipboardItem]);
        }
        catch (_) {
            if (options?.deleteSelection) {
                document.execCommand('cut');
                console.error('Fell back to execCommand cut functionality');
                return;
            }

            document.execCommand('copy');
            console.error('Fell back to execCommand copy functionality');
        }
    }

    /**
     * @param  {Node[]} nodes 
     * @returns {[text: string, html: string]}
     */
    #getTextAndHTML(nodes) {
        const container = document.createElement('div');
        container.append(...nodes);
        return [ container.innerText, container.innerHTML ];
    }
}