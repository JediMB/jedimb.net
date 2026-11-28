export default class ContentClipboardManager {
    /** @type {HTMLElement} */ #container;
    /** @type {HTMLElement} */ #subContainer = null;
    /** @type {string[]} */ #validInlineTags = [];

    /**
     * @param {HTMLElement} container 
     * @param {string[]} validInlineTags 
     */
    constructor(container, validInlineTags) {
        this.#pasteEvent = this.#pasteEvent.bind(this);

        this.#container = container;

        if (validInlineTags)
            this.#validInlineTags = [...validInlineTags];

        this.#container.addEventListener('paste', this.#pasteEvent);
    }

    async copy() { await this.#copyToClipboard(); }

    async cut() { await this.#copyToClipboard({deleteSelection: true}); }

    async paste() {
        const [data, contentType] = await this.#findClipboardText('text/html', 'text/plain');

        if (!data) return;

        this.#pasteToSelection(data, contentType);
    }

    /** @param {HTMLElement} subContainer  */
    setSubContainer(subContainer) {
        this.#subContainer = subContainer;
    }

    /** @param {string[]} newInlineTags  */
    setValidInlineTags(newInlineTags) {
        this.#validInlineTags = [...newInlineTags];
    }

    /**
     * @param {string} html 
     * @returns {string}
     */
    #cleanUp(html) {
        const container = document.createElement('div');
        container.innerHTML = html;

        const elements = container.querySelectorAll('*');

        for (const element of elements) {
            const isValid = this.#validInlineTags.includes(element.localName);

            if (!isValid) {
                element.replaceWith(...element.childNodes);
                continue;
            }

            for (const attribute of element.attributes) {
                element.removeAttributeNode(attribute);
            }
        }

        return container.innerHTML;
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
                .filter(range => (this.#subContainer || this.#container).contains(range.commonAncestorContainer));

            const selectedContents = validRanges.map(range => {
                let contents = range.cloneContents();
                
                let element = range.commonAncestorContainer;
                if (element.nodeType === Node.TEXT_NODE)
                    element = element.parentElement;

                while (element && element !== (this.#subContainer || this.#container)) {
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
     * @typedef {'text/html'|'text/plain'} ContentType
     * @param  {...ContentType} wantedContentTypes 
     * @returns {Promise<[string, ContentType]|null[]>}
     */
    async #findClipboardText(...wantedContentTypes) {
        const content = await navigator.clipboard.read();

        for (const type of wantedContentTypes) {
            const item = content.find(i => i.types.includes(type));

            if (item) {
                const blob = await item.getType(type);
                return [await blob.text(), type];
            }
        }
        
        return [null];
    }

    #pasteEvent = (event) => {
        if (!(this.#subContainer || this.#container).isContentEditable)
            return;

        for (const type of ['text/html', 'text/plain']) {
            const data = event.clipboardData.getData(type);

            if (data) {
                event.preventDefault();
                event.stopPropagation();
                this.#pasteToSelection(data, type);
                return;
            }
        }
    }

    /**
     * @param {string} data 
     * @param {ContentType} type 
     */
    #pasteToSelection(data, type) {
        const selection = getSelection();

        try {
            const validRanges = selection.getComposedRanges()
                .map((_, index) => selection.getRangeAt(index))
                .filter(range => (this.#subContainer || this.#container).contains(range.commonAncestorContainer));

            data = this.#cleanUp(data);

            switch (type) {
                case 'text/html':
                    for (const range of validRanges) {
                        range.deleteContents();
                        range.insertNode(range.createContextualFragment(data));
                        range.collapse();
                    }
                    break;

                case 'text/plain':
                    for (const range of validRanges) {
                        range.deleteContents();
                        range.insertNode(document.createTextNode(data));
                        range.collapse();
                    }
                    break;
            }
        }
        catch (_) {
            document.execCommand('paste');
            console.error('Fell back to execCommand paste functionality');
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