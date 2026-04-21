export default class GalleryDTO {
    /** @param {FormData} formData */
    constructor(formData) {
        this.id = Number(formData.get('id') ?? 0);
        this.title = formData.get('title');
        this.description = formData.get('description');
    }
}