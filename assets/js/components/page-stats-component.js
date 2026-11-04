export default class PageStatsComponent extends HTMLElement {
    /** @type {HTMLElement} */ #itemsStart;
    /** @type {HTMLElement} */ #itemsEnd;
    /** @type {HTMLElement} */ #itemsTotal;

    constructor() { super(); }

    get start() { return Number(this.#itemsStart.textContent); }
    get end() { return Number(this.#itemsEnd.textContent); }
    get total() { return Number(this.#itemsTotal.textContent); }

    /** @param {number} start  */
    set #start(start) { this.#itemsStart.textContent = `${start}`; }
    /** @param {number} end  */
    set #end(end) { this.#itemsEnd.textContent = `${end}`; }
    /** @param {number} total  */
    set #total(total) { this.#itemsTotal.textContent = `${total}`; }

    connectedCallback() {
        this.#itemsStart = this.querySelector('items-start');
        this.#itemsEnd = this.querySelector('items-end');
        this.#itemsTotal = this.querySelector('items-total');
    }

    connectedMoveCallback() {}

    disconnectedCallback() {}

    /**
     * @param {Pagination} paginationData 
     * @param {number} itemCount The number of items on the current page
     */
    updateStats(paginationData, itemCount) {
        this.#start = paginationData.offset + 1;
        this.#end = paginationData.offset + itemCount;
        this.#total = paginationData.itemCount;
    }
}

customElements.define('page-stats-component', PageStatsComponent);
