export default class BlogPost {
    constructor({
        id, permalink, title, content, mastolink,
        created_on, modified_on, is_published, is_visible, is_pinned
    }) {
        this.id = Number(id);
        this.permalink = permalink;
        this.title = title;
        this.content = content;
        this.mastolink = mastolink;
        this.createdOn = new Date(created_on);
        this.modifiedOn = modified_on ? new Date(modified_on) : undefined;
        this.isPublished = Boolean(is_published);
        this.isVisible = Boolean(is_visible);
        this.isPinned = Boolean(is_pinned);
    }
}