import Emitter from '../utilities/emitter.js';
import sessionApiService from './api/session-api.service.js';

export { sessionService as default };

class SessionService {
    #sessionApiService;

    isLoggedIn = new Emitter(false);
    user = new Emitter(undefined);

    constructor() {
        this.#sessionApiService = sessionApiService;

        const user = this.#sessionApiService.getUser().then(
            response => {
                if (!response.success || !response.value)
                    return;

                this.isLoggedIn.setValue(true);
                this.user.setValue(response.value);
            }
        );
    }
}
const sessionService = new SessionService();