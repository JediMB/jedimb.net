import Emitter from '../utilities/emitter.js';
import sessionApiService from './api/session-api.service.js';
import { cookieUserKey, cookieTokenKey, cookieValidatorKey } from '../constants.js';

export { sessionService as default };

class SessionService {
    #sessionApiService;

    isLoggedIn = new Emitter(false);
    user = new Emitter(undefined);

    #cookieKeys = [
        document.querySelector(`meta[name="${cookieUserKey}"]`).content,
        document.querySelector(`meta[name="${cookieTokenKey}"]`).content,
        document.querySelector(`meta[name="${cookieValidatorKey}"]`).content
    ];

    constructor() {
        this.#sessionApiService = sessionApiService;

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
        document.cookie = `${this.#cookieKeys[0]}=${userId}; expires=${expires};`;
        document.cookie = `${this.#cookieKeys[1]}=${token}; expires=${expires};`;
        document.cookie = `${this.#cookieKeys[2]}=${validator}; expires=${expires};`;
    }

                if (!response.success || !response.value)
                    return;

                this.isLoggedIn.setValue(true);
                this.user.setValue(response.value);
            }
        );
    }
}
const sessionService = new SessionService();