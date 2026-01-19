export default class GalleryImagesDTO {
    /**
     * @param {number} galleryId 
     * @param {number[]} imageIds 
     */
    constructor(galleryId, imageIds) {
        this.galleryId = galleryId;
        this.imageIds = [...imageIds];
    }
}