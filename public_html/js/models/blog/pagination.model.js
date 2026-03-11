export class Pagination {
    constructor({page, pageSize, offset, itemCount, pageCount}) {
        this.page = Number(page);
        this.pageSize = Number(pageSize);
        this.offset = Number(offset);
        this.itemCount = Number(itemCount);
        this.pageCount = Number(pageCount);
    }
}