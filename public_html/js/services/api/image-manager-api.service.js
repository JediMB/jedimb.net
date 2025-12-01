import httpClient from "/js/http-client.js";
import Image from "/js/models/image.model.js";
import ImageGallery from "/js/models/image-gallery.model.js";

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

        if (response.value)
            return response.value.map(image => new Image(image));

        return [];
    }

    /**
     * @returns {Promise<(ImageGallery[]|false)}
     */
    async getImageGalleries() {
        const response = await this.#httpClient.get('images/galleries');

        if (!response.success)
            return false;

        if (response.value)
            return response.value.map(gallery => new ImageGallery(gallery));

        return [];
    }
}
const imageManagerApiService = new ImageManagerApiService();