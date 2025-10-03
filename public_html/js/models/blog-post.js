export default class BlogPost {
    constructor({
        id, permalink, title, content, mastolink,
        createdOn, modifiedOn, isPublished, isVisible, isPinned
    }) {
        this.id = Number(id);
        this.permalink = permalink;
        this.title = title;
        this.content = content;
        this.mastolink = mastolink;
        this.createdOn = new Date(createdOn.date + createdOn.timezone);
        this.modifiedOn = modifiedOn ? new Date(modifiedOn.date + modifiedOn.timezone) : undefined;
        this.isPublished = Boolean(isPublished);
        this.isVisible = Boolean(isVisible);
        this.isPinned = Boolean(isPinned);
    }
}