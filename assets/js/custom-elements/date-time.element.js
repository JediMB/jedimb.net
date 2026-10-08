import { formatDate } from "/js/utilities/format-date.utility.js";

export default class DateTimeElement extends HTMLElement {
    constructor() { super(); }

    connectedCallback() {
        const dateString = this.getAttribute('date-string')?.trim();

        if (!dateString)
            return;

        this.#formatDateTime(dateString);
    }

    disconnectedCallback() {}

    connectedMoveCallback() {}

    /** @param {Date} date  */
    setDateTime(date) {
        this.setAttribute('date-string', formatDate(date));
        this.#formatDateTime();
    }

    /**
     * @param {string} dateString 
     */
    #formatDateTime(dateString) {
        try {
            const today = new Date();
            const parsedDate = new Date(dateString);

            this.title = formatDate(parsedDate);

            const useRelativeDate = this.hasAttribute('relative-date') && this.getAttribute('relative-date')?.trim() !== 'false';
            
            if(useRelativeDate) {
                const hourDifference = (today - parsedDate) / (1000 * 60 * 60);

                if (hourDifference < 1) {
                    this.textContent = Math.floor(hourDifference * 60) + 'm ago';
                    return;
                }

                if (hourDifference < 24) {
                    this.textContent = Math.floor(hourDifference) + 'h ago';
                    return;
                }

                today.setHours(0, 0, 0, 0);
                const startOfDate = new Date(parsedDate.getFullYear(), parsedDate.getMonth(), parsedDate.getDate(), 0, 0, 0, 0);
                const dayDifference = Math.round((today - startOfDate) / (1000 * 60 * 60 * 24));

                if (dayDifference === 1) {
                    this.textContent = 'Yesterday, ' + parsedDate.toLocaleTimeString();
                    return;
                }
            }

            this.textContent = parsedDate.toLocaleString();
        }
        catch (e) {
            this.textContent = 'Error parsing date';
        }
    }
}

customElements.define('date-time', DateTimeElement);