export default class BlogPostDTO {
    constructor(id, permalink, title, description, contentShort, contentRest,
        mastolink, isPinned, scheduledOn) {
        this.id = 0;
        this.permalink = '';
        this.title = '';
        this.description = '';
        this.contentShort = '';
        this.contentRest = '';
        this.mastolink = '';
        this.isPinned = false;
        /** @type {Date} */ this.scheduledOn = null;
    }
}