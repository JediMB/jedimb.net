export default class BlogPost {
    constructor({
        id, userId, permalink, title, description, contentShort, contentRest,
        mastolink, isHidden, isPinned, isPublished, publishedOn,
        createdOn, modifiedOn
    }) {
        this.id = Number(id);
        this.userId = Number(userId);
        this.permalink = permalink;
        this.title = title;
        this.description = description;
        this.contentShort = contentShort;
        this.contentRest = contentRest;
        this.mastolink = mastolink;
        this.isPinned = Boolean(isPinned);
        this.isHidden = Boolean(isHidden);
        this.isPublished = Boolean(isPublished);
        this.publishedOn = publishedOn ? new Date(publishedOn.date + publishedOn.timezone) : undefined;
        this.createdOn = new Date(createdOn.date + createdOn.timezone);
        this.modifiedOn = modifiedOn ? new Date(modifiedOn.date + modifiedOn.timezone) : undefined;
    }
}