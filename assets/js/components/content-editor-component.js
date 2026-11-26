import ContentContainerElement from "/js/custom-elements/content-editor/content-container-element.js";
import ContentDividerElement from "/js/custom-elements/content-editor/content-divider-element.js";
import ContentToolbarElement from "/js/custom-elements/content-editor/content-toolbar-element.js";
import ContentTextElement from "/js/custom-elements/content-editor/content-text-element.js";
import { modalPopupComponent } from "/js/components/modal-popup-component.js";
import Emitter from "/js/utilities/emitter.js";

export default class ContentEditorComponent extends HTMLElement {
    static CONTAINER_NAME = customElements.getName(ContentContainerElement);
    static DIVIDER_NAME = customElements.getName(ContentDividerElement);
    static TOOLBAR_NAME = customElements.getName(ContentToolbarElement);
    static TEXT_NAME = customElements.getName(ContentTextElement);

    #headingText = new Emitter('');
    /** @type {1|2|3|4|5|6} */ #baseHeadingLevel;
    /** @type {string[]} */ #validElementTypes;

    /** @type {HTMLHeadingElement} */ #heading;
    /** @type {ContentToolbarElement} */ #toolbar;
    /** @type {ContentDividerElement} */ #divider;
    /** @type {HTMLElement} */ #previousTarget;

    constructor() { super(); }

    connectedCallback() {
        this.setAttribute('tabindex', '0');

        const validElementTypes = JSON.parse(this.dataset.validElementTypes.replaceAll("'", '"') ?? '[]');
        this.#validElementTypes = Array.isArray(validElementTypes)
            ? validElementTypes
            : [];
        
        this.#baseHeadingLevel = Math.min(Math.max(Math.floor(Number(this.dataset.headingBaseLevel)), 1), 6);
        this.#heading = document.createElement(`h${this.#baseHeadingLevel}`);
        this.prepend(this.#heading);

        this.#headingText.subscribe({next: text => {
            this.#heading.textContent = text;
        }}, {getCurrent: true});

        this.#toolbar = document.createElement(ContentEditorComponent.TOOLBAR_NAME);
        this.appendChild(this.#toolbar);

        this.#divider = this.querySelector(ContentEditorComponent.DIVIDER_NAME)
            ?? document.createElement(ContentEditorComponent.DIVIDER_NAME);
        this.#divider.setText(this.dataset.dividerText);

        this.addEventListener('mouseover', event => this.#toolbarControl(event));
        this.addEventListener('focusin', event => this.#toolbarControl(event));

        this.addEventListener('content-add', event => {
            event.stopPropagation();
            this.#insertNewContainer('beforebegin', this.#toolbar);
        });

        this.addEventListener('content-direction', /** @param {CustomEvent<('row'|'column')> event} */
            event => {
                event.stopPropagation();
                this.#toolbar.parentElement.setAttribute('content-direction', event.detail);
            }
        );

        this.addEventListener('content-remove', event => {
            event.stopPropagation();

            /** @type {HTMLElement} */
            const container = this.#toolbar.parentElement;

            if (container === this || !this.contains(container)) {
                console.error('Trying to remove something out of bounds');
                return;
            }
            
            modalPopupComponent.create(
                this.dataset.removeContainerPrompt,
                this.dataset.removeContainerNo,
                null,
                {
                    text: this.dataset.removeContainerYes,
                    type: 'warn',
                    callbackFn: () => {
                        container.parentElement.append(this.#toolbar);
                        container.remove();
                    }
                },
                {
                    text: this.dataset.removeContainerKeepContents,
                    type: 'primary',
                    callbackFn: () => {
                        container.parentElement.append(this.#toolbar);
                        container.replaceWith(...container.children);
                    }
                }
            )
        });

        this.addEventListener('content-heading', event => {
            event.stopPropagation();
            /** @type {ContentContainerElement} */
            const container = this.#toolbar.parentElement;

            if (container === this) {
                console.error('Trying to insert a heading into content editor root');
                return;
            }

            container.setHeading();
        });

        this.addEventListener('content-text', event => {
            event.stopPropagation();
            /** @type {ContentTextElement} */
            const contentText = document.createElement(ContentEditorComponent.TEXT_NAME);
            contentText.setValidElementTypes(this.#validElementTypes);
            
            if (this.#toolbar.parentElement === this) {
                this.#insertNewContainer('beforebegin', this.#toolbar, contentText);
                contentText.focusWithin();
                return;
            }

            this.#toolbar.before(contentText);
        });

        this.addEventListener('content-paragraph',
            /** @param {CustomEvent<{ type: 'new'|'previous'|'next', content: DocumentFragment|null }>} event */
            event => {
                /** @type {ContentTextElement} */
                const textElement = event.target;

                switch (event.detail.type) {
                    case 'new':
                        /** @type {ContentTextElement} */
                        const newText = document.createElement(ContentEditorComponent.TEXT_NAME);
                        newText.setValidElementTypes(this.#validElementTypes);
                        textElement.after(newText);
                        newText.focusWithin();
                        newText.appendDocumentFragment(event.detail.content);
                        break;
                }
            }
        );

        this.addEventListener('content-divide', event => {
            event.stopPropagation();

            this.#toolbar.before(this.#divider);
        });
    }

    disconnectedCallback() {}

    setHeading(text = '') {
        if (typeof text === 'string') {
            this.#headingText.setValue(text);
            return;
        }

        console.error('Parameter "text" is not of string type');
    }

    /** 
     * @param {'beforebegin'|'afterend'} where 
     * @param {HTMLElement &
     * { parentElement: ContentEditorComponent|ContentContainerElement}} anchorElement 
     * @param {...Node} contents 
     * @returns {ContentContainerElement}
     * */
    #insertNewContainer(where, anchorElement, ...contents) {
        /** @type {ContentContainerElement} */
        const container = document.createElement(ContentEditorComponent.CONTAINER_NAME);
        container.setup(anchorElement.parentElement.headingLevel ?? this.#baseHeadingLevel)
        container.append(...contents);
        anchorElement.insertAdjacentElement(where, container);
        return container;
    }

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
     * @param {HTMLElement} element 
     * @param {'beforebegin'|'afterend'} where 
     */
    #putToolbarAdjacentTo(element, where) {
        if (element instanceof HTMLHeadingElement && where === 'beforebegin')
            return;

        element?.insertAdjacentElement(where, this.#toolbar);
    }

    /**
     * 
     * @param {ContentEditorComponent|ContentContainerElement} container 
     * @param {'beforebegin'|'afterend'} adjacency 
     */
    #putToolbarFirstOrLast(container, adjacency) {
        if (adjacency === 'afterend') {
            container.append(this.#toolbar);
            return;
        }
        
        if (container.firstElementChild instanceof HTMLHeadingElement)
            return;
        
        container.prepend(this.#toolbar);
    }

    /**
     * @param {FocusEvent} event 
     * @param {HTMLElement} target 
     * @param {ContentContainerElement} container 
     */
    #setToolbarPositionByFocus(event, target, container) {
        // TODO
    }

    /**
     * @param {MouseEvent} event 
     * @param {HTMLElement} target 
     * @param {ContentContainerElement} container 
     */
    #setToolbarPositionByMouse(event, target, container) {
        if (target !== container) {
            this.#putToolbarAdjacentTo(target, this.#getAdjacency(container, target, event));
            return;
        }

        if (container.contains(this.#previousTarget)) {
            if (this.#previousTarget === this) {
                this.#putToolbarFirstOrLast(this, this.#getAdjacency(this, this, event));
                return
            }

            this.#putToolbarAdjacentTo(this.#previousTarget, this.#getAdjacency(container, this.#previousTarget, event));
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
