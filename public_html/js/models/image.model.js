import DBStatus from "../enums/db-status.enum.js";

export default class Image {
    constructor({id, filename, title, description, createdOn, modifiedOn, imageGalleryIds, dbStatus}) {
        this.id = Number(id);
        this.filename = filename;
        this.title = title;
        this.description = description;
        this.createdOn = new Date(createdOn.date + createdOn.timezone);
        this.modifiedOn = modifiedOn ? new Date(modifiedOn.date + modifiedOn.timezone) : undefined;
        this.imageGalleryIds = imageGalleryIds.map(igid => Number(igid));
        this.imageGalleryList = [];
        this.dbStatus = DBStatus.parse(dbStatus);
    }
}