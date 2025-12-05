export default class ImageDTO {
    /**
     * @param {FormData} formData 
     */
    constructor(formData) {
        this.id = Number(formData.get('id'));
        this.title = formData.get('title');
        this.description = formData.get('description');
    }
}