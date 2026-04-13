import Emitter from "/js/utilities/emitter.js";
import Gallery from "/js/models/image-gallery/gallery.model.js";
import GalleryDTO from "/js/models/image-gallery/gallery.dto.model.js";
import GalleryImagesDTO from "/js/models/image-gallery/gallery-images.dto.model.js";
import Image from "/js/models/image-gallery/image.model.js";
import ImageDTO from "/js/models/image-gallery/image.dto.model.js";
import imageGalleryApiService from "/js/services/api/image-gallery-api.service.js";
import tableModifiedApiService from "/js/services/api/table-modified-api.service.js";

export { imageGalleryService as default };

class ImageGalleryService {
    #initialized = false;
    #galleryImageModified = new Date(0);
    #galleryModified = new Date(0);
    #imageModified = new Date(0);
    #galleries = new Emitter([]);
    #images = new Emitter([]);

    constructor() {
        this.#fetchImageData().then(() => {
            this.#initialized = true;
        });
    }

    /** @returns {Date} */
    get galleryImageModified() { return new Date(this.#galleryImageModified); }
    /** @returns {Date} */
    get galleryModified() { return new Date(this.#galleryModified); }
    /** @returns {Date} */
    get imageModified() { return new Date(this.#imageModified); }
    /** @returns {Emitter} */
    get galleries() { return this.#galleries; }
    /** @returns {Emitter} */
    get images() { return this.#images; }

    async #fetchImageData() {
        const galleryImageModified = await tableModifiedApiService.getGalleryImageDate();
        const galleryModified = await tableModifiedApiService.getGalleryDate();
        const imageModified = await tableModifiedApiService.getImageDate();

        let images;
        let galleries;

        if (imageModified > this.#imageModified || galleryImageModified > this.#galleryImageModified) {
            this.#imageModified = imageModified;
            images = await imageGalleryApiService.getImages();
        }

        if (galleryModified > this.#galleryModified || galleryImageModified > this.#galleryImageModified) {
            this.#galleryModified = galleryModified;
            galleries = await imageGalleryApiService.getGalleries();
        }

        if (images)
            this.#images.setValue(images);

        if (galleries)
            this.#galleries.setValue(galleries);
    }
    
    /** 
     * @param {GalleryDTO} galleryDTO
     * @returns {Promise<boolean>}
     */
    async createGallery(galleryDTO) {
        const result = await imageGalleryApiService.postGallery(galleryDTO);

        if (!result)
            throw new Error('No result received from createGallery');

        const [ gallery, modifiedOn ] = result;

        this.#galleryModified = modifiedOn;
        const galleries = [...this.#galleries.getValue(), gallery];
        this.#galleries.setValue(galleries);

        return true;
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
    async deleteGallery(id) {
        const result = await imageGalleryApiService.deleteGallery(id);

        if (!result)
            throw new Error('No result received in deleteGallery');

        const [ deletedId, modifiedOn ] = result;

        this.#galleryModified = modifiedOn;

        if (deletedId !== id)
            throw new Error('Id in deleteGallery request and response do not match');

        const galleries = this.#galleries.getValue().filter(g => g.id !== deletedId);
        this.#galleries.setValue(galleries);

        return true;
    }

    /**
     * @param {Number} id 
     * @returns {Promise<boolean>}
     */
    async deleteImage(id) {
        const result = await imageGalleryApiService.deleteImage(id);

        if (!result)
            throw new Error('No result received in deleteImage');

        const [ deletedId, modifiedOn ] = result;

        this.#imageModified = modifiedOn;

        if (deletedId !== id)
            throw new Error('Id in deleteImage request and response do not match');

        const images = this.#images.getValue().filter(i => i.id !== deletedId);
        this.#images.setValue(images);

        return true;
    }

    /**
     * @param {number} id 
     * @param {(value: Gallery) => void} next 
     */
    getGallery(id, next) {
        if (this.#initialized) {
            next.call(this, this.#galleries.getValue().find(g => g.id === id));
            return;
        }

        this.#galleries.first({
            next: value => next.call(this, value.find(g => g.id === id))
        });
    }

    /**
     * @param {number} id 
     * @returns {Image}
     */
    getImage(id) {
        return this.#images.getValue().find(i => i.id === id);
    }

    /**
     * @param {number} id 
     * @param {(value: Image) => void} next 
     */
    getImageCallback(id, next) {
        if (this.#initialized) {
            next.call(this, this.#images.getValue().find(i => i.id === id));
            return;
        }

        this.#images.first({
            next: value => next.call(this, value.find(i => i.id === id))
        });
    }

    /** @param {(value: Image[]) => void} next */
    getImages(next) {
        if (this.#initialized) {
            next.call(this, this.#images.getValue());
            return;
        }
        
        this.#images.first({
            next: value => next.call(this, value)
        });
    }
    
    /** 
     * @param {GalleryDTO} galleryDTO
     * @returns {Promise<boolean>}
     */
    async updateGallery(galleryDTO) {
        const result = await imageGalleryApiService.putGallery(galleryDTO);

        if (!result)
            throw new Error('No result received in updateGallery');

        const [ gallery, modifiedOn ] = result;

        this.#galleryModified = modifiedOn;

        const index = this.#galleries.getValue().findIndex(g => g.id === gallery.id);
        this.#galleries.setValue(gallery, index);

        return true;
    }

    /**
     * @param {number} galleryId 
     * @param {number[]} imageIds 
     * @returns {Promise<boolean>}
     */
    async updateGalleryImages(galleryId, imageIds) {
        if (Number.isInteger(galleryId) === false || galleryId < 1)
            throw new Error('Gallery ID is not a valid integer');

        imageIds.forEach((imageId, index) => {
            if (Number.isInteger(imageId) === false || imageId < 1)
                throw new Error(`Image ID at index ${index} is not a valid integer`);
        });

        const galleryImagesDTO = new GalleryImagesDTO({galleryId, imageIds});

        const result = await imageGalleryApiService.patchGallery(galleryImagesDTO);

        if (!result)
            throw new Error('No result received in updateGalleryImages');

        const [ gallery, removed, modifiedOn ] = result;

        this.#galleryImageModified = modifiedOn;

        const index = this.#galleries.getValue().findIndex(g => g.id === gallery.id);
        this.#galleries.setValue(gallery, index);

        /** @type Image[] */
        const images = [...this.#images.getValue()];
        for (const image of images) {
            if (removed.imageIds.find(iId => iId === image.id))
                image.galleryIds = image.galleryIds.filter(gId => gId !== gallery.id);

            if (gallery.imageIds.find(iId => iId === image.id) && image.galleryIds.every(gId => gId !== gallery.id))
                image.galleryIds.push(gallery.id);
        }
        this.#images.setValue(images);

        return true;
    }

    /**
     * @param {ImageDTO} imageDTO 
     * @returns {Promise<boolean>}
     */
    async updateImage(imageDTO) {
        const result = await imageGalleryApiService.patchImage(imageDTO);

        if (!result)
            throw new Error('No result received in updateImage');

        const [ image, modifiedOn ] = result;
        
        this.#imageModified = modifiedOn;

        const index = this.#images.getValue().findIndex(i => i.id === image.id);
        this.#images.setValue(image, index);

        return true;
    }
}
const imageGalleryService = new ImageGalleryService();