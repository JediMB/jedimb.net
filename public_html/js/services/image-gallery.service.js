import Emitter from "/js/utilities/emitter.js";
import Image from "/js/models/image-gallery/image.model.js";
import ImageDTO from "/js/models/image-gallery/image.dto.model.js";
import imageGalleryApiService from "/js/services/api/image-gallery-api.service.js";
import tableModifiedApiService from "/js/services/api/table-modified-api.service.js";

export { imageGalleryService as default };

class ImageGalleryService {
    #galleryModified = new Date(0);
    #imageModified = new Date(0);
    #galleries = new Emitter([]);
    #images = new Emitter([]);

    constructor() {
        this.#fetchImageData();
    }

    /** @returns {Date} */
    get galleryModified() { return new Date(this.#galleryModified); }
    /** @returns {Date} */
    get imageModified() { return new Date(this.#imageModified); }
    /** @returns {Emitter} */
    get galleries() { return this.#galleries; }
    /** @returns {Emitter} */
    get images() { return this.#images; }

    async #fetchImageData() {
        const imageModified = await tableModifiedApiService.getImageDate();
        const galleryModified = await tableModifiedApiService.getGalleryDate();
        let images;
        let galleries;

        if (imageModified > this.#imageModified) {
            this.#imageModified = imageModified;
            images = await imageGalleryApiService.getImages();
        }

        if (galleryModified > this.#galleryModified) {
            this.#galleryModified = galleryModified;
            galleries = await imageGalleryApiService.getImageGalleries();
        }

        if (images.length && galleries.length) {
            images.forEach(image => 
                image.galleryList = image.galleryIds.map(galleryId =>
                    galleries.find(gallery => galleryId === gallery.id))
            );

            galleries.forEach(gallery => 
                gallery.imageList = gallery.imageIds.map(imageId =>
                    images.find(image => imageId === image.id))
            );
        }

        if (images)
            this.#images.setValue(images);

        if (galleries)
            this.#galleries.setValue(galleries);
    }

    /**
     * @param {Object} data 
     * @returns {Promise<boolean>}
     */
    async createImage(data) {
        const result = await imageGalleryApiService.postImage(data);

        if (!result)
            throw new Error('No result received from createImage');

        const [ image, modifiedOn ] = result;

        this.#imageModified = modifiedOn;
        const images = [...this.#images.getValue(), image];
        this.#images.setValue(images);

        return true;
    }

    /**
     * @param {Number} id 
     * @returns {Promise<boolean>}
     */
    async deleteImage(id) {
        const result = await imageGalleryApiService.deleteImage(id);

        if (!result)
            throw new Error('No result received from deleteImage');

        const [ deletedId, modifiedOn ] = result;

        this.#imageModified = modifiedOn;

        if (deletedId !== id)
            throw new Error('Id in deleteImage request and response do not match');

        const images = this.#images.getValue().filter(i => i.id !== deletedId);
        this.#images.setValue(images);

        return true;
    }

    /**
     * @param {Number} id 
     * @returns {Image}
     */
    getImage(id) {
        return this.#images.getValue().find(i => i.id === id);
    }

    /**
     * @param {ImageDTO} imageDTO 
     * @returns {Promise<boolean>}
     */
    async updateImage(imageDTO) {
        const result = await imageGalleryApiService.patchImage(imageDTO);

        if (!result)
            throw new Error('No result received from updateImage');

        const [ image, modifiedOn ] = result;
        
        this.#imageModified = modifiedOn;

        const index = this.#images.getValue().findIndex(i => i.id === image.id);
        this.#images.setValue(image, index);

        return true;
    }
}
const imageGalleryService = new ImageGalleryService();