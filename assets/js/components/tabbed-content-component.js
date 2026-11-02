export default class TabbedContentComponent extends HTMLElement {
    constructor() { super(); }

    connectedCallback() {
        const tablist = this.querySelector('[role="tablist"]');
        /** @type {HTMLLabelElement[]} */
        const tabLabels = Array.from(tablist.querySelectorAll('[role="tab"]'));
        const tabPanels = tabLabels.map(lbl => lbl.ariaControlsElements.at(0));

        for (const label of tabLabels) {
            /** @type {HTMLInputElement} */
            const input = label.querySelector(`#${label.htmlFor}`);
            const panel = label.ariaControlsElements.at(0);
            
            label.addEventListener('keypress', event => {
                if (event.key !== 'Enter' && event.key !== ' ')
                    return false;

                event.preventDefault();

                input.click();
            });

            input.addEventListener('change', event => {
                tabLabels.forEach(lbl => lbl.ariaSelected = lbl === label);
                tabPanels.forEach(pnl => {
                    // TODO: Update hidden and aria-expanded attributes
                });
            });
        }
    }

    connectedMoveCallback() {}

    disconnectedCallback() {}
}

customElements.define('tabbed-content-component', TabbedContentComponent);
