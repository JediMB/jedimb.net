import ContentContainerElement from "/js/custom-elements/content-editor/content-container-element.js";
import ContentToolbarElement from "/js/custom-elements/content-editor/content-toolbar-element.js";
import ContentTextElement from "/js/custom-elements/content-editor/content-text-element.js";

export default class ContentEditorComponent extends HTMLElement {
    static CONTAINER_NAME = customElements.getName(ContentContainerElement);
    static TOOLBAR_NAME = customElements.getName(ContentToolbarElement);
    static TEXT_NAME = customElements.getName(ContentTextElement);

    /** @type {ContentToolbarElement} */ #toolbar;
    /** @type {HTMLElement} */ #previousTarget;

    constructor() { super(); }

    connectedCallback() {
        this.setAttribute('tabindex', '0');

        this.#toolbar = document.createElement(ContentEditorComponent.TOOLBAR_NAME);
        this.appendChild(this.#toolbar);

        this.addEventListener('mouseover', event => this.#toolbarControl(event));
        this.addEventListener('focusin', event => this.#toolbarControl(event));

        this.addEventListener('content-add', event => {
            event.stopPropagation();
            const contentDiv = document.createElement(ContentEditorComponent.CONTAINER_NAME);
            
            /** @type {HTMLElement} */
            const toolbar = event.target;
            toolbar.insertAdjacentElement('beforebegin', contentDiv);
        });

        this.addEventListener('content-direction', event => {
            event.stopPropagation();

            event.target.parentElement.setAttribute('content-direction', event.detail);
        });

        this.addEventListener('content-remove', event => {
            event.stopPropagation();

            /** @type {HTMLElement} */
            const container = event.target.parentElement;

            if (container === this || !this.contains(container)) {
                console.error('Trying to remove something out of bounds');
                return;
            }
            
            // TODO: Confirmation dialogue
            this.append(this.#toolbar);
            container.remove();
        });

        this.addEventListener('content-text', event => {
            event.stopPropagation();
            const contentText = document.createElement(ContentEditorComponent.TEXT_NAME);
            contentText.textContent = 'This is a text element';

            /** @type {HTMLElement} */
            const toolbar = event.target;
            toolbar.insertAdjacentElement('beforebegin', contentText);
        });
    }

    disconnectedCallback() {}

    /** 
     * @param {HTMLElement} element  
     * @returns {(ContentEditorComponent|ContentContainerElement)?}
     */
    #findContainer(element) {
        while (element) {
            if (element === this || element.localName === ContentEditorComponent.CONTAINER_NAME)
                return element;

            element = element.parentElement;
        }

        return null;
    }

    /**
     * @param {ContentContainerElement} directionSource 
     * @param {HTMLElement} anchorElement 
     * @param {MouseEvent} mouseEvent 
     * @param {number} mouseEvent.clientX 
     * @param {number} mouseEvent.clientY 
     * @returns {'beforebegin'|'afterend'}
     */
    #getAdjacency(directionSource, anchorElement, { clientX, clientY }) {
        const rect = anchorElement.getBoundingClientRect();

        switch (getComputedStyle(directionSource).flexDirection) {
            case 'row':
                return (rect.left + (0.5 * rect.width)) < clientX
                    ? 'afterend' : 'beforebegin';
            case 'row-reverse':
                return (rect.left + (0.5 * rect.width)) > clientX
                    ? 'afterend' : 'beforebegin';
            case 'column':
                return (rect.top + (0.5 * rect.height)) < clientY
                    ? 'afterend' : 'beforebegin';
            case 'column-reverse':
                return (rect.top + (0.5 * rect.height)) > clientY
                    ? 'afterend' : 'beforebegin';
        }

        console.error('Unexpected flexDirection value');
        return 'afterend';
    }

    /**
     * 
     * @param {ContentEditorComponent|ContentContainerElement} container 
     * @param {'beforebegin'|'afterend'} adjacency 
     */
    #putToolbarFirstOrLast(container, adjacency) {
        if (adjacency === 'beforebegin')
            container.prepend(this.#toolbar);
        else
            container.append(this.#toolbar);
    }

    /**
     * @param {FocusEvent} event 
     * @param {HTMLElement} target 
     * @param {ContentContainerElement} container 
     */
    #setToolbarPositionByFocus(event, target, container) {

    }

    /**
     * @param {MouseEvent} event 
     * @param {HTMLElement} target 
     * @param {ContentContainerElement} container 
     */
    #setToolbarPositionByMouse(event, target, container) {
        if (target !== container) {
            target.insertAdjacentElement(this.#getAdjacency(container, target, event), this.#toolbar);
            return;
        }

        if (container.contains(this.#previousTarget)) {
            if (this.#previousTarget === this) {
                this.#putToolbarFirstOrLast(this, this.#getAdjacency(this, this, event));
                return
            }
            
            this.#previousTarget?.insertAdjacentElement(this.#getAdjacency(container, this.#previousTarget, event), this.#toolbar);
            return;
        }

        this.#putToolbarFirstOrLast(container, this.#getAdjacency(container, container, event));
    }

    /** @param {MouseEvent|FocusEvent} event */
    #toolbarControl(event) {
        /** @type {HTMLElement} */
        let target = event.target;
        const localName = target.localName;

        if (localName === ContentEditorComponent.TOOLBAR_NAME)
            return;

        const date = new Date();
        this.nextElementSibling.textContent = `${date.getSeconds()}.${date.getMilliseconds()} : ${localName}`;

        const container = this.#findContainer(target);

        if (!container) {
            console.error('No container found');
            return;
        }

        if (target !== container) {
            target = Array.from(container.children).find(child => child.contains(target));
        }

        if (event.type.includes('mouse'))
            this.#setToolbarPositionByMouse(event, target, container);
        else
            this.#setToolbarPositionByFocus(event, target, container);

        this.#previousTarget = target;
    }
}

customElements.define('content-editor-component', ContentEditorComponent);
