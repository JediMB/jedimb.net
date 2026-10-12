import Pagination from "/js/models/pagination.model.js";

export default class PageSelectorComponent extends HTMLElement {
    static PAGE_CHANGE_DELAY = 1000;

    #baseRoute;
    #data;
    #startPage;
    #pageChangeId = 0;

    /** @type {PageLists} */ #lists = {};
    /** @type {PageLinks} */ #links = {};

    /** @type {(data: Pagination) => void} */ #onDataUpdate;
    /** @type {onPageChange} */ #onPageChange;

    constructor() {
        super();

        this.#baseRoute = this.getAttribute('base-route');

        const data = this.dataset.csv.split(',');
        this.#startPage = Number(data[0]);

        this.#data = new Pagination({
            page: this.#startPage,
            pageSize: Number(data[1]),
            offset: Number(data[2]),
            itemCount: Number(data[3]),
            pageCount: Number(data[4])

        });
    }

    connectedCallback() {
        const navList = this.querySelector('[page-nav]');
        const pageList = navList.querySelector('[page-list]');

        this.#lists.nav = navList;
        this.#lists.pages = pageList;

        this.#links.first = navList.querySelector('[page-first]');
        this.#links.prev = navList.querySelector('[page-prev]');
        this.#links.next = navList.querySelector('[page-next]');
        this.#links.last = navList.querySelector('[page-last]');
        this.#links.active = pageList.querySelector('.active');

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
     * @param {boolean} doUpdateHistory 
     */
    setData(value, doUpdateHistory = true) {
        const page = value.page;

        if (doUpdateHistory)
            history.pushState(page, null, `${this.#baseRoute}/${page}`);

        const isNewPage = page !== this.#data.page;
        const hasNewPageCount = value.pageCount !== this.#data.pageCount;
        this.#data = new Pagination(value);

        if (isNewPage || hasNewPageCount)
            this.#refreshPageList();

        this.#onDataUpdate?.call(this, this.getData());
    }

    /** Lets the page using the page selector component update itself in response to a pagination data update
     * @param {(data: Pagination) => void} callbackFn 
    */
    set onDataUpdate(callbackFn) {
        if (typeof callbackFn !== 'function')
            throw new Error('onDataUpdate argument is not a function');
        
        this.#onDataUpdate = callbackFn;
    }

    /** @param {onPageChange} callbackFn  */
    set onPageChange(callbackFn) {
        if (typeof callbackFn !== 'function')
            throw new Error('onPageChange argument is not a function');

        this.#onPageChange = callbackFn;
    }

    /**
     * @param {number} page 
     * @returns {HTMLLIElement}
     */
    #createPageListItem(page) {
        const a = document.createElement('a');

        a.href = `${this.#baseRoute}/${page}`;
        a.setAttribute('onclick', 'return false;');
        a.title = `Page ${page}`;
        a.setAttribute('target-page', `${page}`);
        a.classList.add('page-selector__link');
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

    /**
     * @param {HTMLLIElement} listItem 
     * @returns {number}
     */
    #getPageNumber(listItem) {
        return Number(listItem.firstElementChild.getAttribute('target-page'));
    }

    /** @param {boolean} directionForward  */
    #gotoNeighboringPage(directionForward) {
        clearTimeout(this.#pageChangeId);

        const neighbor = directionForward
            ? this.#links.active.parentElement.nextElementSibling
            : this.#links.active.parentElement.previousElementSibling;

        if (!neighbor)
            return false;

        const newActive = neighbor.firstElementChild;
        const targetPage = Number(newActive.getAttribute('target-page'));
        const pageCount = this.#data.pageCount;

        this.#toggleLinksDisabledStatus(targetPage, pageCount);

        this.#links.active.classList.remove('active');
        newActive.classList.add('active');
        const isCentered = pageCount >= 5 && this.#lists.pages.children.item(2).firstElementChild === this.#links.active;
        this.#links.active = newActive;

        if (directionForward) {
            const highestValue = this.#getPageNumber(this.#lists.pages.lastElementChild);

            if (highestValue < pageCount && isCentered) {
                this.#lists.pages.append(
                    this.#createPageListItem(highestValue + 1)
                );
                this.#lists.pages.firstElementChild();
            }
        }
        else {
            const lowestValue = this.#getPageNumber(this.#lists.pages.firstElementChild);

            if (lowestValue > 1 && isCentered) {
                this.#lists.pages.prepend(
                    this.#createPageListItem(lowestValue - 1)
                );
                this.#lists.pages.lastElementChild.remove();
            }
        }

        this.#pageChangeId = setTimeout(
            () => this.#onPageChange?.call(this, targetPage),
            PageSelectorComponent.PAGE_CHANGE_DELAY
        );
    }

    /**
     * @param {number} targetPage 
     * @param {boolean} doUpdateHistory 
     */
    async #gotoPage(targetPage, doUpdateHistory = true) {
        clearTimeout(this.#pageChangeId);
        this.#lists.nav.toggleAttribute('disabled', true);
        
        await this.#scrollPageList(targetPage);

        this.#toggleLinksDisabledStatus(targetPage, this.#data.pageCount);

        this.#onPageChange?.call(this, targetPage, doUpdateHistory,
            () => this.#lists.nav.removeAttribute('disabled')
        );
    }

    async #refreshPageList() {
        const currentPage = this.#data.page;
        const pageCount = this.#data.pageCount;
        const pageSet = new Set([ currentPage ]);

        for (let pageSteps = 1; pageSteps < 5; pageSteps++) {
            let oldSize = pageSet.size;

            let previousPage = Math.max(currentPage - pageSteps, 1);
            pageSet.add(previousPage);

            let nextPage = Math.min(currentPage + pageSteps, pageCount);
            pageSet.add(nextPage);

            const newSize = pageSet.size;
            if (newSize === oldSize || newSize >= 5)
                break;
        }

        const pages = Array.from(pageSet);
        pages.sort();

        const pageListItems = [];
        for (const page of pages) {
            const newItem = this.#createPageListItem(page);
            pageListItems.push(newItem);

            if (page === currentPage) {
                this.#links.active = newItem.firstElementChild;
                this.#links.active.classList.add('active');
            }
        }

        this.#lists.pages.replaceChildren(...pageListItems);
    }

    /**
     * @param {number} targetPage 
     * @param {number} startPage 
     * @returns {Promise<void>}
     */
    async #scrollPageList(targetPage) {
        const startPage = Number(this.#links.active.getAttribute('target-page'));

        if (targetPage === startPage)
            return;

        const delayFor = (ms) => new Promise(res => setTimeout(res, ms));
        const time = Math.ceil(1000 / Math.abs(targetPage - startPage));

        const scrollForward = targetPage > startPage;
        const pageList = this.#lists.pages;
        const pageCount = this.#data.pageCount;

        let currentPage = startPage;

        while (
            (scrollForward && currentPage < targetPage)
            ||
            (!scrollForward && currentPage > targetPage)
        ) {
            if (currentPage !== startPage)
                await delayFor(time);

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

            const middlePageNumber = this.#getPageNumber(pageList.children.item(2));

            if (middlePageNumber === currentPage || scrollForward === currentPage < middlePageNumber)
                continue;

            const edgeNumber = this.#getPageNumber(
                scrollForward ? pageList.lastElementChild : pageList.firstElementChild
            );

            if (edgeNumber === (scrollForward ? pageCount : 1))
                continue;

            if (scrollForward) {
                pageList.append(this.#createPageListItem(edgeNumber + 1));
                pageList.firstElementChild.remove();
            }
            else {
                pageList.prepend(this.#createPageListItem(edgeNumber - 1));
                pageList.lastElementChild.remove();
            }
        }
    }

    /**
     *  @param {number} targetPage 
     *  @param {number} pageCount 
     */
    #toggleLinksDisabledStatus(targetPage, pageCount) {
        this.#links.first.toggleAttribute('disabled', targetPage < 3);
        this.#links.prev.toggleAttribute('disabled', targetPage === 1);
        this.#links.next.toggleAttribute('disabled', targetPage === pageCount);
        this.#links.last.toggleAttribute('disabled', targetPage > pageCount - 2);
    }
}

customElements.define('page-selector-component', PageSelectorComponent);

/**
 * @typedef PageLists
 * @type {object}
 * @property {HTMLUListElement} nav
 * @property {HTMLUListElement} pages
 */

/**
 * @typedef PageLinks
 * @type {object}
 * @property {HTMLAnchorElement} active
 * @property {HTMLAnchorElement} first
 * @property {HTMLAnchorElement} prev
 * @property {HTMLAnchorElement} next
 * @property {HTMLAnchorElement} last
 */

/**
 * @callback onPageChange
 * @param {number} page
 * @param {boolean} doUpdateHistory
 * @param {() => void} next
 * @returns {void}
 */