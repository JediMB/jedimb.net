import DBStatus from "/js/enums/db-status.enum.js";

export default class Image {
    constructor({id, filename, title, description, createdOn, modifiedOn, galleryIds, dbStatus}) {
        this.id = Number(id);
        this.filename = filename;
        this.title = title;
        this.description = description;
        this.createdOn = new Date(createdOn.date + createdOn.timezone);
        this.modifiedOn = modifiedOn ? new Date(modifiedOn.date + modifiedOn.timezone) : undefined;
        this.galleryIds = galleryIds.map(igid => Number(igid));
        this.galleryList = [];
        this.dbStatus = DBStatus.parse(dbStatus);
    }
}