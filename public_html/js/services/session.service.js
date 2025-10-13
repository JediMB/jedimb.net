import Emitter from '../utilities/emitter.js';

export { sessionService as default };

class SessionService {
    isLoggedIn = new Emitter(false);

    constructor() { }
}
const sessionService = new SessionService();