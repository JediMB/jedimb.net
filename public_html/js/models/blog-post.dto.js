export default class BlogPostDTO {
    /**
     * @param {{ id: ?number, permalink: string, title: string, description: string, contentShort: string, contentRest: ?string, mastolink: ?string, isPinned: boolean, scheduledOn: ?Date }} param0 
     */
    constructor({id, permalink, title, description, contentShort, contentRest,
        mastolink, isPinned, scheduledOn}) {
        this.id = id ?? 0;
        this.permalink = permalink;
        this.title = title;
        this.description = description;
        this.contentShort = contentShort;
        this.contentRest = contentRest ? contentRest : null;
        this.mastolink = mastolink ? mastolink : null;
        this.isPinned = isPinned;
        this.scheduledOn = scheduledOn ?? null;
    }
}