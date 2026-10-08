export default class Gallery {
    /**
     * @param {Object} param0 
     * @param {number} param0.id
     * @param {string} param0.title
     * @param {string} param0.description
     * @param {{date: string, timezone: string}} param0.createdOn
     * @param {?{date: string, timezone: string}} param0.modifiedOn
     * @param {number[]} param0.imageIds
     */
    constructor({id, title, description, createdOn, modifiedOn, imageIds}) {
        this.id = Number(id);
        this.title = title;
        this.description = description;
        this.createdOn = new Date(createdOn.date + createdOn.timezone);
        this.modifiedOn = modifiedOn ? new Date(modifiedOn.date + modifiedOn.timezone) : undefined;
        this.imageIds = imageIds.map(iId => Number(iId));
    }
}