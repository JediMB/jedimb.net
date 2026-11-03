export default class TabbedContentComponent extends HTMLElement {
    /** @type {HTMLButtonElement} */ #activeTab;

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

        /** @type {HTMLButtonElement[]} */
        const tabButtons = Array.from(tablist.querySelectorAll('[role="tab"]'));
        /** @type {HTMLDivElement[]} */
        const tabPanels = tabButtons.map(btn => btn.ariaControlsElements.at(0));

        const firstTab = tabButtons.at(0);
        const lastTab = tabButtons.at(-1);

        for (let i = 0; i < tabButtons.length; i++) {
            const button = tabButtons[i];
            const panel = button.ariaControlsElements.at(0);
            
            button.addEventListener('keydown', event => {
                switch (event.key) {
                    case 'Home':
                        firstTab.focus();
                        firstTab.click();
                        break;

                    case 'ArrowLeft':
                        this.#changeTab(tabButtons, i, -1);
                        break;

                    case 'ArrowRight':
                        this.#changeTab(tabButtons, i, 1);
                        break;

                    case 'End':
                        lastTab.focus();
                        lastTab.click();
                        break;

                    default:
                        return;
                }

                event.preventDefault();
                event.stopPropagation();
            });

            button.addEventListener('click', event => {
                event.stopPropagation();
                if (this.#activeTab === button)
                    return;

                this.#activeTab = button;

                tabButtons.forEach(btn => {
                    const active = (btn === button);
                    btn.ariaSelected = active;
                    btn.classList.toggle('active', active);
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
     * @param {HTMLButtonElement[]} list 
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
