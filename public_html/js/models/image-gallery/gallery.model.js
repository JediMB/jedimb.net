export default class Gallery {
    constructor({id, title, description, createdOn, modifiedOn, imageIds}) {
        this.id = Number(id);
        this.title = title;
        this.description = description;
        this.createdOn = new Date(createdOn.date + createdOn.timezone);
        this.modifiedOn = modifiedOn ? new Date(modifiedOn.date + modifiedOn.timezone) : undefined;
        this.imageIds = imageIds.map(iId => Number(iId));
    }
}