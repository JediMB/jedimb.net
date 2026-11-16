export default class ModalPopupComponent extends HTMLElement {
    /** @type {HTMLTemplateElement} */ #template;
    /** @type {HTMLButtonElement[]} */ #focusTargets = [];
    /** @type {HTMLElement} */ #currentModal = null;

    constructor() {
        super();
        this.#keydownCapture = this.#keydownCapture.bind(this);
    }

    connectedCallback() {
        this.#template = this.querySelector('template');
    }

    disconnectedCallback() {}

    close() {
        this.#currentModal.querySelector('dialog')?.close();
        this.#currentModal.remove();
        this.#currentModal = null;
        this.#focusTargets = [];
        document.removeEventListener('keydown', this.#keydownCapture);
        document.documentElement.classList.remove('disable-scrolling');
    }

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
        
        this.#currentModal = clone.firstElementChild;

        const dialog = this.#currentModal.querySelector('dialog');

        const heading = dialog.querySelector('h1');
        const body = dialog.querySelector('modal-body');
        const buttonList = dialog.querySelector('menu');

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

        this.#focusTargets = [ dialog, ...buttonList.querySelectorAll('button') ];

        document.documentElement.classList.add('disable-scrolling');
        document.addEventListener('keydown', this.#keydownCapture);
        this.append(clone);
        dialog.focus();
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
            this.close();
            callbackFn?.call(this);
        });

        return listItem;
    }

    /**
     * @param {KeyboardEvent} event 
     * @param {boolean} event.shiftKey
     */
    #focusTrap({ shiftKey }) {
        if (!this.#focusTargets?.length)
            return;

        if (this.#focusTargets.length === 1) {
            this.#focusTargets[0].focus();
            return;
        }

        const activeIndex = this.#focusTargets.indexOf(document.activeElement);

        if (shiftKey) {
            if (activeIndex < 1) {
                this.#focusTargets.at(-1).focus();
                return;
            }

            this.#focusTargets.at(activeIndex-1).focus();
            return;
        }

        if (activeIndex === this.#focusTargets.length - 1) {
            this.#focusTargets[0].focus();
            return;
        }

        this.#focusTargets[activeIndex + 1].focus();
        return;
    }

    /** @param {KeyboardEvent} event */
    #keydownCapture = (event) => {
        switch (event.key) {
            case 'Tab':
                event.preventDefault();
                this.#focusTrap(event);
                return;

            case 'Escape':
                event.preventDefault();
                this.close();
                return;
        }
    }
}

customElements.define('modal-popup-component', ModalPopupComponent);

/** @type {ModalPopupComponent} */
export const modalPopupComponent = document.querySelector('modal-popup-component');