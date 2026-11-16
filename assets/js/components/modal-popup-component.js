export default class ModalPopupComponent extends HTMLElement {
    /** @type {HTMLTemplateElement} */ #template;
    /** @type {HTMLElement} */ #currentModal = null;

    constructor() { super(); }

    connectedCallback() {
        this.#template = this.querySelector('template');
    }

    disconnectedCallback() {}

    /**
     * 
     * @param {string} prompt 
     * @param {string} closeButtonText
     * @param {string} [title=null] 
     * @param  {...{ text: string, type: 'default'|'primary'|'warn', callbackFn: () => void}} additionalButtons 
     */
    create(prompt, closeButtonText, title = null, ...additionalButtons) {
        if (!this.#template) {
            // TODO: Implement proper notification
            console.error('No modal popup template found');
            return;
        }

        if (!prompt) prompt = 'No prompt provided';
        if (!closeButtonText) closeButtonText = 'Cancel';

        /** @type {DocumentFragment} */
        const clone = this.#template.content.cloneNode(true);
        
        const modal = clone.firstElementChild;
        this.#currentModal = modal;

        const heading = modal.querySelector('h1');
        const body = modal.querySelector('modal-body');
        const buttonList = modal.querySelector('menu');

        if (title)
            heading.textContent = title;
        else
            heading.remove();

        body.textContent = prompt;

        buttonList.append(this.#createButtonItem(closeButtonText, () => {}));

        for (const button of additionalButtons) {
            buttonList.prepend(
                this.#createButtonItem(
                    button.text,
                    button.callbackFn,
                    button.type
                )
            );
        }

        // TODO: Focus trap and the ability to cancel with Esc

        this.append(clone);
        this.#currentModal.focus();
        document.documentElement.classList.add('disable-scrolling');
    }

    /**
     * 
     * @param {string} text 
     * @param {() => void} callbackFn 
     * @param {'default'|'primary'|'warn'} [type='default']
     * @returns {HTMLLIElement}
     */
    #createButtonItem(text, callbackFn, type = 'default') {
        const listItem = document.createElement('li');
        const button = document.createElement('button');
        listItem.append(button);

        button.type = 'button';

        if (typeof callbackFn !== 'function') {
            button.textContent = '[Error]';
            button.classList.add('btn-warn');
            return listItem;
        }

        button.textContent = text;
        
        switch (type) {
            case 'warn':
                button.classList.add('btn-warn');
                break;

            case 'primary':
                button.classList.add('btn-primary');
                break;

            case 'default':
            default:
                button.classList.add('btn-secondary');
                break;
        }

        button.addEventListener('click', () => {
            this.#currentModal.querySelector('dialog')?.close();
            this.#currentModal.remove();
            this.#currentModal = null;
            document.documentElement.classList.remove('disable-scrolling');
            callbackFn?.call(this);
        });

        return listItem;
    }
}

customElements.define('modal-popup-component', ModalPopupComponent);

/** @type {ModalPopupComponent} */
export const modalPopupComponent = document.querySelector('modal-popup-component');