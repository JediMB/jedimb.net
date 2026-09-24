import Emitter from '/js/utilities/emitter.js';
import User from '/js/models/user/user.model.js';
import sessionApiService from '/js/services/api/session-api.service.js';
import { cookieUserKey, cookieTokenKey, cookieValidatorKey } from '/js/constants/meta-constants.js';
import { UserRole } from '/js/enums/user-role.enum.js';
import { UserPermission } from '/js/enums/user-permission.enum.js';

export { sessionService as default };

class SessionService {
    #sessionApiService;
    /** @type {Map<number, number[]>} */ #userRolePermissions = new Map();

    /** @type {Emitter<boolean>} */ isLoggedIn = new Emitter(undefined);
    /** @type {Emitter<User>} */ user = new Emitter(undefined);

    constructor() {
        this.#sessionApiService = sessionApiService;

        this.#userRolePermissions.set(UserRole.Administrator, [
            UserPermission.Configuration, UserPermission.Publishing, UserPermission.Editing, UserPermission.Deleting
        ]);
        this.#userRolePermissions.set(UserRole.Contributor, [
            UserPermission.Publishing, UserPermission.Editing, UserPermission.Deleting
        ]);

        this.isLoggedIn.subscribe({
            next: value => {
                if (value === true)
                    this.#fetchUser();
                else
                    this.user.setValue(null);
            }
        });

        this.#sessionApiService.getStatus().then(status => {
            this.isLoggedIn.setValue(status);
        });
    }

    /**
     * @param {...number} permissionRequirements 
     * @returns {Promise<boolean>}
     */
    async hasPermissions(...permissionRequirements) {
        const user = this.user.getValue() ?? await this.#fetchUser();

        if (!user)
            return false;
        
        const userPermissions = this.#userRolePermissions.get(user.role);

        if (!userPermissions)
            throw new Error('No permissions defined for user role');

        return permissionRequirements.every(
            requirement => userPermissions.includes(requirement)
        );
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
        document.cookie = `${cookieUserKey}=${userId}; expires=${expires}; sameSite=strict; secure;`;
        document.cookie = `${cookieTokenKey}=${token}; expires=${expires}; sameSite=strict; secure;`;
        document.cookie = `${cookieValidatorKey}=${validator}; expires=${expires}; sameSite=strict; secure;`;
    }

    /** @returns {Promise<User>} */
    async #fetchUser() {
        const response = await this.#sessionApiService.getUser();

        if (!response.success || !response.value)
            return null;

        this.user.setValue(response.value);

        return response.value;
    }
}
const sessionService = new SessionService();