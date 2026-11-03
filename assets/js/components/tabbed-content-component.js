export default class TabbedContentComponent extends HTMLElement {
    /** @type {HTMLLabelElement} */ #activeTab;

    constructor() { super(); }

    connectedCallback() {
        /** @type {HTMLUListElement} */
        const tablist = this.querySelector('[role="tablist"]');

        tablist.addEventListener('focusin', event => {
            if (tablist.contains(event.relatedTarget))
                return false;

            this.#activeTab.focus();
        });

        this.#activeTab = tablist.querySelector('.active');

        /** @type {HTMLLabelElement[]} */
        const tabLabels = Array.from(tablist.querySelectorAll('[role="tab"]'));
        /** @type {HTMLDivElement[]} */
        const tabPanels = tabLabels.map(lbl => lbl.ariaControlsElements.at(0));

        const firstTab = tabLabels.at(0);
        const lastTab = tabLabels.at(-1);

        for (let i = 0; i < tabLabels.length; i++) {
            const label = tabLabels[i];

            /** @type {HTMLInputElement} */
            const input = label.querySelector(`#${label.htmlFor}`);
            const panel = label.ariaControlsElements.at(0);
            
            label.addEventListener('keydown', event => {
                switch (event.key) {
                    case 'Home':
                        firstTab.focus();
                        firstTab.click();
                        break;

                    case 'ArrowLeft':
                        this.#changeTab(tabLabels, i, -1);
                        break;

                    case 'ArrowRight':
                        this.#changeTab(tabLabels, i, 1);
                        break;

                    case 'End':
                        lastTab.focus();
                        lastTab.click();
                        break;

                    case 'Return':
                    case 'Enter':
                    case ' ':
                        input.click();
                        break;

                    default:
                        return false;
                }

                event.preventDefault();
                event.stopPropagation();
            });

            input.addEventListener('change', event => {
                event.stopPropagation();
                this.#activeTab = label;

                tabLabels.forEach(lbl => {
                    const active = (lbl === label);
                    lbl.ariaSelected = active;
                    lbl.classList.toggle('active', active);
                });
                tabPanels.forEach(pnl => {
                    const active = (pnl === panel);
                    pnl.hidden = !active;
                    pnl.ariaExpanded = active;
                });
            });
        }
    }

    connectedMoveCallback() {}

    disconnectedCallback() {}

    /**
     * @param {HTMLLabelElement[]} list 
     * @param {number} index 
     * @param {-1|1} direction
     */
    #changeTab(list, index, direction) {
        let targetIndex = index + direction;
        const lastIndex = list.length - 1;

        if (targetIndex < 0)
            targetIndex = lastIndex;
        else if (targetIndex > lastIndex)
            targetIndex = 0;

        const tab = list[targetIndex];
        tab.focus();
        tab.click();
    }
}

customElements.define('tabbed-content-component', TabbedContentComponent);
