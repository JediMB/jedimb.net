export default class BlogPost {
    /**
     * @param {object} blogPost 
     * @param {number} blogPost.id 
     * @param {number} blogPost.userId 
     * @param {string} blogPost.permalink 
     * @param {string} blogPost.title 
     * @param {string} blogPost.description 
     * @param {string} blogPost.contentShort 
     * @param {string} blogPost.contentRest 
     * @param {string} blogPost.mastolink 
     * @param {boolean} blogPost.isHidden 
     * @param {boolean} blogPost.isPinned 
     * @param {{date: string, timezone: string}} blogPost.publishedOn
     * @param {{date: string, timezone: string}} blogPost.createdOn
     * @param {{date: string, timezone: string}} blogPost.modifiedOn
     */
    constructor({
        id, userId, permalink, title, description, contentShort, contentRest,
        mastolink, isHidden, isPinned, publishedOn,
        createdOn, modifiedOn
    }) {
        this.id = Number(id);
        this.userId = userId ? Number(userId) : null;
        this.permalink = permalink;
        this.title = title;
        this.description = description;
        this.contentShort = contentShort;
        this.contentRest = contentRest;
        this.mastolink = mastolink;
        this.isPinned = Boolean(isPinned);
        this.isHidden = Boolean(isHidden);
        this.publishedOn = publishedOn ? new Date(publishedOn.date + publishedOn.timezone) : undefined;
        this.createdOn = new Date(createdOn.date + createdOn.timezone);
        this.modifiedOn = modifiedOn ? new Date(modifiedOn.date + modifiedOn.timezone) : undefined;
    }
}