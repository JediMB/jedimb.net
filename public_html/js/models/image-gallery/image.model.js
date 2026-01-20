export default class Image {
    constructor({id, filename, title, description, createdOn, modifiedOn, galleryIds}) {
        this.id = Number(id);
        this.filename = filename;
        this.title = title;
        this.description = description;
        this.createdOn = new Date(createdOn.date + createdOn.timezone);
        this.modifiedOn = modifiedOn ? new Date(modifiedOn.date + modifiedOn.timezone) : undefined;
        /** @type number[] */
        this.galleryIds = galleryIds.map(gId => Number(gId));
    }
}