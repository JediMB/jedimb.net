import DBStatus from "/js/enums/db-status.enum.js";

export default class Gallery {
    constructor({id, title, description, createdOn, modifiedOn, imageIds, dbStatus}) {
        this.id = Number(id);
        this.title = title;
        this.description = description;
        this.createdOn = new Date(createdOn.date + createdOn.timezone);
        this.modifiedOn = modifiedOn ? new Date(modifiedOn.date + modifiedOn.timezone) : undefined;
        this.imageIds = imageIds.map(iid => Number(iid));
        this.imageList = [];
        this.dbStatus = DBStatus.parse(dbStatus);
    }
}