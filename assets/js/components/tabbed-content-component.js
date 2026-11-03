export default class TabbedContentComponent extends HTMLElement {
    constructor() { super(); }

    connectedCallback() {
        const tablist = this.querySelector('[role="tablist"]');
        /** @type {HTMLLabelElement[]} */
        const tabLabels = Array.from(tablist.querySelectorAll('[role="tab"]'));
        /** @type {HTMLDivElement[]} */
        const tabPanels = tabLabels.map(lbl => lbl.ariaControlsElements.at(0));

        for (const label of tabLabels) {
            /** @type {HTMLInputElement} */
            const input = label.querySelector(`#${label.htmlFor}`);
            const panel = label.ariaControlsElements.at(0);
            
            label.addEventListener('keypress', event => {
                if (!['Return','Enter', ' '].includes(event.key))
                    return false;

                event.preventDefault();
                event.stopPropagation();

                input.click();
            });

            input.addEventListener('change', event => {
                event.stopPropagation();

                tabLabels.forEach(lbl => lbl.ariaSelected = (lbl === label));
                tabPanels.forEach(pnl => {
                    pnl.hidden = (pnl !== panel );
                    pnl.ariaExpanded = !pnl.hidden;
                });
            });
        }
    }

    connectedMoveCallback() {}

    disconnectedCallback() {}
}

customElements.define('tabbed-content-component', TabbedContentComponent);
