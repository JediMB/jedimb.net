import BlogPost from "/js/models/blog/blog-post.model.js";
import Emitter from "/js/utilities/emitter.js";
import Pagination from "/js/models/blog/pagination.model.js";
import blogPostService from "/js/services/blog-post.service.js";
import sessionService from "/js/services/session.service.js";
import { UserRole } from "/js/enums/user-role.enum.js";
import { formatDate } from "/js/utilities/format-date.utility.js";

customElements.define('blog-view-component', class BlogViewComponent extends HTMLElement {
    #baseRoute;
    #pagination;
    #startPage;

    #editingPermissions = false;

    #pageChangeDelay = 1000;
    #pageChangeId = 0;

    /** @type {HTMLSpanElement} */ #start;
    /** @type {HTMLSpanElement} */ #end;
    /** @type {HTMLSpanElement} */ #total;

    /** @type {HTMLElement} */ #blogPosts;
    /** @type {HTMLTemplateElement} */ #blogPostTemplate;
    
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
        const page = Number(paginationData[0]);

        this.#pagination = new Emitter(new Pagination({
            page: page,
            pageSize: Number(paginationData[1]),
            offset: Number(paginationData[2]),
            itemCount: Number(paginationData[3]),
            pageCount: Number(paginationData[4])
        }));

        this.#startPage = page;
    }

    connectedCallback() {
        sessionService.user.subscribe({
            next: user => {
                // TODO: Proper permission checks
                const editingPermissions = user && (user.role === UserRole.Administrator || user.role === UserRole.Contributor);
                this.#editingPermissions = editingPermissions;

                this.querySelectorAll('article-toolbar').forEach(toolbar => toolbar.toggleAttribute('hidden', !editingPermissions));
            }
        }, { getCurrent: true });

        this.#start = this.querySelector('#blog__items-start');
        this.#end = this.querySelector('#blog__items-end');
        this.#total = this.querySelector('#blog__items-total');

        this.#blogPosts = this.querySelector('blog-posts');
        this.#blogPostTemplate = this.querySelector('[blog-post-template]');

        const pagination = this.querySelector('#blog__pagination');
        this.#lstPagination = pagination;
        this.#lnkFirst = pagination.querySelector('#blog__pagination-first');
        this.#lnkPrev = pagination.querySelector('#blog__pagination-previous');
        this.#lnkNext = pagination.querySelector('#blog__pagination-next');
        this.#lnkLast = pagination.querySelector('#blog__pagination-last');
        this.#lstPages = pagination.querySelector('#blog__pagination-pages');
        this.#lnkActive = pagination.querySelector('.active');

        const actionButtons = this.#blogPosts.querySelectorAll('[post-action]');
        this.#assignButtonActions(actionButtons);

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
            this.#gotoPage(Number(this.#lnkFirst.getAttribute('target-page')));
            return false;
        });

        this.#lnkLast.addEventListener('click', event => {
            event.preventDefault();
            this.#gotoPage(Number(this.#lnkLast.getAttribute('target-page')));
            return false;
        });

        for (const { firstElementChild: link } of this.#lstPages.children) {
            link.addEventListener('click', event => {
                event.preventDefault();
                this.#gotoPage(Number(link.getAttribute('target-page')));
                return false;
            });
        }

        this.#pagination.subscribe({
            next: value => {
                this.#start.textContent = value.offset + 1;
                this.#end.textContent = value.offset + Number(this.#blogPosts.childElementCount);
                this.#total.textContent = value.itemCount;
            }
        });

        blogPostService.subscription.subscribe({
            next: newBlogPost => {
                const paginationData = new Pagination(this.#pagination.getValue());
                paginationData.itemCount++;

                if (paginationData.page !== 1) {
                    paginationData.offset++;
                    this.#pagination.setValue(paginationData);
                    return;
                }
                
                this.#blogPosts.prepend(
                    this.#createBlogPostItem(newBlogPost)
                );

                if (this.#blogPosts.childElementCount > paginationData.pageSize) {
                    this.#blogPosts.lastElementChild.remove();
                    paginationData.pageCount = Math.ceil(paginationData.itemCount / paginationData.pageSize);
                }

                this.#pagination.setValue(paginationData);
            }
        });

        window.addEventListener('popstate', event => {
            const page = event.state ?? this.#startPage;
            
            if (page !== this.#pagination.getValue().page)
                this.#gotoPage(page, true);
        });
    }

    disconnectedCallback() {}

    connectedMoveCallback() {}

    /**
     * @param {HTMLButtonElement[]} buttons 
     * @param {number} [id=null] 
     */
    #assignButtonActions(buttons, id = null) {
        for (const button of buttons) {
            const postId = id ?? Number(button.dataset.id);
            
            if (isNaN(postId)) {
                console.error('Post ID for button is not a number', button);
                continue;
            }

            switch (button.getAttribute('post-action')) {
                case 'delete':
                    // TODO: Use a modal web component instead of confirm()
                    button.addEventListener('click', () => {
                        const message = button.dataset.prompt ?? 'Permanently delete this post?';

                        if (confirm(message)) {
                            button.parentElement.toggleAttribute('hidden', true);
                            blogPostService.deleteBlogPost(postId,
                                next => {
                                    // TODO: Success notification
                                    this.#loadPageContent();
                                },
                                error => {
                                    // TODO: Error notification
                                    button.parentElement.removeAttribute('hidden');
                                }
                            );
                        }
                    });
                    continue;

                case 'hide':
                    button.addEventListener('click', () => {
                        button.parentElement.toggleAttribute('hidden', true);
                        blogPostService.hideBlogPost(postId,
                            () => {
                                // TODO: Success notification
                                this.#loadPageContent();
                            },
                            error => {
                                // TODO: Error notification
                                button.parentElement.removeAttribute('hidden');
                            }
                        );
                    });
                    continue;

                case 'pin':
                    button.addEventListener('click', () => {
                        button.parentElement.toggleAttribute('hidden', true);
                        blogPostService.pinBlogPost(postId,
                            () => {
                                // TODO: Success notification
                                this.#loadPageContent();
                            },
                            error => {
                                // TODO: Error notification
                                button.parentElement.removeAttribute('hidden');
                            }
                        );
                    });
                    continue;

                case 'unpin':
                    button.addEventListener('click', () => {
                        button.parentElement.toggleAttribute('hidden', true);
                        blogPostService.unpinBlogPost(postId,
                            () => {
                                // TODO: Success notification
                                this.#loadPageContent();
                            },
                            error => {
                                // TODO: Error notification
                                button.parentElement.removeAttribute('hidden');
                            }
                        );
                    });
                    continue;
            }
        }
    }

    /**
     * @param {BlogPost} newBlogPost 
     * @returns {DocumentFragment} */
    #createBlogPostItem(newBlogPost) {
        const clone = this.#blogPostTemplate.content.cloneNode(true);
        
        const id = newBlogPost.id;

        /** @type {HTMLElement} */
        const article = clone.querySelector('article');
        article.dataset.id = id;
        article.classList.toggle('article-pinned', newBlogPost.isPinned);

        /** @type {HTMLAnchorElement} */
        const headingLink = clone.querySelector('.title');
        headingLink.textContent = newBlogPost.title;
        headingLink.href += newBlogPost.permalink;

        const createdOn = clone.querySelector('.created-on');
        let dateString = formatDate(newBlogPost.createdOn)
        createdOn.textContent = dateString;
        createdOn.setAttribute('date-string', dateString);
        createdOn.title = dateString;

        /** @type {HTMLElement} */
        const modifiedOn = clone.querySelector('.modified-on');
        if (newBlogPost.modifiedOn) {
            dateString = formatDate(newBlogPost.modifiedOn);
            modifiedOn.textContent = dateString;
            modifiedOn.setAttribute('date-string', dateString);
            modifiedOn.title = dateString;
        }
        else
            modifiedOn.parentElement.remove();

        const toolbar = clone.querySelector('article-toolbar');
        toolbar.toggleAttribute('hidden', !this.#editingPermissions);

        /** @type {HTMLAnchorElement} */
        const editLink = toolbar.querySelector('[post-edit]');
        editLink.href += id;

        const actionButtons = toolbar.querySelectorAll('[post-action]');
        this.#assignButtonActions(actionButtons, id);

        clone.querySelector('.content').innerHTML = newBlogPost.contentShort;

        return clone;
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
            ? this.#lnkActive.parentElement.nextElementSibling
            : this.#lnkActive.parentElement.previousElementSibling;
        
        if (!neighbor)
            return false;

        const newActive = neighbor.firstElementChild;
        const targetPage = Number(newActive.getAttribute('target-page'));
        const pageCount = this.#pagination.getValue().pageCount;

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
            this.#blogPosts.innerHTML = `<svg is-loading width="2em" height="2em">
                <use xlink:href="#svg-loading" href="#svg-loading"></use>
            </svg>`;

            this.#loadPageContent(targetPage);
        }, this.#pageChangeDelay);
    }

    /**
     * @param {number} targetPage 
     * @param {boolean} isHistory 
     */
    async #gotoPage(targetPage, isHistory = false) {
        clearTimeout(this.#pageChangeId);
        this.#blogPosts.innerHTML = `<svg is-loading width="2em" height="2em">
            <use xlink:href="#svg-loading" href="#svg-loading"></use>
        </svg>`;

        this.#lstPagination.toggleAttribute('disabled', true);

        const currentPage = Number(this.#lnkActive.getAttribute('target-page'));

        await this.#scrollPagination(targetPage, currentPage);

        const pageCount = this.#pagination.getValue().pageCount;

        this.#lnkFirst.toggleAttribute('disabled', targetPage < 3);
        this.#lnkPrev.toggleAttribute('disabled', targetPage === 1);
        this.#lnkNext.toggleAttribute('disabled', targetPage === pageCount);
        this.#lnkLast.toggleAttribute('disabled', targetPage > pageCount - 2);

        this.#loadPageContent(targetPage, isHistory,
            () => this.#lstPagination.removeAttribute('disabled')
        );
    }

    /**
     * @param {number} page 
     * @param {boolean} isHistory
     * @param {() =>  void} next 
     */
    #loadPageContent(page = this.#pagination.getValue().page, isHistory = false, next = undefined) {
        blogPostService.getBlogPosts(page, this.#pagination.getValue().pageSize,
            (blogPosts, pagination) => {
                if (!isHistory)
                    history.pushState(pagination.page, null, `${this.#baseRoute}/${page}`);

                this.#blogPosts.innerText = '';

                for (const post of blogPosts) {
                    this.#blogPosts.append(
                        this.#createBlogPostItem(post)
                    );
                }

                this.#pagination.setValue(pagination);

                next?.call(this);
            }
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

        const pageList = this.#lstPages;

        const scrollForward = targetPage > startPage;
        const pageCount = this.#pagination.getValue().pageCount;
        let currentPage = startPage;
        
        while (
            ( scrollForward && currentPage < targetPage )
            ||
            ( !scrollForward && currentPage > targetPage )
        ) {
            if (currentPage !== startPage)
                await delay(ms);

            this.#lnkActive.classList.remove('active');

            if (scrollForward) {
                this.#lnkActive = this.#lnkActive.parentElement.nextElementSibling.firstElementChild;
                currentPage++;
            }
            else {
                this.#lnkActive = this.#lnkActive.parentElement.previousElementSibling.firstElementChild;
                currentPage--;
            }

            this.#lnkActive.classList.add('active');

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
});