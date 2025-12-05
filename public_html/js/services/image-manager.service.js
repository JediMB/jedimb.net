import Gallery from "/js/models/image-gallery/gallery.model.js";
import Image from "/js/models/image-gallery/image.model.js";
import ImageDTO from "/js/models/image-gallery/image.dto.model.js";
import imageManagerApiService from "/js/services/api/image-manager-api.service.js";
import tableModifiedApiService from "/js/services/api/table-modified-api.service.js";

export { imageManagerService as default };

class ImageManagerService {
    #imageModified = new Date(0);
    #galleryModified = new Date(0);
    /** @type {Image[]} */
    #images = [];
    /** @type {Gallery[]} */
    #galleries = [];

    constructor() {
        this.fetchImageData();
    }

    async fetchImageData() {
        const imageModified = await tableModifiedApiService.getImageDate();

        if (imageModified > this.#imageModified) {
            this.#imageModified = imageModified;
            const images = await imageManagerApiService.getImages();

            if (images)
                this.#images = images;
        }

        const galleryModified = await tableModifiedApiService.getGalleryDate();

        if (galleryModified > this.#galleryModified) {
            this.#galleryModified = galleryModified;
            const galleries = await imageManagerApiService.getImageGalleries();

            if (galleries)
                this.#galleries = galleries;
        }

        if (this.#images.length === 0 || this.#galleries.length === 0)
            return;

        this.#images.forEach(image => 
            image.galleryList = image.galleryIds.map(galleryId =>
                this.#galleries.find(gallery => galleryId === gallery.id))
        );

        this.#galleries.forEach(gallery => 
            gallery.imageList = gallery.imageIds.map(imageId =>
                this.#images.find(image => imageId === image.id))
        );
    }

    /**
     * @param {ImageDTO} imageDTO 
     */
    async save(imageDTO) {

    }
}
const imageManagerService = new ImageManagerService();