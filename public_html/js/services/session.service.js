import Emitter from '/js/utilities/emitter.js';
import sessionApiService from '/js/services/api/session-api.service.js';
import { cookieUserKey, cookieTokenKey, cookieValidatorKey } from '/js/constants.js';

export { sessionService as default };

class SessionService {
    #sessionApiService;

    isLoggedIn = new Emitter(undefined);
    user = new Emitter(undefined);

    constructor() {
        this.#sessionApiService = sessionApiService;

        this.isLoggedIn.subscribe(value => {
            if (value === true)
                this.#fetchUser();
            else
                this.user.setValue(null);
        });

        this.#sessionApiService.getStatus().then(status => {
            this.isLoggedIn.setValue(status);
        });
    }

    async login(formData) {
        const response = await this.#sessionApiService.login(formData);

        if (!response.success)
            return response;
        
        if (response.value.token)
            this.#setCookies(response.value);

        this.isLoggedIn.setValue(true);

        return response;
    }

    async logout() {
        const response = await this.#sessionApiService.logout();

        if (response.success) {
            this.#setCookies({});

            this.isLoggedIn.setValue(false);
        }

        return response; // TODO: Error handling
    }

    #setCookies({ userId = '', token = '', validator = '', expiresOn = new Date(0) }) {
        const expires = expiresOn.toUTCString();
        document.cookie = `${cookieUserKey}=${userId}; expires=${expires};`;
        document.cookie = `${cookieTokenKey}=${token}; expires=${expires};`;
        document.cookie = `${cookieValidatorKey}=${validator}; expires=${expires};`;
    }

    async #fetchUser() {
        const response = await this.#sessionApiService.getUser();

        if (!response.success || !response.value)
            return;

        this.user.setValue(response.value);
    }
}
const sessionService = new SessionService();