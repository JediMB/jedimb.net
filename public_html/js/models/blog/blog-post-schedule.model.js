export default class BlogPostSchedule {
    /**
     * @param {object} param0 
     * @param {int} param0.id 
     * @param {int} param0.blogPostId
     * @param {{date: string, timezone: string}} param0.publishOn*/
    constructor({id, blogPostId, publishOn}) {
        this.id = Number(id);
        this.blogPostId = Number(blogPostId);
        this.publishOn = new Date(publishOn.date + publishOn.timezone);
    }
}