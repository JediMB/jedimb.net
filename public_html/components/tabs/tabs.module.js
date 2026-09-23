export default class TabsComponent extends HTMLElement {
    /** @type {HTMLElement} */ #container;
    constructor() { super(); }

    connectedCallback() {
        const containerId = this.getAttribute('container-target');
        this.#container = document.querySelector(containerId);

        /** @type {NodeListOf<HTMLButtonElement>} */
        const buttons = this.querySelectorAll('[tab-target]');

        for (const button of buttons) {
            const target = this.#container.querySelector(button.getAttribute('tab-target'));

            button.addEventListener('click', () => {
                buttons.forEach(btn => btn.disabled = btn === button);

                const children = this.#container.children;
                for (const child of children) {
                    child.toggleAttribute('hidden', child !== target);
                }
            });
        }
    }

    connectedMoveCallback() {}

    disconnectedCallback() {}
}

customElements.define('tabs-component', TabsComponent);
