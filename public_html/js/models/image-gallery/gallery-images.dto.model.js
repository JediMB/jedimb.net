export default class GalleryImagesDTO {
    /**
     * @param {{galleryId: number, imageIds: number[]}} param0 
     */
    constructor({galleryId, imageIds}) {
        this.galleryId = galleryId;
        this.imageIds = [...imageIds];
    }
}