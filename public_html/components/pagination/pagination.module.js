import Pagination from "/js/models/blog/pagination.model.js";

export default class PaginationComponent extends HTMLElement {
    #baseRoute;
    #data;
    #pageChangeDelay = 1000;
    #pageChangeId = 0;
    #startPage;

    /** @type {{nav: HTMLUListElement, pages: HTMLUListElement}} */ #lists = {};
    /** @type {{active: HTMLAnchorElement, first: HTMLAnchorElement, prev: HTMLAnchorElement, next: HTMLAnchorElement, last: HTMLAnchorElement}} */ #links = {};

    /** @type {(data: Pagination) => void} */ #onDataUpdate;
    /** @type {(page: number, updateHistory: boolean, next: () => void) => void} */ #onPageChange;

    constructor() {
        super();

        this.#baseRoute = this.getAttribute('base-route');
        
        const data = this.dataset.csv.split(',');
        const page = Number(data[0]);

        this.#data = new Pagination({
            page: page,
            pageSize: Number(data[1]),
            offset: Number(data[2]),
            itemCount: Number(data[3]),
            pageCount: Number(data[4])
        });
        
        this.#startPage = page;
    }

    connectedCallback() {
        const cId = Number(this.dataset.id);
        const navList = this.querySelector('ul');
        this.#lists.nav = navList;
        this.#lists.pages = navList.querySelector(`#pagination__pages-${cId}`);

        this.#links.first = navList.querySelector(`#pagination__first-${cId}`);
        this.#links.prev = navList.querySelector(`#pagination__previous-${cId}`);
        this.#links.next = navList.querySelector(`#pagination__next-${cId}`);
        this.#links.last = navList.querySelector(`#pagination__last-${cId}`);
        this.#links.active = navList.querySelector('.active');

        this.#links.first.addEventListener('click', event => {
            event.preventDefault();
            this.#gotoPage(Number(this.#links.first.getAttribute('target-page')));
            return false;
        });

        this.#links.prev.addEventListener('click', event => {
            event.preventDefault();
            this.#gotoNeighboringPage(false);
            return false;
        });

        this.#links.next.addEventListener('click', event => {
            event.preventDefault();
            this.#gotoNeighboringPage(true);
            return false;
        });

        this.#links.last.addEventListener('click', event => {
            event.preventDefault();
            this.#gotoPage(Number(this.#links.last.getAttribute('target-page')));
            return false;
        });

        for (const { firstElementChild: link } of this.#lists.pages.children) {
            link.addEventListener('click', event => {
                event.preventDefault();
                this.#gotoPage(Number(link.getAttribute('target-page')));
                return false;
            });
        }

        window.addEventListener('popstate', event => {
            const page = event.state ?? this.#startPage;

            if (page !== this.#data.page)
                this.#gotoPage(page, false);
        });
    }

    connectedMoveCallback() {}

    disconnectedCallback() {}

    getData() {
        return new Pagination(this.#data);
    }

    /**
     * @param {Pagination} value 
     * @param {boolean} [updateHistory=true]  */
    setData(value, updateHistory = true) {
        if (updateHistory)
            history.pushState(value.page, null, `${this.#baseRoute}/${value.page}`);

        this.#data = new Pagination(value);
        this.#onDataUpdate?.call(this, this.getData());
    }

    /** @param {(data: Pagination) => void} callbackFn  */
    set onDataUpdate(callbackFn) {
        if (typeof callbackFn === 'function')
            this.#onDataUpdate = callbackFn;
    }

    /** @param {(page: number, isHistory: boolean, next: () => void) => void} callbackFn  */
    set onPageChange(callbackFn) {
        if (typeof callbackFn === 'function')
            this.#onPageChange = callbackFn;
    }

    /**
     * @param {number} page 
     * @returns {HTMLLIElement}
     */
    #createPaginationItem(page) {
        const a = document.createElement('a');

        a.href = `${this.#baseRoute}/${page}`;
        a.setAttribute('onclick', 'return false;');
        a.title = `Page ${page}`;
        a.setAttribute('target-page', `${page}`);
        a.textContent = `${page}`;
        a.addEventListener('click', event => {
            event.preventDefault();
            this.#gotoPage(page);
            return false;
        });

        const li = document.createElement('li');
        li.appendChild(a);

        return li;
    }

    /** @param {boolean} gotoNext  */
    #gotoNeighboringPage(gotoNext) {
        clearTimeout(this.#pageChangeId);

        const neighbor = gotoNext
            ? this.#links.active.parentElement.nextElementSibling
            : this.#links.active.parentElement.previousElementSibling;
        
        if (!neighbor)
            return false;

        const newActive = neighbor.firstElementChild;
        const targetPage = Number(newActive.getAttribute('target-page'));
        const pageCount = this.#data.pageCount;

        this.#links.first.toggleAttribute('disabled', targetPage < 3);
        this.#links.prev.toggleAttribute('disabled', targetPage === 1);
        this.#links.next.toggleAttribute('disabled', targetPage === pageCount);
        this.#links.last.toggleAttribute('disabled', targetPage > pageCount - 2);

        this.#links.active.classList.remove('active');
        newActive.classList.add('active');
        const isCentered = pageCount >= 5 && this.#lists.pages.children.item(2).firstElementChild === this.#links.active;
        this.#links.active = newActive;

        if (gotoNext) {
            const highestValue = Number(this.#lists.pages.lastElementChild.firstElementChild.getAttribute('target-page'));

            if (highestValue < pageCount && isCentered) {
                this.#lists.pages.append(
                    this.#createPaginationItem(highestValue + 1)
                );
                this.#lists.pages.firstElementChild.remove();
            }
        }
        else {
            const lowestValue = Number(this.#lists.pages.firstElementChild.firstElementChild.getAttribute('target-page'));

            if (lowestValue > 1 && isCentered) {
                this.#lists.pages.prepend(
                    this.#createPaginationItem(lowestValue - 1)
                );
                this.#lists.pages.lastElementChild.remove();
            }
        }

        this.#pageChangeId = setTimeout(
            () => this.#onPageChange?.call(this, targetPage),
            this.#pageChangeDelay
        );
    }

    /**
     * @param {number} targetPage 
     * @param {boolean} updateHistory 
     */
    async #gotoPage(targetPage, updateHistory = true) {
        clearTimeout(this.#pageChangeId);

        this.#lists.nav.toggleAttribute('disabled', true);

        const currentPage = Number(this.#links.active.getAttribute('target-page'));

        await this.#scrollPagination(targetPage, currentPage);

        const pageCount = this.#data.pageCount;

        this.#links.first.toggleAttribute('disabled', targetPage < 3);
        this.#links.prev.toggleAttribute('disabled', targetPage === 1);
        this.#links.next.toggleAttribute('disabled', targetPage === pageCount);
        this.#links.last.toggleAttribute('disabled', targetPage > pageCount - 2);

        this.#onPageChange?.call(this, targetPage, updateHistory,
            () => this.#lists.nav.removeAttribute('disabled')
        );
    }

    /**
     * @param {number} targetPage 
     * @param {number} startPage 
     * @returns {Promise<void>}
     */
    async #scrollPagination(targetPage, startPage) {
        if (targetPage === startPage)
            return;

        const delay = (ms) => new Promise(res => setTimeout(res, ms));
        const ms = Math.ceil(1000 / Math.abs(targetPage - startPage));

        const pageList = this.#lists.pages;

        const scrollForward = targetPage > startPage;
        const pageCount = this.#data.pageCount;
        let currentPage = startPage;
        
        while (
            ( scrollForward && currentPage < targetPage )
            ||
            ( !scrollForward && currentPage > targetPage )
        ) {
            if (currentPage !== startPage)
                await delay(ms);

            this.#links.active.classList.remove('active');

            if (scrollForward) {
                this.#links.active = this.#links.active.parentElement.nextElementSibling.firstElementChild;
                currentPage++;
            }
            else {
                this.#links.active = this.#links.active.parentElement.previousElementSibling.firstElementChild;
                currentPage--;
            }

            this.#links.active.classList.add('active');

            if (pageCount < 6)
                continue;

            const middlePageNumber = Number(pageList.children.item(2).firstElementChild.getAttribute('target-page'));
            if (scrollForward && currentPage <= middlePageNumber)
                continue;
            if (!scrollForward && currentPage >= middlePageNumber)
                continue;

            const edgeNumber = scrollForward
                ? Number(pageList.lastElementChild.firstElementChild.getAttribute('target-page'))
                : Number(pageList.firstElementChild.firstElementChild.getAttribute('target-page'));

            if (edgeNumber === (scrollForward ? pageCount : 1))
                continue;

            if (scrollForward) {
                const newItem = this.#createPaginationItem(edgeNumber + 1);
                pageList.append(newItem);
                pageList.firstElementChild.remove();
            }
            else {
                const newItem = this.#createPaginationItem(edgeNumber - 1);
                pageList.prepend(newItem);
                pageList.lastElementChild.remove();
            }
        }
    }
}

customElements.define('pagination-component', PaginationComponent);
