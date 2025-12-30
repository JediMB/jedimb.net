import formatDate from "/js/utilities/format-date.js";

export class DateTimeElement extends HTMLElement {
    #self;

    constructor() {
        const component = super();
        this.#self = component;
    }

    connectedCallback() {
        /** @type DateTimeElement */
        const self = this.#self;

        if (!self.hasAttribute('server-time'))
            return;

        try {
            const today = new Date();
            const parsedDate = new Date(self.getAttribute('server-time'));

            self.title = formatDate(parsedDate);

            const useRelativeDate = self.hasAttribute('relative-date') && self.getAttribute('relative-date') !== 'false';
            
            if(useRelativeDate) {
                const hourDifference = (today - parsedDate) / (1000 * 60 * 60);

                if (hourDifference < 1) {
                    self.textContent = Math.floor(hourDifference * 60) + 'm ago';
                    return;
                }

                if (hourDifference < 24) {
                    self.textContent = Math.floor(hourDifference) + 'h ago';
                    return;
                }

                today.setHours(0, 0, 0, 0);
                const startOfDate = new Date(parsedDate.getFullYear(), parsedDate.getMonth(), parsedDate.getDate(), 0, 0, 0, 0);
                const dayDifference = Math.round((today - startOfDate) / (1000 * 60 * 60 * 24));

                if (dayDifference === 1) {
                    self.textContent = 'Yesterday, ' + parsedDate.toLocaleTimeString();
                    return;
                }
            }

            self.textContent = parsedDate.toLocaleString();
        }
        catch (e) {
            self.textContent = 'Error parsing date';
        }
    }

    disconnectedCallback() {}

    connectedMoveCallback() {}
}

customElements.define('date-time', DateTimeElement);