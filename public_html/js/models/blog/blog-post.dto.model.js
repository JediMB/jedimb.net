import { formatTimezone } from "/js/utilities/format-date.utility.js";

export default class BlogPostDTO {
    /**
     * @param {FormData} formData
     */
    constructor(formData) {
        this.id = Number(formData.get('id'));
        this.permalink = formData.get('permalink');
        this.title = formData.get('title');
        this.description = formData.get('description');
        this.contentShort = formData.get('contentShort');
        this.contentRest = formData.get('contentRest') || null;
        this.mastolink = formData.get('mastolink') || null;
        this.isPinned = Boolean(formData.get('isPinned'));

        const isScheduled = formData.get('isScheduled');
        const scheduledDate = formData.get('scheduledDate');
        const scheduledTime = formData.get('scheduledTime');

        this.scheduledOn = isScheduled && scheduledDate && scheduledTime
            ? `${scheduledDate} ${scheduledTime.slice(0, 5)}:00.000 ${formatTimezone(new Date())}`
            : null;
    }
}