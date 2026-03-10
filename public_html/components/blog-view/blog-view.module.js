import blogPostService from "/js/services/blog-post.service.js";
import { formatDate } from "/js/utilities/format-date.utility.js";

customElements.define('blog-view-component', class BlogViewComponent extends HTMLElement {
    #baseRoute;
    #blogLinkPrefix;
    #pagination;

    #pageChangeDelay = 1000;
    #pageChangeId = 0;

    
    /** @type {HTMLAnchorElement} */ #lnkActive;
    /** @type {HTMLAnchorElement} */ #lnkFirst;
    /** @type {HTMLAnchorElement} */ #lnkPrev;
    /** @type {HTMLAnchorElement} */ #lnkNext;
    /** @type {HTMLAnchorElement} */ #lnkLast;

    /** @type {HTMLUListElement} */ #lstPagination;
    /** @type {HTMLUListElement} */ #lstPages;

    constructor() {
        super();
        this.#baseRoute = this.getAttribute('base-route');

        const paginationData = this.dataset.pagination.split(',');
        this.#pagination = {
            page: Number(paginationData[0]),
            pageSize: Number(paginationData[1]),
            offset: Number(paginationData[2]),
            itemCount: Number(paginationData[3]),
            pageCount: Number(paginationData[4])
        };
    }

    connectedCallback() {
        const start = this.querySelector('#blog__items-start');
        const end = this.querySelector('#blog__items-end');
        const total = this.querySelector('#blog__items-total');

        const blogPosts = this.querySelector('blog-posts');
        /** @type {HTMLTemplateElement} */
        const blogPostTemplate = this.querySelector('[blog-post-template]');

        const pagination = this.querySelector('#blog__pagination');
        this.#lstPagination = pagination;
        this.#lnkFirst = pagination.querySelector('#blog__pagination-first');
        this.#lnkPrev = pagination.querySelector('#blog__pagination-previous');
        this.#lnkNext = pagination.querySelector('#blog__pagination-next');
        this.#lnkLast = pagination.querySelector('#blog__pagination-last');
        this.#lstPages = pagination.querySelector('#blog__pagination-pages');
        this.#lnkActive = pagination.querySelector('.active');

        this.#lnkPrev.addEventListener('click', event => {
            event.preventDefault();
            this.#gotoNeighboringPage(false);
            return false;
        });

        this.#lnkNext.addEventListener('click', event => {
            event.preventDefault();
            this.#gotoNeighboringPage(true);
            return false;
        });

        this.#lnkFirst.addEventListener('click', event => {
            event.preventDefault();
            this.#gotoFirstOrLastPage(false);
            return false;
        });

        this.#lnkLast.addEventListener('click', event => {
            event.preventDefault();
            this.#gotoFirstOrLastPage(true);
            return false;
        });

        blogPostService.subscription.subscribe(newBlogPost => {
            this.#pagination.itemCount++;
            total.textContent = this.#pagination.itemCount;

            if (this.#pagination.page !== 1) {
                this.#pagination.offset++;
                start.textContent = this.#pagination.offset + 1;
                end.textContent = this.#pagination.offset + blogPosts.children.length;
                return;
            }
            
            const clone = blogPostTemplate.content.cloneNode(true);

            /** @type {HTMLAnchorElement} */
            const headingLink = clone.querySelector('.title');
            headingLink.textContent = newBlogPost.title;
            headingLink.href += newBlogPost.permalink;

            const createdOn = clone.querySelector('.created-on');
            let dateString = formatDate(newBlogPost.createdOn)
            createdOn.textContent = dateString;
            createdOn.setAttribute('server-time', dateString);
            createdOn.title = dateString;

            /** @type {HTMLElement} */
            const modifiedOn = clone.querySelector('.modified-on');
            if (newBlogPost.modifiedOn) {
                dateString = formatDate(newBlogPost.modifiedOn);
                modifiedOn.textContent = dateString;
                modifiedOn.setAttribute('server-time', dateString);
                modifiedOn.title = dateString;
            }
            else
                modifiedOn.parentElement.remove();

            clone.querySelector('.content').innerHTML = newBlogPost.contentShort;

            blogPosts.prepend(clone);

            const childCount = blogPosts.children.length;
            if (childCount > this.#pagination.pageSize) {
                blogPosts.lastElementChild.remove();
                // TODO: Update pagination if necessary
                return;
            }

            end.textContent = childCount;
        });
    }

    disconnectedCallback() {}

    connectedMoveCallback() {}

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

        const li = document.createElement('li');
        li.appendChild(a);

        return li;
    }

    /** @param {boolean} gotoNext  */
    #gotoNeighboringPage(gotoNext) {
        clearTimeout(this.#pageChangeId);

        const neighbor = gotoNext
            ? this.#lnkActive.parentElement.nextElementSibling
            : this.#lnkActive.parentElement.previousElementSibling;
        
        if (!neighbor)
            return false;

        const newActive = neighbor.firstElementChild;
        const targetPage = Number(newActive.getAttribute('target-page'));
        const pageCount = this.#pagination.pageCount;

        this.#lnkFirst.toggleAttribute('disabled', targetPage < 3);
        this.#lnkPrev.toggleAttribute('disabled', targetPage === 1);
        this.#lnkNext.toggleAttribute('disabled', targetPage === pageCount);
        this.#lnkLast.toggleAttribute('disabled', targetPage > pageCount - 2);

        this.#lnkActive.classList.remove('active');
        newActive.classList.add('active');
        const isCentered = pageCount >= 5 && this.#lstPages.children.item(2).firstElementChild === this.#lnkActive;
        this.#lnkActive = newActive;

        if (gotoNext) {
            const highestValue = Number(this.#lstPages.lastElementChild.firstElementChild.getAttribute('target-page'));

            if (highestValue < pageCount && isCentered) {
                this.#lstPages.append(
                    this.#createPaginationItem(highestValue + 1)
                );
                this.#lstPages.firstElementChild.remove();
            }
        }
        else {
            const lowestValue = Number(this.#lstPages.firstElementChild.firstElementChild.getAttribute('target-page'));

            if (lowestValue > 1 && isCentered) {
                this.#lstPages.prepend(
                    this.#createPaginationItem(lowestValue - 1)
                );
                this.#lstPages.lastElementChild.remove();
            }
        }

        this.#pageChangeId = setTimeout(() => {
            console.log('changing page');
        }, this.#pageChangeDelay);
    }

    /** @param {boolean} gotoLast  */
    async #gotoFirstOrLastPage(gotoLast) {
        clearTimeout(this.#pageChangeId);

        this.#lstPagination.toggleAttribute('disabled', true);

        const pageCount = this.#pagination.pageCount;

        const targetPage = gotoLast
            ? pageCount
            : 1;

        const availableLink = gotoLast
            ? this.#lstPages.lastElementChild.firstElementChild
            : this.#lstPages.firstElementChild.firstElementChild;

        const availablePage = Number(availableLink.getAttribute('target-page'));

        if (availablePage == targetPage) {
            this.#lnkActive.classList.remove('active');
            availableLink.classList.add('active');
            this.#lnkActive = availableLink;

            this.#lstPagination.removeAttribute('disabled');
            return;
        }

        let newPage = availablePage;
        const pageList = this.#lstPages;

        const delay = (ms) => new Promise(res => setTimeout(res, ms));
        const ms = Math.ceil(1000 / pageCount);

        if (gotoLast) {
            while (this.#lnkActive.parentElement.nextElementSibling) {
                this.#lnkActive.classList.remove('active');
                this.#lnkActive = this.#lnkActive.parentElement.nextElementSibling.firstElementChild;
                this.#lnkActive.classList.add('active');
                await delay(ms);
            }

            while (newPage < targetPage) {
                this.#lnkActive.classList.remove('active');
                const newItem = this.#createPaginationItem(++newPage); 
                pageList.append(newItem);
                pageList.firstElementChild.remove();

                this.#lnkActive = newItem.firstElementChild;
                this.#lnkActive.classList.add('active');
                await delay(ms);
            }
        }
        else {
            while (this.#lnkActive.parentElement.previousElementSibling) {
                this.#lnkActive.classList.remove('active');
                this.#lnkActive = this.#lnkActive.parentElement.previousElementSibling.firstElementChild;
                this.#lnkActive.classList.add('active');
                await delay(ms);
            }

            while (newPage > targetPage) {
                this.#lnkActive.classList.remove('active');
                const newItem = this.#createPaginationItem(--newPage);
                pageList.prepend(newItem);
                pageList.lastElementChild.remove();
                
                this.#lnkActive = newItem.firstElementChild;
                this.#lnkActive.classList.add('active');
                await delay(ms);
            }
        }

        this.#lnkFirst.toggleAttribute('disabled', targetPage < 3);
        this.#lnkPrev.toggleAttribute('disabled', targetPage === 1);
        this.#lnkNext.toggleAttribute('disabled', targetPage === pageCount);
        this.#lnkLast.toggleAttribute('disabled', targetPage > pageCount - 2);

        console.log('changing page');

        this.#lstPagination.removeAttribute('disabled');
    }
});
