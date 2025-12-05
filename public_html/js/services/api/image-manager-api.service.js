import httpClient from "/js/http-client.js";
import Gallery from "/js/models/image-gallery/gallery.model.js";
import Image from "/js/models/image-gallery/image.model.js";

export { imageManagerApiService as default };

class ImageManagerApiService {
    #httpClient;

    constructor() {
        this.#httpClient = httpClient;
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
     * @returns {Promise<(Gallery[]|false)}
     */
    async getImageGalleries() {
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
}
const imageManagerApiService = new ImageManagerApiService();