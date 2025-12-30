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
            today.setHours(0, 0, 0, 0);
            const parsedTime = new Date(self.getAttribute('server-time'));

            const useRelativeDate = self.hasAttribute('relative-date') && self.getAttribute('relative-date') !== 'false';
            
            if(useRelativeDate) {
                const startOfDate = new Date(parsedTime.getFullYear(), parsedTime.getMonth(), parsedTime.getDate(), 0, 0, 0, 0);
                const dayDifference = Math.round((today - startOfDate) / (1000 * 60 * 60 * 24));
                
                if (dayDifference === 0) {
                    self.textContent = 'today, ' + parsedTime.toLocaleTimeString();
                    return;
                }

                if (dayDifference === 1) {
                    self.textContent = 'yesterday, ' + parsedTime.toLocaleString();
                    return;
                }
            }

            self.textContent = parsedTime.toLocaleString();
        }
        catch (e) {
            self.textContent = 'Error parsing date';
        }
    }

    disconnectedCallback() {}

    connectedMoveCallback() {}
}

customElements.define('date-time', DateTimeElement);