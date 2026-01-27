import httpClient from "/js/http-client.js";
import Gallery from "/js/models/image-gallery/gallery.model.js";
import GalleryImagesDTO from "/js/models/image-gallery/gallery-images.dto.model.js";
import Image from "/js/models/image-gallery/image.model.js";
import ImageDTO from "/js/models/image-gallery/image.dto.model.js";
import GalleryDTO from "/js/models/image-gallery/gallery.dto.model.js";

export { imageGalleryApiService as default };

class ImageGalleryApiService {
    #httpClient;

    constructor() {
        this.#httpClient = httpClient;
    }

    /**
     * @param {Number} id 
     * @returns {Promise<([Number, Date]|false)>}
     */
    async deleteGallery(id) {
        const response = await this.#httpClient.delete('galleries', id);

        if (!response.success)
            return false;

        if (!response.value)
            throw new Error('Delete failed to return gallery data');

        return [
            Number(response.value.id),
            new Date(response.value.modifiedOn.date + response.value.modifiedOn.timezone)
        ];
    }

    /**
     * @param {Number} id 
     * @returns {Promise<([Number, Date]|false)>}
     */
    async deleteImage(id) {
        const response = await this.#httpClient.delete('images', id);

        if (!response.success)
            return false;

        if (!response.value)
            throw new Error('Delete failed to return image data');

        return [
            Number(response.value.id),
            new Date(response.value.modifiedOn.date + response.value.modifiedOn.timezone)
        ];
    }

    /**
     * @returns {Promise<(Gallery[]|false)}
     */
    async getGalleries() {
        const response = await this.#httpClient.get('galleries');

        if (!response.success)
            return false;

        if (!response.value)
            return [];

        const galleries = [];
        for (const key in response.value) {
            const gallery = response.value[key];
            galleries.push(new Gallery(gallery));
        }

        return galleries;
    }

    /**
     * @returns {Promise<(Image[]|false)>}
     */
    async getImages() {
        const response = await this.#httpClient.get('images');

        if (!response.success)
            return false;

        if (!response.value)
            return [];

        const images = [];
        for (const key in response.value) {
            const image = response.value[key];
            images.push(new Image(image));
        }

        return images;
    }

    /**
     * @param {GalleryImagesDTO} galleryImagesDTO 
     * @returns {Promise<([Gallery, GalleryImagesDTO, Date]|false)>}
     */
    async patchGallery(galleryImagesDTO ) {
        const response = await this.#httpClient.patch('galleries', galleryImagesDTO);

        if (!response.success)
            return false;

        if (!response.value.gallery)
            throw new Error('Update failed to return gallery data');

        if (!response.value.modifiedOn)
            throw new Error('Update failed to return table modified data');

        return [
            new Gallery(response.value.gallery),
            new GalleryImagesDTO(response.value.removed),
            new Date(response.value.modifiedOn.date + response.value.modifiedOn.timezone)
        ];
    }

    /**
     * @param {ImageDTO} imageDTO 
     * @returns {Promise<([Image, Date]|false)>}
     */
    async patchImage(imageDTO) {
        const response = await this.#httpClient.patch('images', imageDTO);

        if (!response.success)
            return false; // TODO: A notification system should inform the user on failure in these cases

        if (!response.value.image)
            throw new Error('Update failed to return image data');

        if (!response.value.modifiedOn)
            throw new Error('Update failed to return table modified date');

        return [
            new Image(response.value.image),
            new Date(response.value.modifiedOn.date + response.value.modifiedOn.timezone)
        ];
    }

    /**
     * @param {GalleryDTO} galleryDTO
     * @returns {Promise<([Gallery, Date]|false)>}
     */
    async postGallery(galleryDTO) {
        const response = await this.#httpClient.post('galleries', galleryDTO);

        if (!response.success)
            return false;

        if (!response.value.gallery)
            throw new Error('Create failed to return gallery data');

        if (!response.value.modifiedOn)
            throw new Error('Create failed to return table modified date');

        return [
            new Gallery(response.value.gallery),
            new Date(response.value.modifiedOn.date + response.value.modifiedOn.timezone)
        ];
    }

    /**
     * @param {Object} data 
     * @returns {Promise<([Image, Date]|false)>}
     */
    async postImage(data) {
        const response = await this.#httpClient.post('images', data);

        if (!response.success)
            return false; // TODO: Notification

        if (!response.value.image)
            throw new Error('Create failed to return image data');

        if (!response.value.modifiedOn)
            throw new Error('Create failed to return table modified date');

        return [
            new Image(response.value.image),
            new Date(response.value.modifiedOn.date + response.value.modifiedOn.timezone)
        ];
    }

    /**
     * @param {GalleryDTO} galleryDTO
     * @returns {Promise<([Gallery, Date]|false)>}
     */
    async putGallery(galleryDTO) {
        const response = await this.#httpClient.put('galleries', galleryDTO);

        if (!response.success)
            return false;

        if (!response.value.gallery)
            throw new Error('Create failed to return gallery data');

        if (!response.value.modifiedOn)
            throw new Error('Create failed to return table modified date');

        return [
            new Gallery(response.value.gallery),
            new Date(response.value.modifiedOn.date + response.value.modifiedOn.timezone)
        ];
    }
}
const imageGalleryApiService = new ImageGalleryApiService();