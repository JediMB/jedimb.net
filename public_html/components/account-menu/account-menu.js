import sessionService from '/js/services/session.service.js';

class AccountMenu {
    #sessionService = sessionService;

    #menuLoggedIn;
    #menuLoggedOut;

    constructor() {
        const component = document.querySelector('account-menu-container');

        this.#menuLoggedIn = component.querySelector('[menu-logged-in]');
        this.#menuLoggedOut = component.querySelector('[menu-logged-out]');

        component.querySelector('[account-menu-logout]').addEventListener('click',
            (event) => {
                event.preventDefault();
                this.#sessionService.logout();
        });

        this.#sessionService.isLoggedIn.subscribe(value => {
            this.#menuLoggedIn.classList.toggle('hidden', !value);
            this.#menuLoggedOut.classList.toggle('hidden', !!value);
        });
    }

}
const accountMenu = new AccountMenu();