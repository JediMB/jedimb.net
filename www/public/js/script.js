/* Constants */


/* IMPORT: ./constants/editor-constants.js */

/** Key-value pairs of lowercase container element tags and their uses in the text editor
 * @type {[string, string][]} */
const containerTagsAndLabels = Object.freeze([
    ['div', 'Default'],
    ['p', 'Paragraph'],
    ['h3', 'Subheading 1'],
    ['h4', 'Subheading 2'],
    ['h5', 'Subheading 3']
]);

/** Array of allowed lowecase container element tags
 * @type {string[]} */
const containerTags = Object.freeze(containerTagsAndLabels.map(([k]) => k));

/** Array of list element tags
 * @type {string[]} */
const listTypeTags = Object.freeze(['ol', 'ul']);

/** Array of allowed lowercase text content element tags
 * @type {string[]} */
const textContentTags = Object.freeze([ 'a', 'b', 'i', 'li', 'u' ]);

/** Array of allowed uppsercase non-text content element tags
 * @type {string[]} */
const nonTextContentTags = Object.freeze([ 'br', 'img-gallery', 'img-wrapper' ]);

/** Complete array of allowed lowercase element tags
 * @type {string[]} */
const tagWhiteList = Object.freeze([...containerTags, ...listTypeTags, ...textContentTags, ...nonTextContentTags]);

/** @type {string[]} */
const textAlignAttributes = Object.freeze([ 'text-left', 'text-center', 'text-right', 'text-justify' ]);

/** A map-like object containing properties for element tags that can have attributes,
 * where the values are arrays of those allowed attributes.
 * */
const allowedAttributes = Object.freeze({
    div: textAlignAttributes,
    p: textAlignAttributes,
    h3: textAlignAttributes,
    h4: textAlignAttributes,
    h5: textAlignAttributes,
    a: [ 'href', 'target', 'title' ],
    'img-gallery': [ 'gallery-id', 'aspect-ratio', 'width', 'transition-time', 'wait-time' ],
    'img-wrapper': [ 'image-id', 'aspect-ratio', 'width', 'height', 'fullscreen-click' ]
});

/** @type {Object.<string, string[]>} */
const elementsWithOptions = Object.freeze({
    hr: [ 'delete' ],
    'img-gallery': [ 'aspect-ratio', 'delete', 'transition-time', 'wait-time', 'width' ],
    'img-wrapper': [ 'aspect-ratio', 'delete', 'fullscreen-click', 'height', 'width' ]
});

/** Array of uppercase keys that should have their default behavior even when accompanied by modifier keys
 * @type {string[]} */
const defaultBehaviorKeys = Object.freeze([
    'Control', 'Shift', 'Alt', 'Process', 'CapsLock',
    'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
    'Home', 'End', 'Enter',
    'A', 'C', 'X'
].map(k => k.toUpperCase()));

/** Matches against container tags and their content
 * @type {RegExp} */
const regexMatchContainers = new RegExp(
    '<(?<tag>' +
    containerTags.join('|') +
    ')\\b[ \\w=\\"\\-#;]*>(.*?)(<\\/\\k<tag>>)',
    'i'
); // /<(?<tag>div|h2|p|etc)\b[ \w=\"\-#;]*>(.*?)<\/\k<tag>>/

/** Matches against any attribute text that is not specified in the whitelist
 * @type {RegExp} */
const regexDisallowedAttributes = new RegExp(
    '<(?!(' +
    Object.getOwnPropertyNames(allowedAttributes).join(' )|(') +
    ' ))[a-z][a-z0-9\\-]*( [^>]*)>', 'gi'
);

/** Matches against any elements not in the whitelist
 * @type {RegExp} */
const regexDisallowedElements = new RegExp('(<\/?(?!(' + tagWhiteList.join('|') + ')\\b)([a-z0-9\-]*>))', "gi");

/** Matches against indentations (2+ whitespaces)
 * @type {RegExp} */
const regexIndentations = /\s{2,}/g;


/* IMPORT: ./constants/markup-constants.js */

const MarkupConstants = Object.freeze({
    loadingSpinner: '<svg is-loading width="2em" height="2em"><use xlink:href="#svg-loading" href="#svg-loading"></use></svg>'
});




/* IMPORT: ./constants/meta-constants.js */

const metaConstants = JSON.parse(document.querySelector('meta[name="constants"]').content);
const cookieUserKey = metaConstants.cookieUserKey;
const cookieTokenKey = metaConstants.cookieTokenKey;
const cookieValidatorKey = metaConstants.cookieValidatorKey;
const imageGalleryPath = metaConstants.imageGalleryPath;

/* Enums */


/* IMPORT: /js/enums/published.enum.js */

const Published = Object.freeze({
   Unpublished: 0,
   Published: 1,
   Any: 2
});




/* IMPORT: /js/enums/user-permission.enum.js */

const UserPermission = Object.freeze({
    Configuration: 0,
    Publishing: 1,
    Editing: 2,
    Deleting: 3
});




/* IMPORT: /js/enums/user-role.enum.js */

const UserRole = Object.freeze({
    User: 0,
    Administrator: 1,
    Contributor: 2
});




/* IMPORT: /js/enums/visibility.enum.js */

const Visibility = Object.freeze({
   Hidden: 0,
   Visible: 1,
   Any: 2
});



/* Models */


/* IMPORT: /js/models/configuration.model.js */

class Configuration {
    /**
    * @param {Object} param0 
    * @param {number} param0.id 
    * @param {string} param0.name 
    * @param {number|string} param0.value 
    * @param {boolean} param0.isActive  */
    constructor({ id, name, value, isActive }) {
        this.id = Number(id);
        this.name = name;
        this.value = value;
        this.isActive = isActive;
    }
}


/* IMPORT: /js/models/selection-data.model.js */

class SelectionData {
    /**
     * 
     * @param {Selection} param0 
     */
    constructor({direction, isCollapsed, anchorNode, anchorOffset, focusNode, focusOffset}) {
        const isForward = direction !== 'backward';
        
        this.isCollapsed = isCollapsed;
        this.startNode = isForward ? anchorNode : focusNode;
        this.startOffset = isForward ? anchorOffset : focusOffset;
        this.endNode = isCollapsed ? this.startNode
            : isForward ? focusNode : anchorNode;
        this.endOffset = isCollapsed ? this.startOffset
            : isForward ? focusOffset : anchorOffset;
    }
}


/* IMPORT: /js/models/undo-data.model.js */

class UndoData {
    /**
     * @param {Object} undoData
     * @param {String} undoData.innerHTML 
     * @param {Number[]} undoData.route 
     * @param {Number} undoData.offset 
     */
    constructor({innerHTML, route, offset}) {
        this.innerHTML = innerHTML;
        this.route = route;
        this.offset = offset;
    }
}


/* IMPORT: /js/models/blog/blog-post-schedule.model.js */

class BlogPostSchedule {
    /**
     * @param {object} param0 
     * @param {int} param0.id 
     * @param {int} param0.blogPostId
     * @param {{date: string, timezone: string}} param0.publishOn*/
    constructor({id, blogPostId, publishOn}) {
        this.id = Number(id);
        this.blogPostId = Number(blogPostId);
        this.publishOn = new Date(publishOn.date + publishOn.timezone);
    }
}


/* IMPORT: /js/models/blog/blog-post.dto.model.js */



/* IMPORT: /js/utilities/format-date.utility.js */

/**
 * 
 * @param {(Date|undefined)} dt 
 * @param {Boolean} millisecondPrecision
 * @returns {string}
 */
function formatDate(dt, millisecondPrecision = false) {
    if (!dt) return '';

    let year = dt.getFullYear().toString().padStart(4, '0');
    let month = (dt.getMonth() + 1).toString().padStart(2, '0');
    let date = dt.getDate().toString().padStart(2, '0');
    let hours = dt.getHours().toString().padStart(2, '0');
    let minutes = dt.getMinutes().toString().padStart(2, '0');
    let seconds = dt.getSeconds().toString().padStart(2, '0');

    let timezone = formatTimezone(dt);

    if (millisecondPrecision)
        return `${year}-${month}-${date} ${hours}:${minutes}:${seconds}.${dt.getMilliseconds()} ${timezone}`;

    return `${year}-${month}-${date} ${hours}:${minutes}:${seconds} ${timezone}`;
}

/**
 * 
 * @param {Date} dt 
 * @returns {string}
 */
function formatTimezone(dt) {
    let offset = dt.getTimezoneOffset();
    let sign = offset < 0 ? '+' : '-';
    offset = Math.abs(offset);
    let hours = Math.floor(offset / 60).toString().padStart(2, '0');
    let minutes = Math.floor(offset % 60).toString().padStart(2, '0');

    return `${sign}${hours}${minutes}`;
}

class BlogPostDTO {
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
        this.isHidden = Boolean(formData.get('isHidden'));
        this.isPinned = Boolean(formData.get('isPinned'));

        const isScheduled = formData.get('isScheduled');
        const scheduledDate = formData.get('scheduledDate');
        const scheduledTime = formData.get('scheduledTime');

        this.scheduledOn = isScheduled && scheduledDate && scheduledTime
            ? `${scheduledDate} ${scheduledTime.slice(0, 5)}:00.000 ${formatTimezone(new Date())}`
            : null;
    }
}


/* IMPORT: /js/models/blog/blog-post.model.js */

class BlogPost {
    constructor({
        id, userId, permalink, title, description, contentShort, contentRest,
        mastolink, isHidden, isPinned, publishedOn,
        createdOn, modifiedOn
    }) {
        this.id = Number(id);
        this.userId = userId ? Number(userId) : null;
        this.permalink = permalink;
        this.title = title;
        this.description = description;
        this.contentShort = contentShort;
        this.contentRest = contentRest;
        this.mastolink = mastolink;
        this.isPinned = Boolean(isPinned);
        this.isHidden = Boolean(isHidden);
        this.publishedOn = publishedOn ? new Date(publishedOn.date + publishedOn.timezone) : undefined;
        this.createdOn = new Date(createdOn.date + createdOn.timezone);
        this.modifiedOn = modifiedOn ? new Date(modifiedOn.date + modifiedOn.timezone) : undefined;
    }
}


/* IMPORT: /js/models/blog/pagination.model.js */

class Pagination {
    constructor({page, pageSize, offset, itemCount, pageCount}) {
        this.page = Number(page);
        this.pageSize = Number(pageSize);
        this.offset = Number(offset);
        this.itemCount = Number(itemCount);
        this.pageCount = Number(pageCount);
    }
}


/* IMPORT: /js/models/image-gallery/gallery-images.dto.model.js */

class GalleryImagesDTO {
    /**
     * @param {{galleryId: number, imageIds: number[]}} param0 
     */
    constructor({galleryId, imageIds}) {
        this.galleryId = galleryId;
        this.imageIds = [...imageIds];
    }
}


/* IMPORT: /js/models/image-gallery/gallery.dto.model.js */

class GalleryDTO {
    /** @param {FormData} formData */
    constructor(formData) {
        this.id = Number(formData.get('id') ?? 0);
        this.title = formData.get('title');
        this.description = formData.get('description');
    }
}


/* IMPORT: /js/models/image-gallery/gallery.model.js */

class Gallery {
    /**
     * @param {Object} param0 
     * @param {number} param0.id
     * @param {string} param0.title
     * @param {string} param0.description
     * @param {{date: string, timezone: string}} param0.createdOn
     * @param {?{date: string, timezone: string}} param0.modifiedOn
     * @param {number[]} param0.imageIds
     */
    constructor({id, title, description, createdOn, modifiedOn, imageIds}) {
        this.id = Number(id);
        this.title = title;
        this.description = description;
        this.createdOn = new Date(createdOn.date + createdOn.timezone);
        this.modifiedOn = modifiedOn ? new Date(modifiedOn.date + modifiedOn.timezone) : undefined;
        this.imageIds = imageIds.map(iId => Number(iId));
    }
}


/* IMPORT: /js/models/image-gallery/image.dto.model.js */

class ImageDTO {
    /**
     * @param {FormData} formData 
     */
    constructor(formData) {
        this.id = Number(formData.get('id') ?? 0);
        this.title = formData.get('title');
        this.description = formData.get('description');
    }
}


/* IMPORT: /js/models/image-gallery/image.model.js */

class Image {
    /**
     * @param {Object} param0 
     * @param {number} param0.id
     * @param {string} param0.filename
     * @param {string} param0.title
     * @param {string} param0.description
     * @param {{date: string, timezone: string}} param0.createdOn
     * @param {?{date: string, timezone: string}} param0.modifiedOn
     * @param {number[]} param0.galleryIds
     */
    constructor({id, filename, title, description, createdOn, modifiedOn, galleryIds}) {
        this.id = Number(id);
        this.filename = filename;
        this.title = title;
        this.description = description;
        this.createdOn = new Date(createdOn.date + createdOn.timezone);
        this.modifiedOn = modifiedOn ? new Date(modifiedOn.date + modifiedOn.timezone) : undefined;
        this.galleryIds = galleryIds.map(gId => Number(gId));
    }
}


/* IMPORT: /js/models/user/user-login-request.model.js */

class UserLoginRequest {
    constructor(formData) {
        this.username = formData.get('username');
        this.password = formData.get('password');
        this.persistent = Boolean(formData.get('rememberme'));
    }
}


/* IMPORT: /js/models/user/user-login-response.model.js */

class UserLoginResponse {
    constructor({
        userId, token, validator, expiresOn
    }) {
        this.userId = Number(userId);
        this.token = token;
        this.validator = validator;
        this.expiresOn = expiresOn ? new Date(expiresOn.date + expiresOn.timezone) : null;
    }
}


/* IMPORT: /js/models/user/user.model.js */

class User {
    /**
    * @param {Object} user 
    * @param {string} user.username 
    * @param {string} user.email 
    * @param {number} user.role 
    * @param {{date: string, timezone: string}} user.passwordTimestamp 
    * @param {{date: string, timezone: string}} user.registeredOn 
    * @param {{date: string, timezone: string}} [user.lastLogin] */
    constructor({
        username, email, role, passwordTimestamp, registeredOn, lastLogin
    }) {
        this.username = username;
        this.email = email;
        this.role = role;
        this.passwordTimestamp = new Date(passwordTimestamp.date + passwordTimestamp.timezone);
        this.registeredOn = new Date(registeredOn.date + registeredOn.timezone);
        this.lastLogin = lastLogin ? new Date(lastLogin.date + lastLogin.timezone) : undefined;
    }
}

/* Services */


/* IMPORT: /js/http-client.js */



class HttpClient {
    #baseApiUrl = '/api/';
    #requestTypeCss = 'background-color: red; color: white;';

    constructor() { }

    /**
     * @param {Response} response 
     * @param {string} httpMethod 
     * @returns {Promise<{success: boolean, errors?: string[]|object[], value?: any}>}
     */
    async #responseHandling(response, api, httpMethod) {
        if (!response.ok) {
            console.error(`Error ${response.status}: %c ${httpMethod} %c '${this.#baseApiUrl + api}' failed.`, this.#requestTypeCss);

            try {
                return { success: false, errors: (await response.json()).errors };
            }
            catch (error) {
                return { success: false, errors: [ error.message ] };
            }
        }

        const data = await response.json().catch(
            error => ({
                success: false,
                errors: [ `Failed to parse JSON: ${error.message}` ]
            })
        );

        return data;
    }

    /**
     * Requests data from the API
     * @param {string} api 
     * @param {(number|string)[]} args 
     * @returns {Promise<{success: boolean, errors?: string[]|object[], value?: any}>}
     */
    async get(api, ...args) {
        const queryString = args ? `/${args.join('/')}` : '';

        const response = await fetch(this.#baseApiUrl + api + queryString).catch(
            error => ({
                ok: false,
                errors: [ error.message ]
            })
        );

        return await this.#responseHandling(response, api, 'GET');
    }

    /**
     * Submits new data to the API
     * @param {string} api 
     * @param {any} body 
     * @returns {Promise<{success: boolean, errors?: string[]|object[], value?: any}>}
     */
    async post(api, body = null) {
        const response = await fetch(this.#baseApiUrl + api, {
            method: 'POST',
            body: JSON.stringify(body)
        }).catch(
            error => ({
                ok: false,
                errors: [ error.message ]
            })
        );

        return await this.#responseHandling(response, api, 'POST');
    }

    /**
     * Sends a full object update to the API
     * @param {string} api 
     * @param {any} body 
     * @returns {Promise<{success: boolean, errors?: string[]|object[], value?: any}>}
     */
    async put(api, body) {
        const response = await fetch(this.#baseApiUrl + api, {
            method: 'PUT',
            body: JSON.stringify(body)
        }).catch(
            error => ({
                ok: false,
                errors: [ error.message ]
            })
        );

        return await this.#responseHandling(response, api, 'PUT');
    }

    /**
     * Sends a partial object update to the API
     * @param {string} api 
     * @param {any} body 
     * @returns {Promise<{success: boolean, errors?: string[]|object[], value?: any}>}
     */
    async patch(api, body = null) {
        const response = await fetch(this.#baseApiUrl + api, {
            method: 'PATCH',
            body: JSON.stringify(body)
        }).catch(
            error => ({
                ok: false,
                errors: [ error.message ]
            })
        );

        return await this.#responseHandling(response, api, 'PATCH');
    }

    /**
     * Requests the deletion of data from the API
     * @param {string} api 
     * @param {number|string} identifier
     * @returns {Promise<({success: boolean, errors?: string[]|object[], value?: any})>}
     */
    async delete(api, identifier) {
        if (!identifier)
            throw new Error('Identifier missing in delete call');

        const response = await fetch(this.#baseApiUrl + `${api}/${identifier}`, {
            method: 'DELETE'
        }).catch(
            error => ({
                ok: false,
                errors: [ error.message ]
            })
        );

        return await this.#responseHandling(response, api, 'DELETE');
    }
}
const httpClient = new HttpClient();


/* IMPORT: /js/services/blog-post.service.js */



/* IMPORT: /js/models/blog/blog-post.model.js */




/* IMPORT: /js/models/blog/blog-post.dto.model.js */




/* IMPORT: /js/models/blog/blog-post-schedule.model.js */




/* IMPORT: /js/utilities/emitter.js */

/** @template T */
class Emitter {
    /** @type {Listener[]} */ #listeners = [];
    /** @type {T} */ #value;

    /** @param {T} value  */
    constructor(value) {
        this.#value = value;
    }

    /**
     * Subscribes to the first change of the value/object, then automatically unsubscribes
     * 
     * @param {Object} callbacks
     * @param {( (value: T) => void )} callbacks.next
     * @param {( (index: Number, value: any) => void )} callbacks.nextIndexed
     */
    first({next, nextIndexed}) {
        const listener = new Listener(this, {next, nextIndexed}, { getOnce: true });
        this.#listeners.push(listener);
    }

    /**
     * Gets the entire value/object, or a value within an array
     * 
     * @param {(Number|undefined)} arrayIndex 
     * @returns {T}
     */
    getValue(arrayIndex = undefined) {
        if (typeof arrayIndex === 'number') {
            if (!Array.isArray(this.#value))
                throw new Error('Index provided for non-array');

            return this.#value[arrayIndex];
        }

        return this.#value;
    }

    /**
     * Sets the entire value/object, or a value within an array
     * 
     * @param {T} value 
     * @param {(Number|undefined)} arrayIndex 
     */
    setValue(value, arrayIndex = undefined) {
        let isUnchanged = false;

        if (typeof arrayIndex === 'number') {
            if (!Array.isArray(this.#value))
                throw new Error('Index provided for non-array');

            if (this.#value[arrayIndex] === value)
                isUnchanged = true;

            this.#value[arrayIndex] = value;


            for (const listener of this.#listeners) {
                if (isUnchanged && !listener.wantsUnchanged)
                    continue;

                listener.nextIndexed(arrayIndex, this.#value[arrayIndex]);
            }

            return;
        }

        if (this.#value === value)
            isUnchanged = true;

        this.#value = value;

        for (const listener of this.#listeners) {
            if (isUnchanged && !listener.wantsUnchanged)
                continue;

            listener.next(this.#value);
        }
    }

    /**
     * Subscribes to changes of the whole value/object, to values within an array, or both
     * 
     * @param {Object} callbacks
     * @param {((value: T) => void)} callbacks.next
     * @param {((index: Number, value: any) => void)} callbacks.nextIndexed
     * @param {{getCurrent: boolean, getUnchanged: boolean}} options
     * @returns {Listener}
     */
    subscribe({next, nextIndexed} /*{ error, complete }*/, { getCurrent, getUnchanged } = {}) {
        const listener = new Listener(this, { next, nextIndexed }, { getUnchanged });
        this.#listeners.push(listener);

        if (getCurrent)
            listener.next(this.#value);

        return listener;
    }

    /** @param {Listener} listener */
    unsubscribe(listener) {
        this.#listeners = this.#listeners.filter(sub => sub !== listener);
    }
}

class Listener {
    #emitter;
    #onNext;
    #onNextIndexed;
    #wantsOnce = false;
    #wantsUnchanged = false;

    #paused = false;

    get wantsUnchanged() {
        return this.#wantsUnchanged;
    }

    /**
     * @param {Emitter} emitter 
     * @param {Object} callbacks
     * @param {(Function|undefined)} callbacks.next 
     * @param {(Function|undefined)} callbacks.nextIndexed 
     * @param {{getOnce: boolean, getUnchanged: boolean}} options
     */
    constructor(emitter, { next, nextIndexed }, { getOnce, getUnchanged } = {}) {
        this.#emitter = emitter;

        if (getOnce && typeof getOnce === 'boolean')
            this.#wantsOnce = getOnce;

        if (getUnchanged && typeof getUnchanged === 'boolean')
            this.#wantsUnchanged = getUnchanged;

        if (next && typeof next === 'function')
            this.#onNext = next;

        if (nextIndexed && typeof nextIndexed === 'function')
            this.#onNextIndexed = nextIndexed;
    }

    /** @param {T} value  */
    next(value) {
        if (this.#paused)
            return;

        this.#onNext?.call(this, value);
        this.#wantsOnce && this.unsubscribe();
    }

    /**
     * @param {Number} index
     * @param {any} value 
     */
    nextIndexed(index, value) {
        if (this.#paused)
            return;

        this.#onNextIndexed?.call(this, index, value);
        this.#wantsOnce && this.unsubscribe();
    }

    pause() {
        this.#paused = true;
    }

    unpause() {
        this.#paused = false;
    }

    unsubscribe() {
        this.#emitter.unsubscribe(this);
    }
}


/* IMPORT: /js/models/blog/pagination.model.js */





/* IMPORT: /js/services/api/blog-post-api.service.js */



/* IMPORT: /js/http-client.js */




/* IMPORT: /js/models/blog/blog-post.model.js */




/* IMPORT: /js/models/blog/blog-post.dto.model.js */




/* IMPORT: /js/models/blog/blog-post-schedule.model.js */




/* IMPORT: /js/models/blog/pagination.model.js */





class BlogPostApiService {
    #httpClient;
    #api = {
        draft: 'blog/draft',
        post: 'blog/post',
        posts: 'blog/posts'
    };

    constructor() {
        this.#httpClient = httpClient;
    }

    /**
     * @param {number} id 
     * @returns {Promise<({success: boolean, errors?: string[], value?: BlogPost})>}
     */
    async deleteBlogPost(id) {
        const response = await this.#httpClient.delete(this.#api.post, id);
        
        if (!response.success)
            return false;

        if (!response.value)
            throw new Error('Delete failed to return blog post data');

        response.value = new BlogPost(response.value);

        return response;
    }

    /**
     * @param {number} id 
     * @returns {Promise<(BlogPost|false)>}
     */
    async getBlogPost(id) {
        const response = await this.#httpClient.get(this.#api.post, id);

        if (!response.success)
            return false;

        if (!response.value)
            throw new Error('Get blog post failed to return blog post data');

        return new BlogPost(response.value);
    }

    /**
     * @param {number} page 
     * @param {number} pageSize 
     * @param {...string} adminArgs Additional arguments for getting admin page data
     * @returns {Promise<{blogPosts: BlogPost[], pagination: Pagination}>}  */
    async getBlogPosts(page, pageSize, ...adminArgs) {
        const response = await this.#httpClient.get(this.#api.posts, page, pageSize, ...adminArgs);

        if (!response.success)
            return response;

        return {
            blogPosts: response.value.blogPosts.map(post => new BlogPost(post)),
            pagination: new Pagination(response.value.pagination)
        };
    }

    /**
     * @param {number} id 
     * @returns {Promise<({success: boolean, errors?: string[]|object[]})>}
     */
    async hideBlogPost(id) {
        const response = await this.#httpClient.patch(this.#api.post + `/${id}/hide`);

        if (!response.success)
            return { success: false, errors: response.errors };

        return { success: true };
    }

    /**
     * @param {number} id 
     * @returns {Promise<({success: boolean, errors?: string[]|object[]})>}
     */
    async pinBlogPost(id) {
        const response = await this.#httpClient.patch(this.#api.post + `/${id}/pin`);

        if (!response.success)
            return { success: false, errors: response.errors };

        return { success: true };
    }

    /**
     * @param {BlogPostDTO} blogPostDTO
     * @returns {Promise<({success: boolean, errors?: string[]|object[], value?: { blogPost: BlogPost, schedule: BlogPostSchedule }})>} 
     */
    async postBlogPost(blogPostDTO) {
        const response = await this.#httpClient.post(this.#api.post, blogPostDTO);

        if (!response.success)
            return response;

        if (!response.value.id)
            throw new Error('Create blog post failed to return data');

        if (blogPostDTO.scheduledOn)
            response.value = { schedule: new BlogPostSchedule(response.value) };
        else
            response.value = { blogPost: new BlogPost(response.value) };

        return response;
    }

    /**
     * @param {BlogPostDTO} blogPostDTO 
     * @returns {Promise<({success: boolean, errors?: string[]|object[], value?: BlogPost})>}
     */
    async postDraft(blogPostDTO) {
        const response = await this.#httpClient.post(this.#api.draft, blogPostDTO);

        if (!response.success)
            return response;

        if (!response.value.id)
            throw new Error('Post draft failed to return data');

        response.value = new BlogPost(response.value);

        return response;
    }

    /**
     * @param {number} id 
     * @returns {Promise<({success: boolean, errors?: string[]|object[]})>}
     */
    async publishBlogPost(id) {
        const response = await this.#httpClient.patch(this.#api.post + `/${id}/publish`);

        if (!response.success)
            return { success: false, errors: response.errors };

        return { success: true };
    }

    /**
     * @param {BlogPostDTO} blogPostDTO 
     * @returns {Promise<({success: boolean, errors?: string[]|object[], value?: BlogPost})>}
     */
    async publishDraft(blogPostDTO) {
        const response = await this.#httpClient.put(this.#api.draft + '/publish', blogPostDTO);

        if (!response.success)
            return response;

        if (!response.value.id)
            throw new Error('Publish draft failed to return data');

        response.value = new BlogPost(response.value);

        return response;
    }

    /**
     * @param {BlogPostDTO} blogPostDTO 
     * @returns {Promise<({success: boolean, errors?: string[]|object[], value?: BlogPostSchedule})>}
     */
    async scheduleDraft(blogPostDTO) {
        const response = await this.#httpClient.put(this.#api.draft + '/schedule', blogPostDTO);

        if (!response.success)
            return response;

        if (!response.value.id)
            throw new Error('Schedule draft failed to return data');

        response.value = new BlogPostSchedule(response.value);

        return response;
    }

    /**
     * @param {number} id 
     * @returns {Promise<({success: boolean, errors?: string[]|object[]})>}
     */
    async unhideBlogPost(id) {
        const response = await this.#httpClient.patch(this.#api.post + `/${id}/unhide`);

        if (!response.success)
            return { success: false, errors: response.errors };

        return { success: true };
    }

    /**
     * @param {number} id 
     * @returns {Promise<({success: boolean, errors?: string[]|object[]})>}
     */
    async unpinBlogPost(id) {
        const response = await this.#httpClient.patch(this.#api.post + `/${id}/unpin`);

        if (!response.success)
            return { success: false, errors: response.errors };

        return { success: true };
    }

    /**
     * @param {BlogPostDTO} blogPostDTO 
     * @returns {Promise<({success: boolean, errors?: string[]|object[], value?: BlogPost})>}
     */
    async updateDraft(blogPostDTO) {
        const response = await this.#httpClient.put(this.#api.draft, blogPostDTO);

        if (!response.success)
            return response;

        if (!response.value.id)
            throw new Error('Update draft failed to return data');

        response.value = new BlogPost(response.value);

        return response;
    }

    /** 
     * @param {BlogPostDTO} blogPostDTO 
     * @returns {Promise<({success: boolean, errors?: string[]|object[], value?: BlogPost})>}
     */
    async updateBlogPost(blogPostDTO) {
        const response = await this.#httpClient.put(this.#api.post, blogPostDTO);

        if (!response.success)
            return response;

        if (!response.value.id)
            throw new Error('Update blog post failed to return data');

        response.value = new BlogPost(response.value);

        return response;
    }
}
const blogPostApiService = new BlogPostApiService();



class BlogPostService {
    #service = blogPostApiService;
    /** @type {Emitter<BlogPost>} */ #newBlogPost = new Emitter(null);

    constructor() {}

    get subscription() { return this.#newBlogPost; }

    /**
     * @param {BlogPostDTO} blogPostDTO 
     * @param {(value: { blogPost: BlogPost, schedule: BlogPostSchedule }) => void} next 
     * @param {(errors: object) => void} error
     * @returns {Promise<void>}
     */
    async createBlogPost(blogPostDTO, next, error) {
        const response = await this.#service.postBlogPost(blogPostDTO);

        if (!response.success)
            return error?.call(this, response.errors);

        if (response.value.blogPost)
            this.#newBlogPost.setValue(response.value.blogPost);

        next?.call(this, response.value);
    }

    /**
     * @param {number} id 
     * @param {(value: BlogPost) => void} next 
     * @param {(errors: string[]) => void} error
     * @returns {Promise<void>}
     */
    async deleteBlogPost(id, next, error) {
        const response = await this.#service.deleteBlogPost(id);

        if (!response.success)
            return error?.call(this, response.errors);

        next?.call(this, response.value);
    }

    /**
     * @param {number} id
     * @param {(value: BlogPost|undefined) => void} next 
     * @returns {Promise<void>}
     */
    async getBlogPost(id, next) {
        const post = await this.#service.getBlogPost(id);

        if (!post)
            throw new Error('Blog post not found');

        next?.call(this, post);
    }

    /**
     * @param {number} page 
     * @param {number} pageSize 
     * @param {(blogPosts: BlogPost[], pagination: Pagination) => void} next
     * @returns {Promise<void>}
     */
    async getBlogPosts(page, pageSize, next) {
        const { blogPosts, pagination } = await this.#service.getBlogPosts(page, pageSize);

        next?.call(this, blogPosts, pagination);
    }

    /**
     * @param {number} page 
     * @param {number} pageSize 
     * @param {{published?: number, visibility?: number}} statuses 
     * @param {(blogPosts: BlogPost[], pagination: Pagination) => void} next
     * @returns {Promise<void>}
     */
    async getBlogPostsAdminData(page, pageSize, statuses = {}, next = undefined) {
        const adminArgs = [];

        for (const status in statuses) {
            adminArgs.push(status);
            adminArgs.push(statuses[status]);
        }

        const { blogPosts, pagination } = await this.#service.getBlogPosts(page, pageSize, 'admin', ...adminArgs);

        next?.call(this, blogPosts, pagination);
    }

    /**
     * @param {number} id 
     * @param {() => void} next 
     * @param {(errors: string[]) => void} error 
     * @returns {Promise<void>}
     */
    async hideBlogPost(id, next, error) {
        const result = await this.#service.hideBlogPost(id);

        if (!result.success)
            error?.call(this, result.errors);

        next?.call(this);
    }

    /**
     * @param {number} id 
     * @param {() => void} next 
     * @param {(errors: string[]) => void} error 
     * @returns {Promise<void>}
     */
    async pinBlogPost(id, next, error) {
        const result = await this.#service.pinBlogPost(id);

        if (!result.success)
            error?.call(this, result.errors);

        next?.call(this);
    }

    /**
     * @param {number} id 
     * @param {() => void} next 
     * @param {(errors: string[]) => void} error 
     * @returns {Promise<void>}
     */
    async publishBlogPost(id, next, error) {
        const result = await this.#service.publishBlogPost(id);

        if (!result.success)
            error?.call(this, result.errors);

        next?.call(this);
    }

    /**
     * 
     * @param {BlogPostDTO} blogPostDTO 
     * @param {(value: BlogPost) => void} next 
     * @param {(errors: string[]|object[]) => void} error 
     * @returns {Promise<void>}
     */
    async publishDraft(blogPostDTO, next, error) {
        const response = await this.#service.publishDraft(blogPostDTO);

        if (!response.success)
            return error?.call(this, response.errors);

        next?.call(this, response.value);
    }

    /**
     * 
     * @param {BlogPostDTO} blogPostDTO 
     * @param {(value: BlogPostSchedule) => void} next 
     * @param {(errors: string[]|object[]) => void} error 
     * @returns {Promise<void>}
     */
    async scheduleDraft(blogPostDTO, next, error) {
        const response = await this.#service.scheduleDraft(blogPostDTO);

        if (!response.success)
            return error?.call(this, response.errors);

        next?.call(this, response.value);
    }

    /**
     * @param {number} id 
     * @param {() => void} next 
     * @param {(errors: string[]) => void} error 
     * @returns {Promise<void>}
     */
    async unhideBlogPost(id, next, error) {
        const result = await this.#service.unhideBlogPost(id);

        if (!result.success)
            error?.call(this, result.errors);

        next?.call(this);
    }

    /**
     * @param {number} id 
     * @param {() => void} next 
     * @param {(errors: string[]) => void} error 
     * @returns {Promise<void>}
     */
    async unpinBlogPost(id, next, error) {
        const result = await this.#service.unpinBlogPost(id);

        if (!result.success)
            error?.call(this, result.errors);

        next?.call(this);
    }

    /**
     * 
     * @param {BlogPostDTO} blogPostDTO 
     * @param {(value: BlogPost) => void} next 
     * @param {(errors: string[]|object[]) => void} error 
     * @returns {Promise<void>}
     */
    async updateBlogPost(blogPostDTO, next, error) {
        const response = await this.#service.updateBlogPost(blogPostDTO);

        if (!response.success)
            return error?.call(this, response.errors);

        next?.call(this, response.value);
    }

    /**
     * 
     * @param {BlogPostDTO} blogPostDTO 
     * @param {(value: BlogPost) => void} next 
     * @param {(errors: string[]|object[]) => void} error 
     * @returns {Promise<void>}
     */
    async saveDraft(blogPostDTO, next, error) {
        const response = blogPostDTO.id
            ? await this.#service.updateDraft(blogPostDTO)
            : await this.#service.postDraft(blogPostDTO);

        if (!response.success)
            return error?.call(this, response.errors);

        next?.call(this, response.value);
    }
}
const blogPostService = new BlogPostService();


/* IMPORT: /js/services/form-validation.service.js */



class FormValidationService {
    validateField(field, errorContainer = null) {
        const validityState = field.validity;

        if (validityState.valid)
            return true;

        if (!errorContainer)
            return false;

        errorContainer.innerHTML = '';

        if (validityState.valueMissing)
            return !!this.#addErrorMessage(errorContainer, field.dataset.errorValueMissing ?? null);
        
        if (validityState.tooShort)
            this.#addErrorMessage(errorContainer, field.dataset.errorTooShort ?? null);
        else if (validityState.tooLong)
            this.#addErrorMessage(errorContainer, field.dataset.errorTooLong ?? null);

        if (validityState.patternMismatch)
            return !!this.#addErrorMessage(errorContainer, field.dataset.errorPatternMismatch ?? null);

        return false;
    }

    #addErrorMessage(container, message) {
        const newError = document.createElement('div');
        newError.classList.add('error');
        newError.innerHTML = message;
        container.appendChild(newError);
    }
}
const formValidationService = new FormValidationService();


/* IMPORT: /js/services/image-gallery.service.js */



/* IMPORT: /js/utilities/emitter.js */




/* IMPORT: /js/models/image-gallery/gallery.model.js */




/* IMPORT: /js/models/image-gallery/gallery.dto.model.js */




/* IMPORT: /js/models/image-gallery/gallery-images.dto.model.js */




/* IMPORT: /js/models/image-gallery/image.model.js */




/* IMPORT: /js/models/image-gallery/image.dto.model.js */




/* IMPORT: /js/services/api/image-gallery-api.service.js */



/* IMPORT: /js/http-client.js */




/* IMPORT: /js/models/image-gallery/gallery.model.js */




/* IMPORT: /js/models/image-gallery/gallery-images.dto.model.js */




/* IMPORT: /js/models/image-gallery/image.model.js */




/* IMPORT: /js/models/image-gallery/image.dto.model.js */




/* IMPORT: /js/models/image-gallery/gallery.dto.model.js */





class ImageGalleryApiService {
    #httpClient;

    constructor() {
        this.#httpClient = httpClient;
    }

    /**
     * @param {number} id 
     * @returns {Promise<([number, Date]|false)>}
     */
    async deleteGallery(id) {
        const response = await this.#httpClient.delete('galleries', id);

        if (!response.success)
            return false;

        if (!response.value)
            throw new Error('Delete failed to return gallery data');

        return [
            Number(response.value.id),
            new Date(response.value.modifiedOn.date + response.value.modifiedOn.timezone)
        ];
    }

    /**
     * @param {number} id 
     * @returns {Promise<([number, Date]|false)>}
     */
    async deleteImage(id) {
        const response = await this.#httpClient.delete('images', id);

        if (!response.success)
            return false;

        if (!response.value)
            throw new Error('Delete failed to return image data');

        return [
            Number(response.value.id),
            new Date(response.value.modifiedOn.date + response.value.modifiedOn.timezone)
        ];
    }

    /**
     * @returns {Promise<(Gallery[]|false)}
     */
    async getGalleries() {
        const response = await this.#httpClient.get('galleries');

        if (!response.success)
            return false;

        if (!response.value)
            return [];

        const galleries = [];
        for (const key in response.value) {
            const gallery = response.value[key];
            galleries.push(new Gallery(gallery));
        }

        return galleries;
    }

    /**
     * @returns {Promise<(Image[]|false)>}
     */
    async getImages() {
        const response = await this.#httpClient.get('images');

        if (!response.success)
            return false;

        if (!response.value)
            return [];

        const images = [];
        for (const key in response.value) {
            const image = response.value[key];
            images.push(new Image(image));
        }

        return images;
    }

    /**
     * @param {GalleryImagesDTO} galleryImagesDTO 
     * @returns {Promise<([Gallery, GalleryImagesDTO, Date]|false)>}
     */
    async patchGallery(galleryImagesDTO ) {
        const response = await this.#httpClient.patch('galleries', galleryImagesDTO);

        if (!response.success)
            return false;

        if (!response.value.gallery)
            throw new Error('Update failed to return gallery data');

        if (!response.value.modifiedOn)
            throw new Error('Update failed to return table modified data');

        return [
            new Gallery(response.value.gallery),
            new GalleryImagesDTO(response.value.removed),
            new Date(response.value.modifiedOn.date + response.value.modifiedOn.timezone)
        ];
    }

    /**
     * @param {ImageDTO} imageDTO 
     * @returns {Promise<([Image, Date]|false)>}
     */
    async patchImage(imageDTO) {
        const response = await this.#httpClient.patch('images', imageDTO);

        if (!response.success)
            return false; // TODO: A notification system should inform the user on failure in these cases

        if (!response.value.image)
            throw new Error('Update failed to return image data');

        if (!response.value.modifiedOn)
            throw new Error('Update failed to return image table modified date');

        return [
            new Image(response.value.image),
            new Date(response.value.modifiedOn.date + response.value.modifiedOn.timezone)
        ];
    }

    /**
     * @param {GalleryDTO} galleryDTO
     * @returns {Promise<([Gallery, Date]|false)>}
     */
    async postGallery(galleryDTO) {
        const response = await this.#httpClient.post('galleries', galleryDTO);

        if (!response.success)
            return false;

        if (!response.value.gallery)
            throw new Error('Create failed to return gallery data');

        if (!response.value.modifiedOn)
            throw new Error('Create failed to return gallery table modified date');

        return [
            new Gallery(response.value.gallery),
            new Date(response.value.modifiedOn.date + response.value.modifiedOn.timezone)
        ];
    }

    /**
     * @param {Object} data 
     * @returns {Promise<([Image, Date]|false)>}
     */
    async postImage(data) {
        const response = await this.#httpClient.post('images', data);

        if (!response.success)
            return false; // TODO: Notification

        if (!response.value.image)
            throw new Error('Create failed to return image data');

        if (!response.value.modifiedOn)
            throw new Error('Create failed to return table modified date');

        return [
            new Image(response.value.image),
            new Date(response.value.modifiedOn.date + response.value.modifiedOn.timezone)
        ];
    }

    /**
     * @param {GalleryDTO} galleryDTO
     * @returns {Promise<([Gallery, Date]|false)>}
     */
    async putGallery(galleryDTO) {
        const response = await this.#httpClient.put('galleries', galleryDTO);

        if (!response.success)
            return false;

        if (!response.value.gallery)
            throw new Error('Create failed to return gallery data');

        if (!response.value.modifiedOn)
            throw new Error('Create failed to return table modified date');

        return [
            new Gallery(response.value.gallery),
            new Date(response.value.modifiedOn.date + response.value.modifiedOn.timezone)
        ];
    }
}
const imageGalleryApiService = new ImageGalleryApiService();


/* IMPORT: /js/services/api/table-modified-api.service.js */



/* IMPORT: /js/http-client.js */





class TableModifiedApiService {
    #httpClient;

    constructor() {
        this.#httpClient = httpClient;
    }

    /**
     * @param {String} table 
     * @returns {Promise<(Date|false)>}
     */
    async #getModifiedDate(table) {
        const response = await this.#httpClient.get('modified', table);

        if (!response.success)
            return false;

        if (response.value)
            response.value = new Date(response.value.date + response.value.timezone);

        return response.value;
    }

    async getGalleryDate() {
        return await this.#getModifiedDate('gallery');
    }

    async getGalleryImageDate() {
        return await this.#getModifiedDate('gallery_image');
    }

    async getImageDate() {
        return await this.#getModifiedDate('image');
    }
}
const tableModifiedApiService = new TableModifiedApiService();



class ImageGalleryService {
    #initialized = false;
    #galleryImageModified = new Date(0);
    #galleryModified = new Date(0);
    #imageModified = new Date(0);
    #galleries = new Emitter([]);
    #images = new Emitter([]);

    constructor() {
        this.#fetchImageData().then(() => {
            this.#initialized = true;
        });
    }

    /** @returns {Date} */
    get galleryImageModified() { return new Date(this.#galleryImageModified); }
    /** @returns {Date} */
    get galleryModified() { return new Date(this.#galleryModified); }
    /** @returns {Date} */
    get imageModified() { return new Date(this.#imageModified); }
    /** @returns {Emitter} */
    get galleries() { return this.#galleries; }
    /** @returns {Emitter} */
    get images() { return this.#images; }

    async #fetchImageData() {
        const galleryImageModified = await tableModifiedApiService.getGalleryImageDate();
        const galleryModified = await tableModifiedApiService.getGalleryDate();
        const imageModified = await tableModifiedApiService.getImageDate();

        let images;
        let galleries;

        if (imageModified > this.#imageModified || galleryImageModified > this.#galleryImageModified) {
            this.#imageModified = imageModified;
            images = await imageGalleryApiService.getImages();
        }

        if (galleryModified > this.#galleryModified || galleryImageModified > this.#galleryImageModified) {
            this.#galleryModified = galleryModified;
            galleries = await imageGalleryApiService.getGalleries();
        }

        if (images)
            this.#images.setValue(images);

        if (galleries)
            this.#galleries.setValue(galleries);
    }
    
    /** 
     * @param {GalleryDTO} galleryDTO
     * @returns {Promise<boolean>}
     */
    async createGallery(galleryDTO) {
        const result = await imageGalleryApiService.postGallery(galleryDTO);

        if (!result)
            throw new Error('No result received from createGallery');

        const [ gallery, modifiedOn ] = result;

        this.#galleryModified = modifiedOn;
        const galleries = [...this.#galleries.getValue(), gallery];
        this.#galleries.setValue(galleries);

        return true;
    }

    /**
     * @param {Object} data 
     * @returns {Promise<boolean>}
     */
    async createImage(data) {
        const result = await imageGalleryApiService.postImage(data);

        if (!result)
            throw new Error('No result received from createImage');

        const [ image, modifiedOn ] = result;

        this.#imageModified = modifiedOn;
        const images = [...this.#images.getValue(), image];
        this.#images.setValue(images);

        return true;
    }

    /**
     * @param {Number} id 
     * @returns {Promise<boolean>}
     */
    async deleteGallery(id) {
        const result = await imageGalleryApiService.deleteGallery(id);

        if (!result)
            throw new Error('No result received in deleteGallery');

        const [ deletedId, modifiedOn ] = result;

        this.#galleryModified = modifiedOn;

        if (deletedId !== id)
            throw new Error('Id in deleteGallery request and response do not match');

        const galleries = this.#galleries.getValue().filter(g => g.id !== deletedId);
        this.#galleries.setValue(galleries);

        return true;
    }

    /**
     * @param {Number} id 
     * @returns {Promise<boolean>}
     */
    async deleteImage(id) {
        const result = await imageGalleryApiService.deleteImage(id);

        if (!result)
            throw new Error('No result received in deleteImage');

        const [ deletedId, modifiedOn ] = result;

        this.#imageModified = modifiedOn;

        if (deletedId !== id)
            throw new Error('Id in deleteImage request and response do not match');

        const images = this.#images.getValue().filter(i => i.id !== deletedId);
        this.#images.setValue(images);

        return true;
    }

    /**
     * @param {number} id 
     * @param {(value: Gallery) => void} next 
     */
    getGallery(id, next) {
        if (this.#initialized) {
            next.call(this, this.#galleries.getValue().find(g => g.id === id));
            return;
        }

        this.#galleries.first({
            next: value => next.call(this, value.find(g => g.id === id))
        });
    }

    /**
     * @param {number} id 
     * @returns {Image}
     */
    getImage(id) {
        return this.#images.getValue().find(i => i.id === id);
    }

    /**
     * @param {number} id 
     * @param {(value: Image) => void} next 
     */
    getImageCallback(id, next) {
        if (this.#initialized) {
            next.call(this, this.#images.getValue().find(i => i.id === id));
            return;
        }

        this.#images.first({
            next: value => next.call(this, value.find(i => i.id === id))
        });
    }

    /** @param {(value: Image[]) => void} next */
    getImages(next) {
        if (this.#initialized) {
            next.call(this, this.#images.getValue());
            return;
        }
        
        this.#images.first({
            next: value => next.call(this, value)
        });
    }
    
    /** 
     * @param {GalleryDTO} galleryDTO
     * @returns {Promise<boolean>}
     */
    async updateGallery(galleryDTO) {
        const result = await imageGalleryApiService.putGallery(galleryDTO);

        if (!result)
            throw new Error('No result received in updateGallery');

        const [ gallery, modifiedOn ] = result;

        this.#galleryModified = modifiedOn;

        const index = this.#galleries.getValue().findIndex(g => g.id === gallery.id);
        this.#galleries.setValue(gallery, index);

        return true;
    }

    /**
     * @param {number} galleryId 
     * @param {number[]} imageIds 
     * @returns {Promise<boolean>}
     */
    async updateGalleryImages(galleryId, imageIds) {
        if (Number.isInteger(galleryId) === false || galleryId < 1)
            throw new Error('Gallery ID is not a valid integer');

        imageIds.forEach((imageId, index) => {
            if (Number.isInteger(imageId) === false || imageId < 1)
                throw new Error(`Image ID at index ${index} is not a valid integer`);
        });

        const galleryImagesDTO = new GalleryImagesDTO({galleryId, imageIds});

        const result = await imageGalleryApiService.patchGallery(galleryImagesDTO);

        if (!result)
            throw new Error('No result received in updateGalleryImages');

        const [ gallery, removed, modifiedOn ] = result;

        this.#galleryImageModified = modifiedOn;

        const index = this.#galleries.getValue().findIndex(g => g.id === gallery.id);
        this.#galleries.setValue(gallery, index);

        /** @type Image[] */
        const images = [...this.#images.getValue()];
        for (const image of images) {
            if (removed.imageIds.find(iId => iId === image.id))
                image.galleryIds = image.galleryIds.filter(gId => gId !== gallery.id);

            if (gallery.imageIds.find(iId => iId === image.id) && image.galleryIds.every(gId => gId !== gallery.id))
                image.galleryIds.push(gallery.id);
        }
        this.#images.setValue(images);

        return true;
    }

    /**
     * @param {ImageDTO} imageDTO 
     * @returns {Promise<boolean>}
     */
    async updateImage(imageDTO) {
        const result = await imageGalleryApiService.patchImage(imageDTO);

        if (!result)
            throw new Error('No result received in updateImage');

        const [ image, modifiedOn ] = result;
        
        this.#imageModified = modifiedOn;

        const index = this.#images.getValue().findIndex(i => i.id === image.id);
        this.#images.setValue(image, index);

        return true;
    }
}
const imageGalleryService = new ImageGalleryService();


/* IMPORT: /js/services/session.service.js */



/* IMPORT: /js/utilities/emitter.js */




/* IMPORT: /js/models/user/user.model.js */




/* IMPORT: /js/services/api/session-api.service.js */



/* IMPORT: ../../http-client.js */




/* IMPORT: ../../models/user/user.model.js */




/* IMPORT: ../../models/user/user-login-request.model.js */




/* IMPORT: ../../models/user/user-login-response.model.js */





class SessionApiService {
    #httpClient;

    constructor() {
        this.#httpClient = httpClient;
    }

    async getStatus() {
        const response = await this.#httpClient.get('session/status');

        if (!response.success)
            return false;

        return response.value;
    }

    /** @returns {Promise<{success: boolean, value: User}>} */
    async getUser() {
        const response = await this.#httpClient.get('session/user');

        if (!response.success)
            return response;

        if (response.value)
            response.value = new User(response.value);

        return response;
    }

    async login(formData) {
        const response = await this.#httpClient.post('session/login', new UserLoginRequest(formData));

        if (!response.success)
            return response;

        response.value = new UserLoginResponse(response.value);

        return response;
    }

    async logout() {
        const response = await this.#httpClient.post('session/logout');

        return response;
    }

}
const sessionApiService = new SessionApiService();


/* IMPORT: /js/constants/meta-constants.js */




/* IMPORT: /js/enums/user-role.enum.js */




/* IMPORT: /js/enums/user-permission.enum.js */





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


/* IMPORT: /js/services/undo-management.service.js */



/* IMPORT: ../models/selection-data.model.js */




/* IMPORT: ../models/undo-data.model.js */





class UndoManagementService {
    /** @type {Map<HTMLElement, UndoData[]>} */
    #undoHistories = new Map();
    /** @type {Map<HTMLElement, UndoData[]>} */
    #redoHistories = new Map();
    /** @type {String} */
    #savedInnerHTML;
    /** @type {SelectionData} */
    #savedSelectionData;

    /**
     * Add an undo restore point and clear redo restore points
     * 
     * @param {HTMLElement} container The root element of the editable content
     * @param {Boolean} useSaved Whether to use the data saved with the saveData function
     */
    add(container, useSaved = false) {
        this.#undoHistories[container] ??= [];
        this.#redoHistories[container] = [];
        this.#addTo(this.#undoHistories[container], container, useSaved);
    }

    /**
     * Clear restore points for chosen container
     * @param {HTMLElement} container The root elemment of the editable content
     */
    clear(container) {
        this.#undoHistories[container] = [];
        this.#redoHistories[container] = [];
        this.#savedInnerHTML = '';
        this.#savedSelectionData = null;
    }

    /**
     * Undo the latest change
     * 
     * @param {HTMLElement} container The root element of the editable content
     */
    undo(container) {
        this.#redoHistories[container] ??= [];
        this.#restore(
            this.#undoHistories[container],
            this.#redoHistories[container],
            container
        );
    }


    /**
     * Redo the latest undo, if still available
     * 
     * @param {HTMLElement} container The root element of the editable content
     */
    redo(container) {
        this.#undoHistories[container] ??= [];
        this.#restore(
            this.#redoHistories[container],
            this.#undoHistories[container],
            container
        );
    }

    /**
     * Save a preliminary undo restore point, for use with add(..useSaved = true)
     * 
     * @param {HTMLElement} container 
     * @param {SelectionData} selectionData 
     */
    saveData(container, selectionData) {
        this.#savedInnerHTML = container.innerHTML;
        this.#savedSelectionData = selectionData;
    }

    /**
     * Add a restore point to a provided list
     * 
     * @param {UndoData[]} list 
     * @param {HTMLElement} container 
     * @param {Boolean} useSaved 
     */
    #addTo(list, container, useSaved) {
        const innerHTML = useSaved
            ? this.#savedInnerHTML
            : container.innerHTML;
        const selectionData = useSaved
            ? this.#savedSelectionData
            : new SelectionData(window.getSelection());
        const node = selectionData.isCollapsed
            ? selectionData.startNode
            : selectionData.endNode;
        const offset = selectionData.isCollapsed
            ? selectionData.startOffset
            : selectionData.endOffset;
        const route = this.#getRoute(container, node);
        
        const undo = new UndoData({innerHTML, route, offset});

        if (list.length > 29)
            list.shift();

        list.push(undo);
    }

    /**
     * Generates and returns instructions for how to navigate from the start node
     * to its target descendant
     * 
     * @param {HTMLElement} start 
     * @param {Node} target 
     * @param {Number[]} route 
     * @returns {Number[]}
     */
    #getRoute(start, target, route = []) {
        let num = 0;

        for (const child of start.childNodes) {
            if (child === target) {
                route.push(num);
                return route;
            }

            if (child.contains(target)) {
                route.push(num);
                return this.#getRoute(child, target, route);
            }

            num++;
        }

        route.push(0);
        return route;
    }

    /**
     * Consume a restore point from one list after adding one to another
     * 
     * @param {UndoData[]} sourceList 
     * @param {UndoData[]} targetList 
     * @param {HTMLElement} container 
     */
    #restore(sourceList, targetList, container) {
        if (!sourceList?.length)
            return;

        this.#addTo(targetList, container, false);

        const undo = sourceList.pop();
        container.innerHTML = undo.innerHTML;

        const node = this.#traceRoute(container, undo.route);
        window.getSelection().setPosition(node, undo.offset);
    }

    /**
     * Uses the route data to navigate to and return a target node
     * 
     * @param {HTMLElement} start 
     * @param {Number[]} route 
     * @returns {Node}
     */
    #traceRoute(start, route) {
        const target = route.shift();

        if (target === undefined || target < 0)
            throw new Error('Invalid route');

        const node = Array.from(start.childNodes)[target];

        if (route.length === 0)
            return node;

        return this.#traceRoute(node, route);
    }

}
const undoManagementService = new UndoManagementService();


/* IMPORT: /js/services/api/blog-post-api.service.js */




/* IMPORT: /js/services/api/configuration-api.service.js */



/* IMPORT: ../../http-client.js */





class ConfigurationApiService {
    #httpClient;

    constructor() {
        this.#httpClient = httpClient;
    }

    async createConfigurations(configs) {
        const response = await this.#httpClient.post('configuration', configs);

        return response;
    }

    async updateConfigurations(configs) {
        const response = await this.#httpClient.patch('configuration', configs);

        return response;
    }
}
const configurationApiService = new ConfigurationApiService();


/* IMPORT: /js/services/api/image-gallery-api.service.js */




/* IMPORT: /js/services/api/session-api.service.js */




/* IMPORT: /js/services/api/table-modified-api.service.js */




/* IMPORT: /js/services/api/user-api.service.js */



/* IMPORT: ../../http-client.js */




/* IMPORT: ../../models/user/user.model.js */





class UserApiService {
    #httpClient;

    constructor() {
        this.#httpClient = httpClient;
    }
}
const userApiService = new UserApiService();

/* Custom elements */


/* IMPORT: /js/custom-elements/date-time.element.js */



/* IMPORT: /js/utilities/format-date.utility.js */



class DateTimeElement extends HTMLElement {
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


/* IMPORT: /js/custom-elements/fullscreen-image.element.js */



const fullscreenImageTag = 'fullscreen-image';

class FullscreenImageElement extends HTMLElement {
    /** @type {HTMLElement} */ #imageWrapper;
    /** @type {() => void} */ #onClose;

    constructor() {
        const component = super();
    }

    connectedCallback() {
        this.toggleAttribute('hidden', true);
        const shadow = this.attachShadow({ mode: 'open' });

        const fullscreenContainer = document.createElement('fullscreen-container');
        shadow.appendChild(fullscreenContainer);

        const btnClose = document.createElement('button');
        const targetSymbol = document.querySelector('#svg-close');

        if (targetSymbol) {
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('viewBox', targetSymbol.getAttribute('viewBox'));
            svg.setAttribute('width', '2em');
            svg.setAttribute('height', '2em');
            svg.setAttribute('fill', 'currentColor');
            svg.innerHTML = targetSymbol.innerHTML;
            btnClose.appendChild(svg);
        }
        else
            btnClose.textContent = 'Close';

        fullscreenContainer.appendChild(btnClose);
        btnClose.addEventListener('click', () => this.close());

        this.#imageWrapper = document.createElement('image-wrapper');
        fullscreenContainer.appendChild(this.#imageWrapper);

        const baseCSS = new CSSStyleSheet();
        baseCSS.replaceSync(`
            fullscreen-container {
                display: block;
                position: fixed;
                inset: 0;
                background-color: #000;
                z-index: 9999;
            }

            button {
                position: absolute;
                inset: 0 0 auto auto;
                border: none;
                background: transparent;
                font-size: 2rem;
                color: #fff;
                cursor: pointer;

                &:hover {
                    color: var(--clr-primary);
                }
            }

            image-wrapper {
                display: flex block;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: calc(100% - 4rem);
                margin-block: 2rem;
            }

            img {
                max-height: 100%;
                max-width: 100%;
            }
        `);
        shadow.adoptedStyleSheets.push(baseCSS);
    }

    connectedMoveCallback() {}

    disconnectedCallback() {}

    /** 
     * @param {HTMLImageElement} img 
     * @param {() => void} [onClose=null] 
     */
    show(img, onClose = null) {
        this.#onClose = onClose;
        /** @type {HTMLImageElement} */
        const clone = img.cloneNode();
        clone.removeAttribute('style');
        this.#imageWrapper.replaceChildren(clone);
        this.toggleAttribute('hidden', false);
    }

    close() {
        this.toggleAttribute('hidden', true);
        this.#onClose?.call(this);
        this.#onClose = null;
    }
}

customElements.define(fullscreenImageTag, FullscreenImageElement);

/** @type {FullscreenImageElement} */
const fullscreenImage = document.createElement(fullscreenImageTag);
document.querySelector('body')?.appendChild(fullscreenImage);


/* IMPORT: /js/custom-elements/img-gallery.element.js */



/* IMPORT: /js/constants/meta-constants.js */




/* IMPORT: /js/custom-elements/fullscreen-image.element.js */




/* IMPORT: /js/services/image-gallery.service.js */



const imgGalleryTag = 'img-gallery';

class ImgGalleryElement extends HTMLElement {
    static observedAttributes = [
        'gallery-id',
        'aspect-ratio',
        'width',
        'transition-time',
        'wait-time'
    ];

    /** @type {ImgGalleryElement} */ #self;
    #service;
    #listener;

    /** @type {ShadowRoot} */ #shadow;
    /** @type {HTMLElement} */ #galleryContainer;
    /** @type {HTMLElement} */ #slideContainer;

    /** @type {number} */ #galleryId;
    /** @type {number} */ #waitTime;

    /** @type {string} */ static #defaultAspectRatio = '1';
    /** @type {number} */ static #defaultTransitionTime = 2000;
    /** @type {number} */ static #defaultWaitTime = 2000;
    /** @type {string} */ static #defaultWidth = '75%';

    /** @type {boolean} */ #isHovered;
    /** @type {boolean} */ #isFocused;
    /** @type {boolean} */ #isFullscreen;
    /** @type {boolean} */ #isSliding;
    /** @type {number} */ #timeoutId;

    #cssBase = new CSSStyleSheet();
    #cssAspectRatio = new CSSStyleSheet();
    #cssTransitionTime = new CSSStyleSheet();
    #cssWaitTime = new CSSStyleSheet();
    #cssWidth = new CSSStyleSheet();

    #transitionTimeout;

    constructor() {
        const element = super();
        this.#self = element;
        this.#service = imageGalleryService;
    }

    /**
     * @param {string} name 
     * @param {string} _ Old value
     * @param {string} newValue 
     */
    attributeChangedCallback(name, _, newValue) {
        switch (name) {
            case 'gallery-id':
                if (this.#galleryId === undefined)
                    return;

                this.#processGalleryId(newValue);
                return;

            case 'aspect-ratio':
                this.#processAspectRatio(newValue);
                return;

            case 'width':
                this.#processWidth(newValue);
                return;

            case 'transition-time':
                this.#processTransitionTime(newValue);
                return;

            case 'wait-time':
                this.#processWaitTime(newValue);
                return;
        }
    }

    connectedCallback() {
        const self = this.#self;

        this.#shadow = self.attachShadow({ mode: 'open' });
        this.#shadow.adoptedStyleSheets = [
            this.#cssBase,
            this.#cssAspectRatio,
            this.#cssTransitionTime,
            this.#cssWaitTime,
            this.#cssWidth
        ];
        
        this.#galleryContainer = document.createElement('gallery-container');
        this.#galleryContainer.contentEditable = 'false';
        this.#galleryContainer.tabIndex = 0;

        this.#slideContainer = document.createElement('image-container');

        const btnPrev = document.createElement('button');
        btnPrev.textContent = '<';
        btnPrev.classList.add('prev');
        btnPrev.title = 'Previous';
        btnPrev.ariaLabel = 'Previous image';
        btnPrev.addEventListener('click', () => this.#prev());

        const btnNext = document.createElement('button');
        btnNext.textContent = '>';
        btnNext.classList.add('next');
        btnNext.title = 'Next';
        btnNext.ariaLabel = 'Next image';
        btnNext.addEventListener('click', () => this.#next());

        this.#galleryContainer.replaceChildren(btnPrev, this.#slideContainer, btnNext);

        this.#shadow.appendChild(this.#galleryContainer);

        this.#processGalleryId(self.getAttribute('gallery-id'));
        this.setupDefaults();

        this.#listener = this.#service.galleries.subscribe({
            nextIndexed: (_, gallery) => {
                if (gallery.id !== this.#galleryId)
                    return;

                this.#galleryContainer.ariaLabel = gallery.title;
                this.#galleryContainer.ariaDescription = gallery.description;
                this.#fillImages(gallery.imageIds);
            }
        });

        this.#galleryContainer.addEventListener('mouseenter', () => {
            this.#isHovered = true;
            clearTimeout(this.#timeoutId);
        });
        this.#galleryContainer.addEventListener('focusin', () => {
            this.#isFocused = true;
            clearTimeout(this.#timeoutId);
        });

        this.#galleryContainer.addEventListener('mouseleave', () => {
            this.#isHovered = false;
            this.#scheduleTransition();
        });
        this.#galleryContainer.addEventListener('focusout', () => {
            this.#isFocused = false;
            this.#scheduleTransition();
        });

        this.#galleryContainer.addEventListener('animationend', () => {
            this.#isSliding = false;
            this.#scheduleTransition()
        });

        this.#galleryContainer.addEventListener('keydown', event => {
            if (event.ctrlKey || event.altKey || event.shiftKey || event.metaKey)
                return;

            switch (event.key) {
                case 'ArrowLeft':
                    event.preventDefault();
                    event.stopPropagation();
                    btnPrev.click();
                    return;

                case 'ArrowRight':
                    event.preventDefault();
                    event.stopPropagation();
                    btnNext.click();
                    return;
            }
        });

        this.#cssBase.replaceSync(`
            gallery-container {
                display: block;
                position: relative;
                margin-block: 1em;
                border-radius: var(--size-xs);
                max-width: 90%;
                overflow: hidden;
            }

            image-container {
                display: block flex;
                width: 100%;
                height: 100%;
                position: relative;
                align-items: center;
                overflow: hidden;
                z-index: 1;
            }

            gallery-container:not(:hover, :focus) button {
                display: none;
            }

            button {
                position: absolute;
                top: 0;
                bottom: 0;
                width: 2rem;
                z-index: 3;
            }
            
            .prev {
                left: 0;
            }

            .next {
                right: 0;
            }

            .image-container > * {
                position: relative;
                z-index: 1;
            }

            img {
                height: 100%;
                object-fit: cover;
                cursor: pointer;
            }

            .cover {
                transform: translateX(-100%);
            }

            .cover,
            .slide-in,
            .slide-out {
                z-index: 2;
            }
                
            @keyframes slide-in {
                from { transform: translateX(0); }
                to { transform: translateX(-100%); }
            }

            @keyframes slide-out {
                from { transform: translateX(-100%); }
                to { transform: translateX(0); }
            }
        `);
    }

    connectedMoveCallback() {}

    disconnectedCallback() {
        this.#listener.unsubscribe();
    }

    /** 
     * @param {number[]} imageIds  
     * @param {HTMLElement} container
     */
    #fillImages(imageIds) {
        const container = this.#slideContainer;
        container.textContent = '';

        for (let i = 0; i < imageIds.length; i++) {
            const imageId = imageIds[i];

            const image = this.#service.getImage(imageId);
            const img = document.createElement('img');
            img.src = imageGalleryPath + image.filename;
            img.ariaLabel = image.title;
            img.title = image.title;
            img.alt = image.description;
            img.ariaDescription = image.description;
            container.appendChild(img);

            if (i === 1)
                img.classList.add('slide-in');

            img.addEventListener('click', () => {
                clearTimeout(this.#timeoutId);
                this.#isFullscreen = true;
                
                fullscreenImage.show(img, () => {
                    this.#isFullscreen = false;
                    this.#scheduleTransition();
                });
            });
        }
    }

    #next() {
        const container = this.#slideContainer;

        if (container.childElementCount < 2)
            return;

        if (this.#isSliding)
            return;

        this.#isSliding = true;
        
        container.appendChild(container.firstElementChild);
        container.firstElementChild.classList.value = '';
        container.firstElementChild.nextElementSibling.classList.value = 'slide-in';
    }

    #prev() {
        const container = this.#slideContainer;

        if (container.childElementCount < 2)
            return;

        if (this.#isSliding)
            return;

        this.#isSliding = true;

        const nextSibling = container.firstElementChild.nextElementSibling;
        nextSibling.classList.value = 'slide-out';

        nextSibling.addEventListener('animationend', event => {
            event.stopPropagation();
            this.#isSliding = false;
            
            nextSibling.classList.value = '';
            container.prepend(container.lastElementChild);
            container.firstElementChild.nextSibling.classList.value = 'cover';
        }, { once: true });
    }

    /** @param {string} value  */
    #processAspectRatio(value) {
        const aspectRatio = value?.match(/^\d+(?:\/\d+)?$/)
            ?.at(0)
            ?? ImgGalleryElement.#defaultAspectRatio;

        this.#cssAspectRatio.replaceSync(`
            gallery-container {
                aspect-ratio: ${aspectRatio};
            }

            img {
                aspect-ratio: ${aspectRatio};
            }
        `);
    }

    /** @param {string} value  */
    #processGalleryId(value) {
        this.#galleryId = Number(value ?? 0);

        this.#service.getGallery(this.#galleryId, gallery => {
            this.#galleryContainer.ariaLabel = gallery.title;
            this.#galleryContainer.ariaDescription = gallery.description;

            this.#fillImages(gallery.imageIds);
        });
    }

    /** @param {string} value  */
    #processTransitionTime(value) {
        let transitionTime = this.#durationStringToMilliseconds(value);

        if (transitionTime < 0)
            transitionTime = ImgGalleryElement.#defaultTransitionTime;

        clearTimeout(this.#transitionTimeout);

        this.#transitionTimeout = setTimeout(() => {
            this.#cssTransitionTime.replaceSync(`
                .slide-in {
                    animation: slide-in ${transitionTime}ms forwards;
                }

                .slide-out {
                    animation: slide-out ${transitionTime}ms forwards;
                }
            `);
        }, this.#waitTime);
    }

    /** @param {string} value  */
    #processWaitTime(value) {
        const milliseconds = this.#durationStringToMilliseconds(value)
        
        if (milliseconds < 0) {
            this.#waitTime = ImgGalleryElement.#defaultWaitTime;
            return;
        }

        this.#waitTime = milliseconds;
    }

    /** @param {string} value  */
    #processWidth(value) {
        const match = value?.toLowerCase()
            .match(/^(\d+)([a-z]*|%)$/);

        const width = match[0]
            ? (match[1] + ( match[2] ? match[2] : 'px' ) )
            : null;

        this.#cssWidth.replaceSync(`
            gallery-container {
                width: ${width ?? ImgGalleryElement.#defaultWidth};
            }
        `);
    }

    #scheduleTransition() {
        if (this.#isHovered || this.#isFocused || this.#isFullscreen)
            return;

        this.#timeoutId = setTimeout(() => this.#next(), this.#waitTime);
    }

    setupDefaults() {
        const self = this.#self;

        if (!self.hasAttribute('aspect-ratio'))
            this.#processAspectRatio(null);
        if (!self.hasAttribute('width'))
            this.#processWidth(null);
        if (!self.hasAttribute('wait-time'))
            this.#processWaitTime(null);
        if (!self.hasAttribute('transition-time'))
            this.#processTransitionTime(null);
    }

    /**
     * @param {string|null} timeString 
     * @returns {number}
     */
    #durationStringToMilliseconds(timeString) {
        if (!timeString)
            return -1;

        const match = timeString.toLowerCase().match(/^(\d+)(?:(?:(?:\.\d+)?s)|(ms))$/);

        if (!match)
            return -1;

        if (match[2]) return match[1];

        return 1000 * Number(match[0].substring(0, match[0].length - 1));
    }
}

customElements.define(imgGalleryTag, ImgGalleryElement);


/* IMPORT: /js/custom-elements/img-wrapper.element.js */



/* IMPORT: /js/constants/meta-constants.js */




/* IMPORT: /js/custom-elements/fullscreen-image.element.js */




/* IMPORT: /js/services/image-gallery.service.js */



const imgWrapperTag = 'img-wrapper';

class ImgWrapperElement extends HTMLElement {
    static observedAttributes = [
        'image-id',
        'aspect-ratio',
        'width',
        'height',
        'fullscreen-click'
    ];

    /** @type {ImgWrapperElement} */ #self;
    #service;
    #listener;

    /** @type {number} */ #imageId;

    /** @type {ShadowRoot} */ #shadow;
    #image;

    constructor() {
        const element = super();
        this.#service = imageGalleryService;

        this.#self = element;
        this.#shadow = element.attachShadow({ mode: 'open'});
        this.#image = document.createElement('img');

        this.#showInFullscreen = this.#showInFullscreen.bind(this);
    }

    /**
     * @param {string} name 
     * @param {string} _ Old value
     * @param {string} newValue 
     */
    attributeChangedCallback(name, _, newValue) {
        switch (name) {
            case 'image-id':
                this.#processImageId(newValue);
                return;

            case 'aspect-ratio':
                this.#processAspectRatio(newValue);
                return;

            case 'width':
                this.#processSize(newValue, 'width');
                return;

            case 'height':
                this.#processSize(newValue, 'height');
                return;

            case 'fullscreen-click':
                this.#processFullscreenClick(newValue);
                return;
        }

        if (this.#image.getAttribute('style') === '')
            this.#image.removeAttribute('style');
    }

    connectedCallback() {
        this.#listener = this.#service.images.subscribe({
            nextIndexed: (_, image) => {
                if (image.id === this.#imageId)
                    this.#fillImageData(image);
            }
        });
    }

    connectedMoveCallback() {}

    disconnectedCallback() {
        this.#listener.unsubscribe();
    }

    /**
     * @param {{filename: string, title: string, description: string}} source 
     */
    #fillImageData(source) {
        if (!source) {
            // TODO: Make a "missing image" style icon for both this and the gallery instead of text
            this.#shadow.appendChild(document.createTextNode(`Invalid Image ID: ${this.#imageId}`));
            return;
        }

        const img = this.#image;

        img.src = imageGalleryPath + source.filename;
        img.ariaLabel = source.title;
        img.title = source.title;
        img.alt = source.description;
        img.ariaDescription = source.description;

        this.#shadow.replaceChildren(this.#image);
    }

    /** @param {string} value  */
    #processImageId(value) {
        this.#imageId = Number(value ?? 0);

        this.#service.getImageCallback(this.#imageId, image => this.#fillImageData(image));
    }

    /** @param {string} value  */
    #processAspectRatio(value) {
        const aspectRatio = value?.match(/^\d+(?:\/\d+)?$/)
            ?.at(0);

        this.#image.style.aspectRatio = aspectRatio ?? null;
        this.#image.style.objectFit = aspectRatio ? 'cover' : null;
    }

    /** @param {string} value */
    #processFullscreenClick(value) {
        const active = ['', 'true', 'yes', '1'].includes(value.toLowerCase());

        this.#image.style.cursor = active ? 'pointer' : null;

        if (active)
            this.#image.addEventListener('click', this.#showInFullscreen);
        else
            this.#image.addEventListener('click', this.#showInFullscreen);
    }

    /**
     * @param {string} value
     * @param {('width'|'height')} property
    */
    #processSize(value, property) {
        const match = value?.toLowerCase()
            .match(/^(\d+)([a-z]*|%)$/);

        if (match?.at(0) == undefined) {
            this.#image.style.removeProperty(property);
            return;
        }

        const size = match[1] + ( match[2] ? match[2] : 'px' );

        this.#image.style.setProperty(property, size);
    }

    #showInFullscreen = () => {
        fullscreenImage.show(this.#image);
    }
}

customElements.define(imgWrapperTag, ImgWrapperElement);


/* IMPORT: /js/custom-elements/input-file.element.js */

class InputFileElement extends HTMLElement {
    /** @type {InputFileElement} */
    #self;
    #buttonAttributes = [ 'title' ];
    #fileInputAttributes = [ 'name', 'accept', 'required' ];
    /** @type {HTMLInputElement} */
    #input;

    constructor() {
        const component = super();
        this.#self = component;
    }

    connectedCallback() {
        const self = this.#self;
        const shadow = self.attachShadow({ mode: 'open' });
        const text = self.textContent;
        self.textContent = '';

        const input = document.createElement('input');
        this.#input = input;
        input.type = 'file';
        input.style.display = 'none';
        for (const attribute of this.#fileInputAttributes)
            self.hasAttribute(attribute) && input.setAttribute(attribute, self.getAttribute(attribute));

        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = text;
        for (const attribute of this.#buttonAttributes) {
            self.hasAttribute(attribute) && button.setAttribute(attribute, self.getAttribute(attribute));
            self.removeAttribute(attribute);
        }
        button.addEventListener('click', () => input.click());

        self.appendChild(input);
        shadow.appendChild(button);
    }

    disconnectedCallback() {}

    connectedMoveCallback() {}

    /** @returns {FileList} */
    get files() { return this.#input.files; }

    /** @returns {string} */
    get value() { return this.#input.value; }

    /** @returns {string} */
    get defaultValue() { return this.#input.defaultValue; }

    /** @returns {boolean} */
    checkValidity() { return this.#input.checkValidity(); }
}

customElements.define('input-file', InputFileElement);

/* Components */


/* IMPORT: /js/components/account-menu-component.js */



/* IMPORT: /js/services/session.service.js */



class AccountMenuComponent extends HTMLElement {
    /** @type {HTMLFormElement} */ #form;
    /** @type {NodeListOf<HTMLInputElement>} */ #inputs;
    /** @type {HTMLButtonElement} */ #loginButton;
    /** @type {HTMLDivElement} */ #errorContainer;

    constructor() { super(); }

    connectedCallback() {
        const toggle = this.querySelector('#account-menu-toggle');
        const accountMenu = this.querySelector('account-menu');
        const menuLoggedOut = accountMenu.querySelector('[menu-logged-out]');
        const menuLoggedIn = accountMenu.querySelector('[menu-logged-in]');
        this.#form = accountMenu.querySelector('form');

        toggle.addEventListener('click', (event) => {
            event.preventDefault();
            accountMenu.toggleAttribute('hidden');
        });

        accountMenu.querySelector('.account-menu__logout').addEventListener('click',
            (event) => {
                event.preventDefault();
                sessionService.logout();
            }
        );

        sessionService.isLoggedIn.subscribe({
            next: value => {
                menuLoggedIn.toggleAttribute('hidden', !value);
                menuLoggedOut.toggleAttribute('hidden', !!value);
            }
        });

        this.#loginFormSetup();
    }

    connectedMoveCallback() {}

    disconnectedCallback() {}

    /**
     * @param {HTMLElement} element 
     * @param {string} message 
     */
    #addErrorMessage(element, message) {
        const newError = document.createElement('div');
        newError.classList.add('error');
        newError.innerHTML = message;
        element.appendChild(newError);
    }

    /** @param {HTMLInputElement} inputField */
    #clearErrorStatus(inputField) {
        inputField.classList.remove('error');

        if (inputField.nextElementSibling?.hasAttribute('input-errors'))
            inputField.nextElementSibling.innerHTML = '';
    }

    async login() {
        this.#loginButton.disabled = true;
        this.#errorContainer.textContent = '';
        const formData = new FormData(this.#form);

        const response = await sessionService.login(formData);

        if (response.success) {
            this.#form.reset();
            return;
        }

        this.#errorContainer.innerHTML = '';
        response.errors.forEach(
            error => this.#addErrorMessage(this.#errorContainer, error)
        );
    }

    #loginFormSetup() {
        const form = this.#form;
        this.#inputs = form.querySelectorAll('[pattern]');
        this.#loginButton = form.querySelector('[type="submit"]');
        this.#errorContainer = form.querySelector('#login-errors');

        let disableInput = false;
        this.#inputs.forEach(input => {
            if (!input.checkValidity())
                disableInput = true;

            input.addEventListener('input', () => this.#validateForm(input, 'input'));
            input.addEventListener('change', () => this.#validateForm(input, 'change'));
        });
        this.#loginButton.disabled = disableInput;

        form.addEventListener('submit', (event) => {
            event.preventDefault();
            this.login();
        });
    }

    /** @param {HTMLInputElement} inputField */
    #updateErrorStatus(inputField) {
        inputField.classList.add('error');

        if (inputField.nextElementSibling?.hasAttribute('input-errors')) {
            inputField.nextElementSibling.textContent = '';

            if (inputField.validity.tooShort)
                this.#addErrorMessage(inputField.nextElementSibling, inputField.dataset.tooShort);
            else if (inputField.validity.tooLong)
                this.#addErrorMessage(inputField.nextElementSibling, inputField.dataset.tooLong);
            if (inputField.validity.patternMismatch)
                this.#addErrorMessage(inputField.nextElementSibling, inputField.dataset.mismatch);
        }
    }

    /**
     * @param {HTMLInputElement} source 
     * @param {'change'|'input'} eventType 
     */
    #validateForm(source, eventType) {
        let isValid = true;

        this.#inputs.forEach(input => {
            if (input.checkValidity()) {
                if (eventType === 'input' && input === source)
                    this.#clearErrorStatus(input);

                return;
            }

            if (eventType === 'change' && input === source)
                this.#updateErrorStatus(input);

            isValid = false;
        });

        this.#loginButton.disabled = !isValid;
    }
}

customElements.define('account-menu-component', AccountMenuComponent);



/* IMPORT: ./components/blog-editor.js */



/* IMPORT: /js/components/blog-form.js */



/* IMPORT: /js/components/text-editor.js */



/* IMPORT: /js/constants/editor-constants.js */




/* IMPORT: /js/utilities/paste.utility.js */



/* IMPORT: /js/constants/editor-constants.js */



/** A row/block of pasted text
 * @typedef {Object} TextRow
 * @property {(string|null)} tag
 * @property {string} content
*/

/**
 * @param {TextRow[]} textRows The rows/blocks of pasted text
 * @param {Node} node Node derived from the current selection
 * @param {number} offset Offset derived from the current selection
 */
function fillFirstContainer(textRows, node, offset) {
    const parentElement = node.parentElement;
    const parentLength = parentElement.textContent.length;
    parentElement.innerHTML = parentElement.innerHTML.substring(0, offset) + textRows.shift().content + parentElement.innerHTML.substring(offset);
    stripUnwantedAttributes(parentElement);
    setCaretPosition(parentElement, parentLength - offset);
}

/**
 * @param {TextRow[]} textRows 
 * @param {HTMLElement} container 
 */
function fillLastContainer(textRows, container) {
    const lastRow = textRows.pop().content;
    container.innerHTML = lastRow + container.innerHTML;
    stripUnwantedAttributes(container);
}

/**
 * @param {TextRow[]} textRows 
 * @param {HTMLElement} lastContainer 
 * @param {Number} originalLength
 */
function fillRemainingContainers(textRows, lastContainer, originalLength) {
    for (const row of textRows) {
        const betweenBlock = document.createElement(row.tag ?? containerTags[0]);
        betweenBlock.innerHTML = row.content;
        stripUnwantedAttributes(betweenBlock);
        lastContainer.parentNode.insertBefore(betweenBlock, lastContainer);
    }

    setCaretPosition(lastContainer, originalLength);
}

/**
 * @param {HTMLElement} parent 
 * @param {number} originalLength 
 * @param {number} cumulativeLength 
 */
function setCaretPosition(parent, originalLength, cumulativeLength = 0) {
    const children = Array.from(parent.childNodes).reverse();

    for (const child of children) {
        cumulativeLength += child.textContent.length;

        if (originalLength > cumulativeLength)
            continue;

        if (child.nodeType === Node.TEXT_NODE) {
            window.getSelection().setPosition(child, cumulativeLength - originalLength);
            break;
        }

        setCaretPosition(child, originalLength, cumulativeLength - child.textContent.length);
        break;
    }
}

/**
 * @param {string} text
 * @return {TextRow[]}
 */
function splitIntoContainerRows(text) {
    const textRows = [];

    while (text) {
        const match = text.match(regexMatchContainers);

        if (!match) {
            textRows.push({tagName: null, content: text});
            break;
        }

        if (match.index > 0)
            textRows.push({tagName: null, content: text.substring(0, match.index)});

        textRows.push({tagName: match[1].toLowerCase(), content: match[2]});
        text = text.substring(match.index + match[0].length);
    }

    return textRows;
}

/**
 * @param {HTMLElement} node 
 */
function stripUnwantedAttributes(node) {
    for (const tag in allowedAttributes) {
        const elements = node.querySelectorAll(tag);
        /** @type {string[]} */
        const attributes = allowedAttributes[tag];

        for (const element of elements) {
            Array.from(element.attributes).forEach(attr => {
                if (!attributes.find(name => name === attr.localName))
                    element.removeAttribute(attr.localName);
            })
        }
    }
}


/* IMPORT: /js/utilities/form.utility.js */

/** Fills a select element with options from an iterable collection of key-value pairs
 * @param {HTMLSelectElement} select
 * @param {(Map<(string|number), string>|[(string|number), string][])} keyValues */
function fillSelect(select, keyValues) {
    for (const [key, value] of keyValues) {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = value;
        select.appendChild(option);
    }
}


/* IMPORT: /js/models/image-gallery/gallery.model.js */




/* IMPORT: /js/models/image-gallery/image.model.js */




/* IMPORT: /js/models/selection-data.model.js */




/* IMPORT: /js/services/undo-management.service.js */



class TextEditorComponent extends HTMLElement {
    static #keyMods = Object.freeze({ none: 0b0, shift: 0b1, ctrl: 0b10, alt: 0b100 });

    /** @type {TextEditorComponent} */ #self;
    #undo = undoManagementService;
    /** @type {SelectionData} */
    #latestSelection;

    #fieldset;
    /** @type {HTMLSelectElement} */ #blockSelector;
    /** @type {HTMLButtonElement[]} */ #tagButtons;
    /** @type {HTMLButtonElement} */ #linkButton;
    /** @type {HTMLButtonElement[]} */ #blockAttributeButtons;
    /** @type {HTMLButtonElement} */ #pageBreakButton;
    /** @type {HTMLElement} */ #textBoxContainer;
    /** @type {HTMLElement} */ #textBox;
    /** @type {HTMLTextAreaElement} */  #htmlEditor;

    /** @type {HTMLElement} */ #optionsPanel;
    /** @type {Object.<string, HTMLButtonElement>} */ #optionsButtons = {};
    /** @type {HTMLElement} */ #optionForms;
    /** @type {HTMLElement} */ #optionsElement;

    /** @type {MutationObserver} */ #mutationObserver;

    /** @type {Function[]} */ #onChange = [];

    constructor() {
        const component = super();
        this.#self = component;

        this.#onSelectionChange = this.#onSelectionChange.bind(this);
    }

    connectedCallback() {
        const self = this.#self;
        self.toggleAttribute('hidden', true);

        this.#fieldset = self.querySelector('fieldset');
        this.#blockSelector = this.#fieldset.querySelector('[select-blocktype]');
        this.#tagButtons = Array.from(this.#fieldset.querySelectorAll('[data-tag]'));
        this.#linkButton = this.#fieldset.querySelector('[btn-link]');
        this.#blockAttributeButtons = Array.from(this.#fieldset.querySelectorAll('[data-block-attribute]'));
        this.#pageBreakButton = this.#fieldset.querySelector('[btn-pagebreak]');

        const htmlCheck = self.querySelector('[checkbox-html]');
        this.#textBoxContainer = self.querySelector('text-box-container');
        this.#textBox = this.#textBoxContainer.querySelector('text-box');

        this.#htmlEditor = self.querySelector('[html-editor]');

        this.#optionsPanel = self.querySelector('options-panel');
        this.#optionsPanel.querySelectorAll('[element-option]').forEach(
            btn => this.#optionsButtons[btn.getAttribute('element-option')] = btn
        );
        this.#optionForms = Array.from(this.#optionsPanel.querySelectorAll('form'));
        this.#optionsPanel.addEventListener('animationend', (event) => {
            if (event.animationName === 'panel-out')
                this.#optionsPanel.classList.replace('panel-out', 'hidden');
            else
                this.#optionsPanel.classList.remove('panel-in');
        });

        document.addEventListener('selectionchange', this.#onSelectionChange);

        fillSelect(this.#blockSelector, containerTagsAndLabels);

        this.#blockSelector.addEventListener('change', event => {
            event.stopPropagation();

            if (document.getSelection().anchorNode !== this.#textBox)
                this.#toggleTag({ name: this.#blockSelector.value });

            this.#textBox.focus();
        });

        this.#tagButtons.forEach(button => button.dataset.shortcut && button.addEventListener('click', () => this.#toggleTag({ name: button.dataset.tag.toLowerCase() })));

        this.#linkButton.addEventListener('click', () => this.#addLink(this.#linkButton));

        for (const button of this.#blockAttributeButtons) {
            button.addEventListener('click', () => this.#toggleBlockAttribute(button));
        }

        this.#pageBreakButton.addEventListener('click', () => this.#insertPageBreak());

        this.#textBox.addEventListener('click', (event) => {
            const link = this.#getMatchingAncestor(event.target, 'a');

            if (link && link.href && this.#hasKeyMods(event, TextEditorComponent.#keyMods.ctrl)) {
                event.preventDefault();
                window.open(link.href, '_blank');
                return;
            }
        });

        this.#textBox.addEventListener('input', () => {
            const selection = document.getSelection();
            const node = selection.anchorNode;
            if (node.nodeType === Node.TEXT_NODE && node.parentElement === this.#textBox) {
                this.#getBlockElement(node);
                selection.setPosition(node, node.textContent.length);
            }

            this.#undo.add(this.#textBox, true);
        });

        this.#textBox.addEventListener('keydown', event => {
            this.#textboxKeydown(event);
        });

        this.#textBox.addEventListener('click', event => {
            if (event.ctrlKey)
                return;

            const element = event.target;
            const options = elementsWithOptions[element.localName];
            const isMatch = !!options;

            this.#optionsElement = null;
            
            if (isMatch) {
                this.#optionsPanel.classList.replace('hidden', 'panel-in');
            }
            else if (!this.#optionsPanel.classList.contains('hidden'))
                this.#optionsPanel.classList.toggle('panel-out', true);

            if (!isMatch)
                return;

            event.stopPropagation();
            this.#adaptOptionsPanel(element, options);
        }, { capture: true });

        this.#setupPanelOptions();

        this.#mutationObserver = new MutationObserver((mutationList, _) => {
            for (const record of mutationList) {
                if (record.target !== self.#textBox)
                    continue;

                switch (record.attributeName) {
                    case 'data-gallery-insert':
                        if (!self.#textBox.hasAttribute('data-gallery-insert'))
                            continue;
                        
                        this.#addGallery();
                        break;

                    case 'data-image-insert':
                        if (!self.#textBox.hasAttribute('data-image-insert'))
                            continue;
                
                        this.#addImage();
                        break;

                    default:
                        continue;
                }
                break;
            }

            if (this.#onChange.length)
                this.#onChange[0].call(this);
        });
        this.#mutationObserver.observe(
            this.#textBox, {
                characterData: true,
                childList: true,
                subtree: true,
                attributeFilter: ['data-image-insert', 'data-gallery-insert']
            }
        );

        this.#htmlEditor.addEventListener('input', () => {
            this.#undo.clear(this.#textBox);
            const lines = this.#htmlEditor.value.split(/\r?\n|\r|\n/g);
            this.#textBox.innerHTML = lines.map(line => line.trim()).join('');
        });
        this.#htmlEditor.addEventListener('change', event => event.stopPropagation());

        htmlCheck.addEventListener('change', event => {
            event.stopPropagation();

            const editHtml = htmlCheck.checked;

            if (editHtml)
                this.#htmlEditor.value = this.#getContent(true);

            this.#textBoxContainer.toggleAttribute('hidden', editHtml);
            this.#htmlEditor.toggleAttribute('hidden', !editHtml);
        });

        self.removeAttribute('hidden');
    }

    disconnectedCallback() {
        document.removeEventListener('selectionchange', this.#onSelectionChange);
    }

    connectedMoveCallback() {}

    /** Gives outside access to the text-box content */
    get content() {
        const self = this;

        return {
            get html() {
                self.#encloseRootText();
                return {
                    get full() { return self.#textBox.innerHTML ?? ''; },
                    get rest() { return self.#textBox.innerHTML.match(/^.*(?:<hr page-break(?:="")?>)(.+)$/si)?.at(1) ?? ''; },
                    get short() { return self.#textBox.innerHTML.match(/^(.*<hr page-break(?:="")?>)/si)?.at(1) ?? self.#textBox.innerHTML ?? ''; }
                };
            },
            /** @param {string} htmlContent  */
            set html(htmlContent) {
                self.#textBox.innerHTML = htmlContent;
                self.#htmlEditor.textContent = htmlContent;
                self.#htmlEditor.value = htmlContent;
            },
            get text() { return self.#textBox.textContent; },
            get media() {
                return [
                    ...self.#textBox.querySelectorAll('img-gallery'),
                    ...self.#textBox.querySelectorAll('img-wrapper')
                ];
            },
            /** @param {() => void} func  */
            set onChange(func) {
                if (typeof func !== 'function')
                    throw new Error('onChange parameter is not a function');

                while (self.#onChange.length) {
                    self.#onChange.pop();
                }

                self.#onChange.push(func);
            },
            reset() {
                self.#textBox.textContent = '';
                self.#htmlEditor.textContent = '';
                self.#htmlEditor.value = '';
            }
        };
    }

    /**
     * @param {HTMLElement} editorElement 
     * @param {string[]} options 
    */
    #adaptOptionsPanel(editorElement, options) {
        console.log('adapting options panel:', editorElement, options);
        this.#optionsElement = editorElement;

        for (const form of this.#optionForms) {
            form.hidden = true;
        }

        const buttons = this.#optionsButtons;
        for (const attribute in buttons) {
            const nonValidOption = !options.includes(attribute);
            const button = buttons[attribute];
            button.hidden = nonValidOption;
            button.disabled = nonValidOption;

            if (nonValidOption || attribute === 'delete')
                continue;

            /** @type {HTMLInputElement} */
            const firstFormInput = button.nextElementSibling.firstElementChild;
            firstFormInput.form.reset();

            const oldValue = editorElement.getAttribute(attribute);

            if (oldValue === null)
                continue;

            switch (firstFormInput.type) {
                case 'text':
                    firstFormInput.value = oldValue;
                    continue;
                
                case 'number':
                    const match = oldValue?.toLowerCase()
                        .match(/^(\d+)([a-z]*|%)$/);

                    if (match?.at(0) == undefined)
                        continue;

                    firstFormInput.value = match[1];

                    /** @type {HTMLSelectElement} */
                    const select = firstFormInput.nextElementSibling;

                    if (match[2] && select?.localName === 'select')
                        select.value = match[2];

                    continue;
                
                case 'checkbox':
                    firstFormInput.checked = ['', 'true', 'yes', '1'].includes(oldValue);
                    continue;
            }
        }
    }

    #addGallery() {
        /** @type {Gallery} */
        const gallery = JSON.parse(this.#textBox.getAttribute('data-gallery-insert'));
        this.#textBox.removeAttribute('data-gallery-insert');

        this.#makeSelection(this.#latestSelection);

        this.#toggleTag({
            name: 'img-gallery',
            attributes: {
                'gallery-id': gallery.id,
                'aspect-ratio': '16/9',
                'width': '50%',
                'transition-time': '2000ms',
                'wait-time': '2000ms'
            }
        });
    }

    /** Add an image using data from the component's data-image-insert attribute */
    #addImage() {
        /** @type {Image} */
        const image = JSON.parse(this.#textBox.getAttribute('data-image-insert'));
        this.#textBox.removeAttribute('data-image-insert');

        this.#makeSelection(this.#latestSelection);

        this.#toggleTag({
            name: 'img-wrapper',
            attributes: {
                'image-id': image.id
            }
        });
    }

    /**
     * Add a hyperlink to the selected text
     * 
     * @param {HTMLButtonElement} button 
     */
    #addLink(button) {
        const selection = window.getSelection();
        const tagName = button.dataset.tag.toLowerCase();

        const anchorMatch = this.#getMatchingAncestor(selection.anchorNode, tagName);
        const focusMatch = this.#getMatchingAncestor(selection.focusNode, tagName);

        if (anchorMatch || focusMatch) {
            if (anchorMatch === focusMatch) {
                const selectionData = new SelectionData(selection);
                anchorMatch.replaceWith(...anchorMatch.childNodes);
                selection.setBaseAndExtent(
                    selectionData.startNode,
                    selectionData.startOffset,
                    selectionData.endNode,
                    selectionData.endOffset
                );
            }

            return;
        }

        let linkText;
        if (selection.isCollapsed) {
            linkText = prompt(button.dataset.textQuery ?? 'Please input display text:', this.#getWord(selection));

            if (!linkText)
                return;
        }
        
        let linkUrl;
        let urlQuery = button.dataset.urlQuery ?? 'Please input link:';

        do {
            linkUrl = prompt(urlQuery, 'https://');
            
            if (!linkUrl)
                return;

            const emailMatch = linkUrl.match(/(?!.*\.{2,})^(mailto:)?[\w\-\.\%\/\+]{1,64}\@[\w\.]{1,64}\.[a-zA-Z0-9\-]{1,32}$/);
            if (emailMatch) {
                if (!emailMatch[1])
                    linkUrl = `mailto:${linkUrl}`;
                break;
            }

            if (!linkUrl.match(/^[\w\/][\w\-\.\/\?\+:#=%@]+$/)) {
                linkUrl = '';
                urlQuery = button.dataset.urlInvalid ?? 'Invalid link. Please try again:';
                continue;
            }

            const isRelative = linkUrl.match(/^(?:\/?\w[\w\-]*)+(?:\.[a-zA-Z0-9]+)?(?:(?:\?|\#)[=\w%]*)?$/);

            if (!isRelative && !linkUrl.match(/^[a-z]{3,}:/))
                linkUrl = `https://${linkUrl}`;
        }
        while(!linkUrl)

        this.#toggleTag({
            name: tagName,
            content: linkText,
            attributes: {
                href: linkUrl,
                ...(linkUrl.includes('://') && { target: '_blank' })
            }
        });
    }

    #addParagraphBreak(textNode, offset) {
        const blockNode = this.#getBlockElement(textNode);
        const newBlock = document.createElement(blockNode.localName);
        blockNode.insertAdjacentElement('afterend', newBlock);

        const splitTree = (start, destination) => {
            let foundCenter = false;

            for (const node of Array.from(start.childNodes)) {
                if (node.contains(textNode)) {
                    foundCenter = true;

                    switch (node.nodeType) {
                        case Node.ELEMENT_NODE:
                            const twin = document.createElement(node.localName);
                            destination.appendChild(twin);
                            splitTree(node, twin);
                            break;

                        case Node.TEXT_NODE:
                            const newHalf = document.createTextNode(node.textContent.substring(offset));
                            node.textContent = node.textContent.substring(0, offset);
                            destination.appendChild(newHalf);
                            break;
                    }

                    continue;
                }

                if (foundCenter)
                    destination.appendChild(node);
            }
        }

        splitTree(blockNode, newBlock);

        return newBlock;
    }

    /**
     * 
     * @param {Text[]} textNodes
     * @param {Object} tagInfo
     * @param {SelectionData} selectionData 
     */
    #applyContentTag(textNodes, tagInfo, selectionData) {
        let collapsedOffset = false;

        if (selectionData.isCollapsed) {
            if (
                selectionData.startOffset === 0
                || !selectionData.startNode.textContent[selectionData.startOffset-1].trim()
                || selectionData.startOffset === selectionData.startNode.textContent.length
                || !selectionData.startNode.textContent[selectionData.startOffset].trim()
            ) {
                this.#insertContentElement(tagInfo, selectionData);
                return;
            }
            const start = textNodes[0].textContent.lastIndexOf(' ', selectionData.startOffset) + 1;
            const end = textNodes[0].textContent.indexOf(' ', selectionData.startOffset);

            collapsedOffset = selectionData.startOffset - start;

            selectionData.startOffset = start;
            selectionData.endOffset = (end < 0) ? textNodes[0].textContent.length : end;
        }

        if (textNodes[0] === selectionData.startNode && selectionData.startOffset > 0) {
            const node = textNodes[0];
            const newNode = document.createTextNode(node.textContent.substring(0, selectionData.startOffset));
            node.parentNode.insertBefore(newNode, node);
            node.textContent = node.textContent.substring(selectionData.startOffset);

            if (textNodes.length === 1)
                selectionData.endOffset -= selectionData.startOffset;

            selectionData.startOffset = 0;
        }

        if (textNodes[textNodes.length-1] === selectionData.endNode && selectionData.endOffset < textNodes[textNodes.length-1].textContent.length) {
            const node = textNodes[textNodes.length-1];
            const newNode = document.createTextNode(node.textContent.substring(selectionData.endOffset));
            node.parentNode.insertBefore(newNode, node);
            node.parentNode.insertBefore(node, newNode);
            node.textContent = node.textContent.substring(0, selectionData.endOffset);

            selectionData.endOffset = node.textContent.length;
        }

        let latestBlock = null;
        let blockMembers = [ ];
        
        for (const node of textNodes) {
            let newBlock = this.#getBlockElement(node);
            latestBlock ??= newBlock;

            if (newBlock === latestBlock) {
                blockMembers.push(node);
                continue;
            }

            latestBlock = newBlock;
            this.#encloseNodes(blockMembers, tagInfo);
            blockMembers = [node];
        }

        this.#encloseNodes(blockMembers, tagInfo);

        if (typeof collapsedOffset === 'number') {
            selectionData.startOffset = selectionData.endOffset = collapsedOffset;
        }
    }

    /**
     * 
     * @param {Node[]} nodes 
     * @param {Object} tagInfo
     * @param {String} tagInfo.name
     * @param {String} tagInfo.content
     * @param {Object} tagInfo.attributes
     * @param {Object} tagInfo.dataset
     */
    #encloseNodes(nodes, tagInfo) {
        const newElement = document.createElement(tagInfo.name);
        
        for (const attribute in tagInfo.attributes) {
            newElement.setAttribute(attribute, tagInfo.attributes[attribute]);
        }
        
        for (const dataKey in tagInfo.dataset) {
            newElement.dataset[dataKey] = tagInfo.dataset[dataKey];
        }

        if (nodes.length === 1) {
            nodes[0].parentNode.insertBefore(newElement, nodes[0]);
            newElement.appendChild(nodes[0]);
            
            if (tagInfo.content)
                nodes[0].textContent = tagInfo.content;

            return;
        }

        const range = document.createRange();
        range.setStart(nodes[0], 0);
        const endNode = nodes[nodes.length-1]; 
        range.setEnd(endNode, endNode.length);

        const ancestor = range.commonAncestorContainer;
        let inRange = false;
        const relevantChildren = Array.from(ancestor.childNodes).filter(c => {
            if (!inRange && c.contains(nodes[0]))
                inRange = true;

            if (inRange && c.contains(endNode)) {
                inRange = false;
                return true;
            }

            return inRange;
        });

        ancestor.insertBefore(newElement, relevantChildren[0]);
        newElement.replaceChildren(...relevantChildren);

        for (const child of relevantChildren) {
            if (child?.localName === tagInfo.name) {
                Array.from(child.childNodes).forEach(grandchild => {
                    child.parentNode.insertBefore(grandchild, child);
                });
                child.remove();
            }
        }
    }

    /** Encloses any text nodes placed directly in the text-box in an appropriate container element */
    #encloseRootText() {
        for (const rootChild of this.#textBox.childNodes) {
            if (rootChild.nodeType !== Node.TEXT_NODE)
                continue;

            const tag = rootChild.previousSibling?.localName
                ?? rootChild.nextSibling?.localName
                ?? containerTags[0];

            const newElement = document.createElement(tag);
            this.#textBox.insertBefore(newElement, rootChild);
            newElement.appendChild(rootChild);
        }
    }

    /**
     * Extracts the selected text from the provided list of elements
     * 
     * @param {Text[]} textNodes 
     * @param {HTMLElement[]} elements 
     * @param {SelectionData} selectionData
     */
    #extractSelectionFromTags(textNodes, elements, selectionData) {
        if (textNodes.length !== elements.length) {
            console.error('removeInlineTag called without matching in-data');
            return;
        }

        const uniqueElements = new Set(elements);
        const tagName = elements[0].localName;

        if (!selectionData.isCollapsed) {
            if (textNodes[0] === selectionData.startNode && selectionData.startOffset > 0) {
                const node = textNodes[0];
                const newText = document.createTextNode(node.textContent.substring(0, selectionData.startOffset));
                const newElement = document.createElement(tagName);
                newElement.appendChild(newText);
                node.parentNode.insertBefore(newElement, node);
                node.textContent = node.textContent.substring(selectionData.startOffset);

                if (textNodes.length === 1)
                    selectionData.endOffset -= selectionData.startOffset;

                selectionData.startOffset = 0;
            }

            if (textNodes[textNodes.length-1] === selectionData.endNode && selectionData.endOffset < textNodes[textNodes.length-1].textContent.length) {
                const node = textNodes[textNodes.length-1];
                const newText = document.createTextNode(node.textContent.substring(selectionData.endOffset));
                const newElement = document.createElement(tagName);
                newElement.appendChild(newText);
                node.parentNode.insertBefore(newElement, node);
                node.parentNode.insertBefore(node, newElement);
                node.textContent = node.textContent.substring(0, selectionData.endOffset);

                selectionData.endOffset = node.textContent.length;
            }
        }

        for (const element of uniqueElements) {
            const parent = element.parentNode;
            const children = Array.from(element.childNodes);
            element.replaceWith(...element.childNodes);

            const firstChild = children[0];
            const lastChild = children[children.length-1];
            if (firstChild.nodeType === Node.TEXT_NODE && firstChild.previousSibling?.nodeType === Node.TEXT_NODE) {
                if (element === elements[0]) {
                    selectionData.startOffset += firstChild.previousSibling.textContent.length;

                    if (selectionData.startNode === selectionData.endNode)
                        selectionData.endOffset += firstChild.previousSibling.textContent.length;
                }
                firstChild.textContent = firstChild.previousSibling.textContent + firstChild.textContent;
                firstChild.previousSibling.remove();
            }
            else if (lastChild.nodeType === Node.TEXT_NODE && lastChild.nextSibling?.nodeType === Node.TEXT_NODE) {
                lastChild.textContent += lastChild.nextSibling.textContent;
                lastChild.nextSibling.remove();
            }
        }
    }

    /**
     * Searches through parent elements for a block element, until an end node is reached.
     * Creates a new block element in the endNode if none can be found.
     * @param {Node} childNode 
     * @param {String} tagName
     * @returns {HTMLElement}
     */
    #getBlockElement(childNode, tagName = null) {
        const textBox = this.#textBox;

        if (!tagName)
            tagName = this.#blockSelector.value
                ? this.#blockSelector.value
                : containerTags[0];

        if (!childNode || childNode === textBox) {
            const newElement = document.createElement(tagName);
            textBox.appendChild(newElement);
            return newElement;
        }

        if (childNode.nodeType === Node.TEXT_NODE && childNode.parentElement !== textBox)
            childNode = childNode.parentElement;

        while (childNode && childNode !== textBox) {
            if (this.#isBlockType(childNode.localName))
                return childNode;

            if (childNode.parentElement === textBox)
                break;

            childNode = childNode.parentElement;
        }

        const newElement = document.createElement(tagName);
        textBox.insertBefore(newElement, childNode);
        newElement.appendChild(childNode);
        return newElement;
    }

    /**
     * @param {Boolean} doFormat 
     * @returns {String}
     */
    #getContent(doFormat = false) {
        let htmlOutput = this.#textBox.innerHTML;

        if (!doFormat)
            return htmlOutput;

        for (const tag of containerTags)
            htmlOutput = htmlOutput.replaceAll(`><${tag}>`, `>\r\n<${tag}>`);

        return htmlOutput.replaceAll('><!--', '>\r\n<!--');
    }

    /**
     * Searches through parent elements for an ancestor, until an end node is reached
     * @param {Node} node 
     * @param {string} tagName 
     * @returns {(HTMLElement|false)}
     */
    #getMatchingAncestor(node, tagName) {
        if (node.nodeType === Node.TEXT_NODE)
            node = node.parentElement;

        while (node && node !== this.#textBox) {
            if (node.localName === tagName)
                return node;

            node = node.parentElement;
        }

        return false;
    }

    /**
     * Retrieves an array of the text nodes in the current selection
     * 
     * @param {SelectionData} selectionData 
     * @returns {Text[]}
     */
    #getTextNodesFromSelection(selectionData = null) {
        selectionData ??= new SelectionData(window.getSelection());

        if (!selectionData.startNode)
            return [];

        if (selectionData.startNode === selectionData.endNode)
            if (selectionData.startNode.nodeType === Node.TEXT_NODE)
                return [ selectionData.startNode ];
            else
                return [];

        const textNodes = [];

        let foundStart = false,
            foundEnd = false;

        const searchChildren = (start) => {
            for (const node of start.childNodes) {
                if (foundEnd)
                    return;

                if (node === selectionData.startNode)
                    foundStart = true;

                if (foundStart && node.nodeType === Node.TEXT_NODE) {
                    textNodes.push(node);
                }

                searchChildren(node);

                if (node === selectionData.endNode)
                    foundEnd = true;
            }
        }

        const range = document.createRange();
        range.setStart(selectionData.startNode, selectionData.startOffset);
        range.setEnd(selectionData.endNode, selectionData.endOffset);

        searchChildren(range.commonAncestorContainer);

        return textNodes;
    }

    /**
     * Returns the word that surrounds the caret position
     * 
     * @param {Selection} selection 
     * @returns {String}
     */
    #getWord({anchorNode, anchorOffset}) {
        if (
            anchorOffset === 0
            || !anchorNode.textContent[anchorOffset-1].trim()
            || anchorOffset === anchorNode.textContent.length
            || !anchorNode.textContent[anchorOffset].trim()
        )
        return '';

        const text = anchorNode.textContent;

        const end = text.indexOf(' ', anchorOffset);

        return text.substring(
            text.lastIndexOf(' ', anchorOffset) + 1,
            (end < 0)
                ? text.length
                : end
        );
    }

    /**
     * Checks of the event has exactly the specified modifiers.
     * Uses static keyModifiers enum
     * 
     * @param {Event} event 
     * @param {Number} modifiers 
     * @returns {Boolean}
     */
    #hasKeyMods(event, modifiers) {
        return modifiers === ((event.shiftKey * 0b1) + (event.ctrlKey * 0b10) + (event.altKey * 0b100));
    }

    /**
     * Inserts an element containing a text node
     * @param {Object} tagInfo 
     * @param {String} tagInfo.name 
     * @param {String} tagInfo.content 
     * @param {Object} tagInfo.attributes 
     * @param {Object} tagInfo.dataset
     * @param {SelectionData} selectionData 
     */
    #insertContentElement(tagInfo, selectionData) {
        selectionData ??= new SelectionData(window.getSelection());
        const isTextElement = textContentTags.some(t => t === tagInfo.name);

        const element = document.createElement(tagInfo.name);

        for (const attribute in tagInfo.attributes) {
            element.setAttribute(attribute, tagInfo.attributes[attribute]);
        }

        for (const dataKey in tagInfo.dataset) {
            element.dataset[dataKey] = tagInfo.dataset[dataKey];
        }

        let textNode;
        if (isTextElement) {
            element.innerHTML = tagInfo.content ?? '&nbsp';
            textNode = element.firstChild;
        }
        
        const range = document.createRange();
        range.setStart(selectionData.startNode, selectionData.startOffset);
        range.collapse();

        if (selectionData.startNode === this.#textBox) {
            const block = document.createElement(this.#blockSelector.value);
            block.appendChild(element);
            range.insertNode(block);
        }
        else
            range.insertNode(element);

        if (textNode) {
            selectionData.isCollapsed = false;
            selectionData.startNode = selectionData.endNode = textNode;
            selectionData.startOffset = 0;
            selectionData.endOffset = textNode.textContent.length;
            return;
        }
        
        selectionData.isCollapsed = true;
        selectionData.startNode = selectionData.endNode = element.nextSibling ?? element.parentElement;
        selectionData.startOffset = selectionData.endOffset = element.nextSibling ? 0 : 1;
    }

    #insertPageBreak() {
        const textBox = this.#textBox;
        const selectionData = new SelectionData(getSelection());

        const existingPageBreaks = textBox.querySelectorAll('hr[page-break]');

        for (const pageBreak of existingPageBreaks)
            pageBreak.remove();

        const blockElement = this.#getBlockElement(selectionData.startNode);
        const pageBreak = document.createElement('hr');
        pageBreak.toggleAttribute('page-break', true);

        if (selectionData.startNode === blockElement || selectionData.startNode === this.#textBox) {
            selectionData.startNode = selectionData.endNode = pageBreak;
            selectionData.startOffset = selectionData.endOffset = 1;
        }

        if (!blockElement.firstChild || blockElement.innerHTML === '<br>')
            blockElement.replaceWith(pageBreak);
        else
            blockElement.insertAdjacentElement('afterend', pageBreak);
    }

    /**
     * Checks if the specified tag type is in the list of block tags
     * 
     * @param {string} tagName 
     * @returns {boolean}
     */
    #isBlockType(tagName) {
        return !!containerTags.find(tag => tag === tagName);
    }

    /**
     * Makes a new selection based on the provided SelectionData object
     * 
     * @param {SelectionData} selectionData 
     * @param {Node} selectionData.startNode 
     * @param {Number} selectionData.startOffset 
     * @param {Node} selectionData.endNode 
     * @param {Number} selectionData.endOffset 
     */
    #makeSelection({startNode, startOffset, endNode = null, endOffset = null}) {
        this.#textBox.focus();

        if (!endNode || !endOffset) {
            window.getSelection().setPosition(startNode, startOffset);
            return;
        }

        window.getSelection().setBaseAndExtent(startNode, startOffset, endNode, endOffset);
    }

    /**
     * SelectionChange event handler for the document root
     */
    #onSelectionChange = () => {
        const selection = window.getSelection();
        const isCurrentTextbox = this.#textBox.contains(selection.anchorNode)
                              && this.#textBox.contains(selection.focusNode);

        this.#fieldset.disabled = !isCurrentTextbox;

        if (!isCurrentTextbox) {
            this.#tagButtons.forEach(b => b.classList.remove('highlight'));
            this.#blockAttributeButtons.forEach(b => b.classList.remove('highlight'));
            return;
        }

        this.#latestSelection = new SelectionData(selection);

        const selectedTextNodes = this.#getTextNodesFromSelection(this.#latestSelection);

        if (selectedTextNodes.length === 0) {
            [this.#blockSelector.value] = containerTags;
            this.#blockAttributeButtons.forEach(b => b.classList.remove('highlight'));
        }
        else {
            const selectedBlocks = [ ...new Set(
                selectedTextNodes.map(n => this.#getBlockElement(n))
            )];

            const identicalBlocks = selectedBlocks.length > 0
                && selectedBlocks.every((block, _, arr) => block && block.localName === arr[0].localName);

            this.#blockSelector.value = identicalBlocks
                ? selectedBlocks[0].localName
                : null;

            this.#linkButton.disabled = (new Set(selectedBlocks)).size !== 1;

            for (const button of this.#blockAttributeButtons) {
                button.classList.toggle('highlight',
                    selectedBlocks.length && selectedBlocks.every(block => block.hasAttribute(button.dataset.blockAttribute))
                );
            }
        }

        for (const btn of this.#tagButtons) {
            btn.classList.toggle('highlight',
                !!selectedTextNodes.length
                && selectedTextNodes.every(n => !!this.#getMatchingAncestor(n, btn.dataset.tag.toLowerCase()))
            );
        }

        this.#pageBreakButton.disabled = !this.#latestSelection.isCollapsed;
    }

    #optionDelete() {
        this.#optionsPanel.classList.add('panel-out');
        this.#optionsElement?.remove();

        const buttons = this.#optionsButtons;
        for (const btnName in buttons) {
            if (btnName === 'delete')
                continue;

            buttons[btnName].parentElement.hidden = true;
            buttons[btnName].disabled = true;
        }

        this.#optionsElement = null;
    }

    async #paste(pasteHtml = true) {
        const textBox = this.#textBox;
        this.#undo.add(textBox);

        const selection = window.getSelection();

        const clipboardContent = await navigator.clipboard.read();
    
        let pasted,
            contentType;

        if (pasteHtml) {
            pasted = clipboardContent.find(i => i.types.includes('text/html'));
            contentType = 'text/html';
        }

        if (!pasted) {
            pasted = clipboardContent.find(i => i.types.includes('text/plain'));
            contentType = 'text/plain';

            if (!pasted)
                return;
        }

        selection.deleteFromDocument();

        const isForward = selection.direction !== 'backward';
        let node = isForward ? selection.anchorNode : selection.focusNode,
            offset = isForward ? selection.anchorOffset : selection.focusOffset;

        const currentBlock = this.#getBlockElement(node);
        const currentBlockTag = currentBlock.localName;

        if (node === textBox || node === currentBlock) {
            node = document.createTextNode('');
            offset = 0;

            if (currentBlock.childNodes.length === 1 && currentBlock.innerHTML === '<br>')
                currentBlock.replaceChildren(node);
            else
                currentBlock.appendChild(node);
        }

        let text = await (await pasted.getType(contentType)).text();

        if (contentType === 'text/plain') {
            const textNode = document.createTextNode(text);
            const range = document.createRange();
            range.setStart(node, offset);
            range.insertNode(textNode);
            return;
        }

        text = text.replaceAll(regexDisallowedAttributes, '')
            .replaceAll(regexIndentations, '')
            .replaceAll(regexDisallowedElements, '');

        const textRows = splitIntoContainerRows(text);

        if (!textRows[0].tag || textRows[0].tag === currentBlockTag)
            fillFirstContainer(textRows, node, offset);

        if (textRows.length === 0)
            return;

        const lastContainer = this.#addParagraphBreak(selection.anchorNode, selection.anchorOffset);
        const originalLength = lastContainer.textContent.length;

        const lastTag = textRows[textRows.length - 1].tag;
        if (!lastTag || lastTag === currentBlockTag)
            fillLastContainer(textRows, lastContainer);

        fillRemainingContainers(textRows, lastContainer, originalLength);
    }

    /**
     * Replaces an element with one with a new tag that takes the old element's children
     * 
     * @param {HTMLElement} element 
     * @param {string} newTag 
     * @returns {HTMLElement}
     */
    #replaceElement(element, newTag) {
        if (element.localName === newTag)
            return element;

        const newElement = document.createElement(newTag);
        newElement.replaceChildren(...element.childNodes);
        element.replaceWith(newElement);

        return newElement;
    }

    #setupPanelOptions() {
        this.#optionsButtons['delete'].addEventListener('click', () => this.#optionDelete());

        for (const attribute in this.#optionsButtons) {
            if (attribute === 'delete')
                continue;

            const button = this.#optionsButtons[attribute];
            const form = button.nextElementSibling;
            button.addEventListener('click', () => form.hidden = !form.hidden);

            /** @type {HTMLInputElement} */
            const primaryField = form.firstElementChild;

            switch (primaryField.type) {
                case 'text':
                    primaryField.addEventListener('input', () => {
                        if (!primaryField.value.length) {
                            this.#optionsElement.removeAttribute(attribute);
                            return;
                        }

                        this.#optionsElement.setAttribute(attribute, primaryField.value);
                    });
                    break;

                case 'number':
                    const select = primaryField.nextElementSibling;
                    
                    primaryField.addEventListener('input', () => {
                        if (!primaryField.value.length) {
                            this.#optionsElement.removeAttribute(attribute);
                            return;
                        }

                        const suffix = select ? select.value : '';
                        this.#optionsElement.setAttribute(attribute, primaryField.value + suffix);

                    });

                    select?.addEventListener('change', () => {
                        if (!primaryField.value.length) {
                            this.#optionsElement.removeAttribute(attribute);
                            return;
                        }

                        this.#optionsElement.setAttribute(attribute, primaryField.value + select.value);
                    });
                    break;

                case 'checkbox':
                    primaryField.addEventListener('change', () => {
                        this.#optionsElement.toggleAttribute(attribute, primaryField.checked);
                    });
                    break;
            }
        }
    }

    /**
     * Handle keydown events for the text editor
     * @param {Event} event 
     */
    #textboxKeydown(event) {
        const textBox = this.#textBox;
        const keyUpper = event.key.toUpperCase();

        const selectionData = new SelectionData(window.getSelection());

        const selectionNode = selectionData.startNode;
        if (keyUpper === 'BACKSPACE' && selectionNode.nodeType === Node.ELEMENT_NODE) {
            selectionData.isCollapsed = true;
            selectionData.startNode = selectionData.endNode = selectionNode.previousSibling ?? selectionNode.parentNode;
            selectionData.startOffset = selectionData.endOffset = selectionNode.previousSibling
                ? ( selectionNode.previousSibling.nodeType === Node.TEXT_NODE
                    ? selectionNode.textContent.length
                    : 1
                )
                : 0
        }
        this.#undo.saveData(textBox, selectionData);

        if (defaultBehaviorKeys.some(k => k === keyUpper))
            return;

        if (!this.#hasKeyMods(event, TextEditorComponent.#keyMods.ctrl))
            return;

        event.preventDefault();

        switch (keyUpper) {
            case 'V':
                this.#paste();
                return;

            case 'Z':
                this.#undo.undo(textBox);
                return;

            case 'Y':
                this.#undo.redo(textBox);
                return;
        }

        const button = this.#tagButtons.find(b => b.dataset.shortcut?.toUpperCase() === keyUpper);

        if (button)
            this.#toggleTag({ name: button.dataset.tag.toLowerCase() });
    }

    /** @param {HTMLButtonElement} button  */
    #toggleBlockAttribute(button) {
        const attribute = button?.dataset.blockAttribute?.toLowerCase();

        if (!attribute)
            return;

        const textBox = this.#textBox;
        const selectionData = new SelectionData(getSelection());
        
        if (!textBox.contains(selectionData.startNode) || !textBox.contains(selectionData.endNode))
            return;

        const textNodes = this.#getTextNodesFromSelection(selectionData);

        if (!textNodes)
            return;

        const blockElements = [...new Set(
            textNodes.map(node => this.#getBlockElement(node))
        )];

        const isAlign = textAlignAttributes.includes(attribute);

        for (const block of blockElements) {
            const hasAttribute = block.hasAttribute(attribute);

            if (hasAttribute) {
                block.removeAttribute(attribute);
                continue;
            }

            if (isAlign) {
                textAlignAttributes.forEach(
                    attr => block.toggleAttribute(attr, attr === attribute)
                );
                continue;
            }

            block.toggleAttribute(attribute, true);
        }

        this.#onSelectionChange();
    }

    /**
     * Add or remove one or more tags of the specified type
     * 
     * @param {{name: string, content: string, attributes: {}, dataset: {}}} tagInfo
     */
    #toggleTag(tagInfo) {
        const textBox = this.#textBox;
        const selectionData = new SelectionData(window.getSelection());
        tagInfo.name = tagInfo.name;

        if (!textBox.contains(selectionData.startNode) || !textBox.contains(selectionData.endNode))
            return;

        this.#undo.add(textBox);

        const selectedTextNodes = this.#getTextNodesFromSelection(selectionData);

        if (this.#isBlockType(tagInfo.name)) {
            if (selectedTextNodes.length < 1) {
                this.#replaceElement(this.#getBlockElement(selectionData.startNode, tagInfo.name), tagInfo.name);
            }
            else {
                const blockMatches = new Set(selectedTextNodes.map(textNode => this.#getBlockElement(textNode, tagInfo.name)));

                for (const match of blockMatches) {
                    this.#replaceElement(match, tagInfo.name);
                }
            }
        }
        else {
            if (selectedTextNodes.length < 1) {
                this.#insertContentElement(tagInfo, selectionData);
            }
            else {
                const ancestorMatches = selectedTextNodes.map(n => this.#getMatchingAncestor(n, tagInfo.name));
                const noMatches = ancestorMatches.every(match => !match);

                switch (noMatches) {
                    case true:
                        this.#applyContentTag(selectedTextNodes, tagInfo, selectionData);
                        break;
                
                    case false:
                        const actualMatches = ancestorMatches.filter(match => match !== false);

                        if (actualMatches.length === selectedTextNodes.length) {
                            this.#extractSelectionFromTags(selectedTextNodes, actualMatches, selectionData);
                            break;
                        }

                        this.#applyContentTag(selectedTextNodes, tagInfo, selectionData);
                        break;
                }
            }
        }

        this.#makeSelection(selectionData);
    }
};

customElements.define('text-editor-component', TextEditorComponent);


/* IMPORT: /js/models/blog/blog-post.model.js */




/* IMPORT: /js/utilities/emitter.js */



class BlogFormComponent extends HTMLElement {
    #isPublished = false;
    #publishedPath = ''
    #scheduledTimeout = { id: null };

    #isLoaded = Object.freeze(new Emitter(false));
    #isChanged = Object.freeze(new Emitter(false));
    #isScheduled = Object.freeze(new Emitter(false));
    #isValid = Object.freeze(new Emitter(false));

    /** @type {HTMLInputElement[]} */ #textInputs;
    /** @type {HTMLInputElement[]} */ #nonScheduleOptions;

    /** @type {HTMLFormElement} */ #form;
    /** @type {HTMLElement} */ #permadate;
    /** @type {TextEditorComponent} */ #textEditor;

    constructor() { super(); }

    connectedCallback() {
        const formId = this.getAttribute('form-id');
        if (!formId)
            throw new Error('No form-id attribute provided');

        this.#form = this.querySelector(`#${formId}`);
        const inputs = this.#form.elements;

        this.#permadate = this.querySelector(`#${formId}__permadate`);
        this.#textEditor = this.querySelector(`#${formId}__text-editor`);
        this.#form.onreset = () => this.#textEditor.content.reset();

        inputs['title'].addEventListener('input', () => inputs['permalink'].defaultValue = this.#formatPermalinkTitle(inputs['title'].value));
        inputs['title'].addEventListener('change', () => {
            const title = inputs['title'].value.trim();

            if (title.length >= inputs['title'].minLength)
                inputs['title'].value = title.charAt(0).toUpperCase() + title.slice(1);
        });

        inputs['description'].addEventListener('change', () => {
            const description = inputs['description'].value.trim();

            if (description.length >= inputs['description'].minLength)
                inputs['description'].value = description.charAt(0).toUpperCase() + description.slice(1);
        });

        this.#textInputs = [
            inputs['title'],
            inputs['description'],
            inputs['mastolink']
        ];

        inputs['isPinned'].addEventListener('change', () => this.#isChanged.setValue(true));

        this.#isPublished = !!inputs['isPublished'];

        if (this.#isPublished) {
            this.#publishedPath = inputs['isPublished'].value;
            inputs['isHidden'].addEventListener('change', () => this.#isChanged.setValue(true));
        }
        else {
            inputs['permalink']?.addEventListener('change', () => 
                inputs['permalink'].value = this.#formatPermalinkTitle(inputs['permalink'].value)
            );
            this.querySelector(`#${formId}__reset-permalink`).addEventListener('click', () => inputs['permalink'].value = inputs['permalink'].defaultValue);
            
            this.#textInputs.push(
                inputs['permalink'],
                inputs['scheduledDate'],
                inputs['scheduledTime']
            );

            inputs['isScheduled'].addEventListener('change', () => {
                const isScheduled = inputs['isScheduled'].checked;

                inputs['scheduledDate'].toggleAttribute('disabled', !isScheduled);
                inputs['scheduledDate'].toggleAttribute('hidden', !isScheduled);
                inputs['scheduledTime'].toggleAttribute('disabled', !isScheduled);
                inputs['scheduledTime'].toggleAttribute('hidden', !isScheduled);
                
                this.#isChanged.setValue(true);
                this.#isScheduled.setValue(isScheduled);
                this.#updateDateTimeFields(isScheduled);
            });

            if (inputs['isScheduled'].checked) {
                const dateTime = [ inputs['scheduledDate'].value, inputs['scheduledTime'].value ];
                inputs['scheduledDate'].defaultValue = '';
                inputs['scheduledTime'].defaultValue = '';
                [ inputs['scheduledDate'].value, inputs['scheduledTime'].value ] = dateTime;
                
                this.#isScheduled.setValue(true);
                this.#updateDateTimeFields(true);
            }

            inputs['scheduledDate'].addEventListener('change', () => this.#setPermadate(inputs['scheduledDate'].value.replaceAll('-', '/')));
        }

        for (const field of this.#textInputs) {
            field.addEventListener('input', () => {
                this.#isChanged.setValue(true);
                this.#validation();
            });
        }
        this.#textEditor.content.onChange = () => {
            this.#isChanged.setValue(true);
            this.#validation();
        };
        
        this.#validation();

        this.#isLoaded.setValue(true);
    }

    connectedMoveCallback() {}

    disconnectedCallback() {}

    /**
     * @param {{ required: boolean, tooShort: boolean, tooLong: boolean, mismatch: boolean }[]} errors 
     * @returns {boolean} Whether there were any valid error objects to handle
     */
    error(errors) {
        if (!errors)
            console.error('Errors parameter empty');

        if (!Object.hasOwn(errors[0], 'required'))
            return false;
        
        for (const input of this.#form.elements) {
            const error = errors[input.name];

            if (!error) {
                if (!input.classList.length)
                    continue;

                input.classList.remove('error-required');
                input.classList.remove('error-too-short');
                input.classList.remove('error-too-long');
                input.classList.remove('error-mismatch');
                continue;
            }

            input.classList.toggle('error-required', !!error.required);
            input.classList.toggle('error-too-short', !!error.tooShort);
            input.classList.toggle('error-too-long', !!error.tooLong);
            input.classList.toggle('error-mismatch', !!error.mismatch);
        }

        return true;
    }

    getFormData() {
        const content = this.#textEditor.content.html;
        this.#form.elements['contentShort'].value = content.short;
        this.#form.elements['contentRest'].value = content.rest;

        return new FormData(this.#form);
    }

    get isChanged() { return this.#isChanged; }

    get isPublished() { return this.#isPublished; }

    get isScheduled() { return this.#isScheduled; }

    get isValid() { return this.#isValid; }

    get publishedPath() { return this.#publishedPath; }

    /** @param {() => void} func  */
    onLoaded(func) {
        if (typeof func !== 'function')
            throw new Error('onLoaded argument is not a function');

        if (this.#isLoaded.getValue()) {
            func.call(this);
            return;
        }

        this.#isLoaded.first({
            next: func
        });
    }

    /** @param {(event) => void} func  */
    onSubmit(func) {
        this.#form.addEventListener('submit', func);
    }

    reset() {
        if (this.#form.elements['permalink'])
            this.#form.elements['permalink'].defaultValue = '';
        
        this.#form.reset();

        for (const input of this.#form.elements) {
            if (!input.classList.length)
                continue;

            input.classList.remove('error-required');
            input.classList.remove('error-too-short');
            input.classList.remove('error-too-long');
            input.classList.remove('error-mismatch');
        }
    }

    /** @param {BlogPost} blogPost  */
    updateForm(blogPost) {
        /** @type {Object.<string, HTMLInputElement>} */
        const inputs = this.#form.elements;

        const id = inputs['id'];
        id.value = blogPost.id;
        id.defaultValue = blogPost.id;

        const title = inputs['title'];
        title.value = blogPost.title;
        title.defaultValue = blogPost.title;

        const permalink = inputs['permalink'];
        if (permalink) {
            const permalinkTitle = blogPost.permalink.substring(12);
            permalink.value = permalinkTitle;
            permalink.defaultValue = permalinkTitle;
        }

        this.#textEditor.content.html = blogPost.contentShort + (blogPost.contentRest ?? '');

        const description = inputs['description'];
        description.value = blogPost.description;
        description.defaultValue = blogPost.description;

        const mastolink = inputs['mastolink'];
        mastolink.value = blogPost.mastolink;
        mastolink.defaultValue = blogPost.mastolink;

        const isPinned = inputs['isPinned'];
        isPinned.checked = blogPost.isPinned;
        isPinned.defaultChecked = blogPost.isPinned;

        const isHidden = inputs['isHidden'];
        if (isHidden) {
            isHidden.checked = blogPost.isHidden;
            isHidden.defaultChecked = blogPost.isHidden;
        }
    }

    /**
     * @param {string} input 
     * @returns {string}
     */
    #formatPermalinkTitle(input) {
        return input.toLowerCase()
                .replaceAll(/\s/g, '-')
                .replaceAll(/[^\-a-z0-9]+/g, '')
                .replaceAll(/\-{2,}/g, '')
                .replaceAll(/(^\-)|(\-$)/g, '');
    }

    /** 
     * Set the permadate text to a provided string, or its default value
     * @param {string} value 
     */
    #setPermadate(value = undefined) {
        value ??= this.#permadate.dataset.default;

        this.#permadate.textContent = value;
    }

    /**
     * @param {boolean} isScheduled
     */
    #updateDateTimeFields(isScheduled) {
        const dateInput = this.#form.elements['scheduledDate'];
        const timeInput = this.#form.elements['scheduledTime'];

        if (!isScheduled) {
            this.#setPermadate();
            clearTimeout(this.#scheduledTimeout.id);
            return;
        }

        const recursiveLogic = (scheduledTimeout) => {
            const now = new Date();
            
            const minTime = new Date(now.getTime() + 900000);
            const followingHour = new Date(minTime.getTime() + 3600000);
            const targetDateValue = `${followingHour.getFullYear()}-${`${followingHour.getMonth() + 1}`.padStart(2, '0')}-${`${followingHour.getDate()}`.padStart(2, '0')}`;

            timeInput.min = `${minTime.getHours()}:${`${minTime.getMinutes()}`.padStart(2, '0')}`;
            dateInput.min = targetDateValue;

            const defaultTimeValue = `${followingHour.getHours()}:00`;

            if (isScheduled
                && timeInput.value
                && timeInput.value === timeInput.defaultValue
                && timeInput.defaultValue !== defaultTimeValue) {
                    console.log('Ding!'); // TODO: Notification
            }

            timeInput.defaultValue = defaultTimeValue;
            dateInput.defaultValue = targetDateValue;

            this.#setPermadate(dateInput.value.replaceAll('-', '/'));

            scheduledTimeout.id = setTimeout(recursiveLogic, 60000, scheduledTimeout);
        }

        recursiveLogic(this.#scheduledTimeout);
    }

    #validation() {
        const textEditorValid = this.#textEditor.content.text.length || this.#textEditor.content.media.length;

        const isValid = textEditorValid
            && this.#textInputs.every(input => input.checkValidity());

        this.#isValid.setValue(isValid);
    }
}

customElements.define('blog-form-component', BlogFormComponent);


/* IMPORT: /js/models/blog/blog-post.dto.model.js */




/* IMPORT: /js/services/blog-post.service.js */




/* IMPORT: /js/custom-elements/date-time.element.js */




/* IMPORT: /js/utilities/emitter.js */



class BlogEditorComponent extends HTMLElement {
    /** @type {Listener} */ #changeListener;
    /** @type {Listener} */ #validationListener;
    #isChanged = false;
    #isValid = false;

    /** @type {DateTimeElement} */ #modifiedOn;
    /** @type {DateTimeElement} */ #saveTime;

    /** @type {BlogFormComponent} */ #blogForm;

    /** @type {HTMLButtonElement} */ #btnCancel;
    /** @type {HTMLButtonElement} */ #btnSave;
    /** @type {HTMLButtonElement} */ #btnPublish;

    constructor() { super(); }

    connectedCallback() {
        this.#blogForm = this.querySelector('#blog-editor__editor');

        const buttons = this.querySelector('edit-buttons');
        this.#btnCancel = buttons.querySelector('#blog-editor__btn-cancel');
        this.#btnPublish = buttons.querySelector('#blog-editor__btn-publish');
        this.#btnSave = buttons.querySelector('#blog-editor__btn-save');

        this.#modifiedOn = this.querySelector('.modified-on');
        this.#saveTime = buttons.querySelector('[save-time]');

        this.#btnCancel.addEventListener('click', event => {
            event.preventDefault();
            this.#onCancel();
        });

        this.#btnPublish?.addEventListener('click', event => {
            event.preventDefault();
            this.#onPublish();
        });

        this.#blogForm.onSubmit(event => {
            event.preventDefault();
            this.#onSave();
        });

        this.#changeListener = this.#blogForm.isChanged.subscribe({
            next: changed => {
                this.#isChanged = changed;
                this.#btnSave.disabled = !changed || !this.#isValid;
            }
        }, { getCurrent: true, getUnchanged: true });

        this.#validationListener = this.#blogForm.isValid.subscribe({
            next: valid => {
                this.#isValid = valid;

                if (this.#btnPublish)
                    this.#btnPublish.disabled = !valid;

                this.#btnSave.disabled = !valid || !this.#isChanged;
            }
        }, { getCurrent: true, getUnchanged: true });

        if (this.#btnPublish) {
            this.#blogForm.isScheduled.subscribe({
                next: scheduled => {
                    this.#btnPublish.textContent = scheduled
                        ? this.#btnPublish.dataset.contentSchedule
                        : this.#btnPublish.dataset.contentPublish;
                }
            }, { getCurrent: true });
        }

        this.#blogForm.onLoaded(() => {
            if (this.#btnPublish)
                this.#btnPublish.disabled = false;

            this.#btnCancel.disabled = false;
        });
    }

    connectedMoveCallback() {}

    disconnectedCallback() {}

    #onCancel() {
        if (this.#blogForm.isPublished)
            window.location.assign(this.#blogForm.publishedPath);
        else
            window.location.assign('/');
    }

    #onPublish() {
        this.#btnPublish.disabled = true;
        this.#btnPublish.toggleAttribute('btn-loading', true);
        this.#btnSave.disabled = true;

        const draftDTO = new BlogPostDTO(this.#blogForm.getFormData());

        if (draftDTO.scheduledOn)
            this.#schedulePost(draftDTO);
        else
            this.#publishPost(draftDTO);
    }

    #onSave() {
        this.#btnSave.disabled = true;
        this.#btnSave.toggleAttribute('btn-loading', true);

        if (this.#btnPublish)
            this.#btnPublish.disabled = true;

        const postDTO = new BlogPostDTO(this.#blogForm.getFormData());

        if (this.#blogForm.isPublished)
            this.#updateBlogPost(postDTO);
        else
            this.#updateDraft(postDTO);
    }

    /** @param {BlogPostDTO} draftDTO  */
    #publishPost(draftDTO) {
        blogPostService.publishDraft(draftDTO,
            value => {
                this.#btnPublish.removeAttribute('btn-loading');
                
                // TODO: Post published notification

                setTimeout(() => window.location.assign('/'), 2000);
            },
            errors => {
                if (this.#blogForm.error(errors)) {
                    // TODO: Incorrect input notification
                }
                else {
                    // TODO: Errors string content notification
                }
                this.#btnPublish.removeAttribute('btn-loading');
            }
        );
    }

    /** @param {BlogPostDTO} draftDTO  */
    #schedulePost(draftDTO) {
        blogPostService.scheduleDraft(draftDTO,
            value => {
                this.#btnPublish.removeAttribute('btn-loading');
                
                // TODO: Post scheduled notification

                setTimeout(() => window.location.assign('/'), 2000);
            },
            errors => {
                if (this.#blogForm.error(errors)) {
                    // TODO: Incorrect input notification
                }
                else {
                    // TODO: Errors string content notification
                }
                this.#btnPublish.removeAttribute('btn-loading');
            }
        );
    }

    /** @param {BlogPostDTO} blogPostDTO  */
    #updateBlogPost(blogPostDTO) {
        blogPostService.updateBlogPost(blogPostDTO,
            value => {
                this.#changeListener.pause();
                this.#validationListener.pause();
                this.#blogForm.updateForm(value);

                // TODO: Post updated notification

                const saveTime = value.modifiedOn ?? value.createdOn;
                this.#updateSaveTime(saveTime);
                this.#saveTime.parentElement.removeAttribute('hidden');

                this.#btnSave.removeAttribute('btn-loading');
                if (this.#btnPublish)
                    this.#btnPublish.disabled = false;
                setTimeout(() => {
                    this.#changeListener.unpause();
                    this.#validationListener.unpause();
                }, 500);
            },
            errors => {
                if (this.#blogForm.error(errors)) {
                    // TODO: Incorrect input notification
                }
                else {
                    // TODO: Errors string content notification
                }
                this.#btnSave.removeAttribute('btn-loading');
            }
        );

    }

    /** @param {BlogPostDTO} draftDTO  */
    #updateDraft(draftDTO) {
        blogPostService.saveDraft(draftDTO,
            value => {
                this.#changeListener.pause();
                this.#validationListener.pause();
                this.#blogForm.updateForm(value);

                // TODO: Draft updated notification

                const saveTime = value.modifiedOn ?? value.createdOn;
                this.#updateSaveTime(saveTime);
                this.#saveTime.parentElement.removeAttribute('hidden');

                this.#btnSave.removeAttribute('btn-loading');
                if (this.#btnPublish)
                    this.#btnPublish.disabled = false;
                setTimeout(() => {
                    this.#changeListener.unpause();
                    this.#validationListener.unpause();
                }, 500);
            },
            errors => {
                if (this.#blogForm.error(errors)) {
                    // TODO: Incorrect input notification
                }
                else {
                    // TODO: Errors string content notification
                }
                this.#btnSave.removeAttribute('btn-loading');
            }
        );
        
    }

    /** @param {Date} saveTime  */
    #updateSaveTime(saveTime) {
        this.#modifiedOn?.setDateTime(saveTime);
        this.#saveTime.setDateTime(saveTime);
    }
}

customElements.define('blog-editor-component', BlogEditorComponent);


/* IMPORT: ./components/blog-form.js */




/* IMPORT: ./components/blog-head.js */



/* IMPORT: /js/components/blog-form.js */




/* IMPORT: /js/models/blog/blog-post.dto.model.js */




/* IMPORT: /js/services/blog-post.service.js */




/* IMPORT: /js/utilities/emitter.js */



class BlogHeadComponent extends HTMLElement {
    /** @type {Listener} */ #validationListener;

    /** @type {HTMLButtonElement} */ #btnAddPost;
    /** @type {HTMLButtonElement} */ #btnCancelPost;
    /** @type {HTMLButtonElement} */ #btnPublishPost;
    /** @type {HTMLButtonElement} */ #btnSaveDraft;

    /** @type {HTMLElement} */ #content;
    /** @type {BlogFormComponent} */ #blogForm;

    /** @type {HTMLSpanElement} */ #saveTime;

    constructor() { super(); }

    connectedCallback() {
        this.#btnAddPost = this.querySelector('#blog-head__btn-add');

        this.#content = this.querySelector('#blog-head__content');

        this.#blogForm = this.querySelector('#blog-head__editor');
        const blogForm = this.#blogForm;

        const buttons = this.querySelector('blog-head-buttons');
        this.#btnCancelPost = buttons.querySelector('#blog-head__btn-cancel');
        this.#btnPublishPost = buttons.querySelector('#blog-head__btn-publish');
        this.#btnSaveDraft = buttons.querySelector('#blog-head__btn-save');

        this.#saveTime = buttons.querySelector('[save-time]');

        this.#btnAddPost.addEventListener('click', () => {
            const wasActive = !this.#btnAddPost.ariaPressed || this.#btnAddPost.ariaPressed !== 'false';
            this.#toggleFormView(!wasActive);
        });

        this.#btnCancelPost.addEventListener('click', () => {
            blogForm.reset();
            this.#toggleFormView(false);
        });

        blogForm.onSubmit(event => {
            event.preventDefault();
            this.#onPublish();
        });

        this.#btnSaveDraft.addEventListener('click', event => {
            event.preventDefault();
            this.#onSave()
        });

        blogForm.isScheduled.subscribe({
            next: scheduled => {
                this.#btnPublishPost.textContent = scheduled
                    ? this.#btnPublishPost.dataset.contentSchedule
                    : this.#btnPublishPost.dataset.contentPublish;
            }
        }, { getCurrent: true });

        this.#validationListener = blogForm.isValid.subscribe({
            next: valid => {
                this.#btnPublishPost.disabled = !valid;
                this.#btnSaveDraft.disabled = !valid;
            }
        }, { getCurrent: true, getUnchanged: true });

        blogForm.onLoaded(() => {
            this.#btnAddPost.title = this.#btnAddPost.dataset.titleOpen;
            this.#btnAddPost.disabled = false;
            this.#btnAddPost.removeAttribute('btn-loading');
        });
    }

    connectedMoveCallback() {}

    disconnectedCallback() {}

    /** @param {BlogPostDTO} post  */
    #createBlogPost(post) {
        blogPostService.createBlogPost(post,
            value => {
                this.#blogForm.reset();
                this.#toggleFormView(false);
                this.#btnPublishPost.removeAttribute('btn-loading');

                if (value.blogPost) {
                    // TODO: Blog Post notification
                }
                else {
                    // TODO: Schedule notification
                }
            },
            errors => {
                if (this.#blogForm.error(errors)) {
                    // TODO: Incorrect input notification
                }
                else {
                    // TODO: Errors string content notification
                }
                this.#btnPublishPost.removeAttribute('btn-loading');
            }
        );
    }

    #onPublish() {
        this.#btnPublishPost.disabled = true;
        this.#btnSaveDraft.disabled = true;
        this.#btnPublishPost.toggleAttribute('btn-loading', true);

        const post = new BlogPostDTO(this.#blogForm.getFormData());

        if (!post.id){
            this.#createBlogPost(post);
            return;
        }

        this.#publishDraft(post);
    }

    #onSave() {
        this.#btnSaveDraft.disabled = true;
        this.#btnPublishPost.disabled = true;
        this.#btnSaveDraft.toggleAttribute('btn-loading', true);

        const draft = new BlogPostDTO(this.#blogForm.getFormData());

        this.#saveDraft(draft);
    }

    /** @param {BlogPostDTO} draft  */
    #publishDraft(draft) {
        blogPostService.publishDraft(draft, 
            value => {
                this.#blogForm.reset();
                this.#toggleFormView(false);
                this.#btnPublishPost.removeAttribute('btn-loading');

                // TODO: Blog Post notification
            },
            errors => {
                if (this.#blogForm.error(errors)) {
                    // TODO: Incorrect input notification
                }
                else {
                    // TODO: Errors string content notification
                }
                this.#btnPublishPost.removeAttribute('btn-loading');
            }
        );
    }

    /** @param {BlogPostDTO} draft  */
    #saveDraft(draft) {
        blogPostService.saveDraft(draft,
            value => {
                this.#validationListener.pause();
                this.#blogForm.updateForm(value);

                // TODO: Draft saved notification

                const saveTime = value.modifiedOn ?? value.createdOn;
                this.#updateSaveTime(saveTime);
                this.#saveTime.parentElement.removeAttribute('hidden');

                this.#btnSaveDraft.removeAttribute('btn-loading');
                this.#btnPublishPost.disabled = false;
                setTimeout(() => this.#validationListener.unpause(), 500);
                
            },
            errors => {
                if (this.#blogForm.error(errors)) {
                    // TODO: Incorrect input notification
                }
                else {
                    // TODO: Errors string content notification
                }
                this.#btnSaveDraft.removeAttribute('btn-loading');
            }
        );
    }

    /** @param {boolean} makeActive  */
    #toggleFormView(makeActive) {
        const button = this.#btnAddPost;

        button.ariaPressed = `${makeActive}`;
        button.classList.toggle('btn-primary', !makeActive);
        button.classList.toggle('btn-secondary', makeActive);
        button.title = makeActive
            ? button.dataset.titleClose
            : button.dataset.titleOpen;
        this.#content.toggleAttribute('hidden', !makeActive);

        const svgUse = button.querySelector('#blog-head__btn-add__use');
        const href = makeActive
            ? button.dataset.hrefClose
            : button.dataset.hrefOpen;
        svgUse.setAttribute('xlink:href', href);
        svgUse.setAttribute('href', href);
    }

    /** @param {Date} saveTime  */
    #updateSaveTime(saveTime) {
        const now = new Date();
        const isSavedToday = saveTime.getDate() === now.getDate()
            && saveTime.getMonth() === now.getMonth()
            && saveTime.getFullYear() === now.getFullYear();

        if (isSavedToday)
            this.#saveTime.textContent = saveTime.toLocaleTimeString();
        else
            this.#saveTime.textContent = saveTime.toLocaleString();
    }
}

customElements.define('blog-head-component', BlogHeadComponent);


/* IMPORT: ./components/blog-post-administration.js */



/* IMPORT: /js/components/pagination.js */



/* IMPORT: /js/models/blog/pagination.model.js */



class PaginationComponent extends HTMLElement {
    #baseRoute;
    #data;
    #pageChangeDelay = 1000;
    #pageChangeId = 0;
    #startPage;

    /** @type {{nav: HTMLUListElement, pages: HTMLUListElement}} */ #lists = {};
    /** @type {{active: HTMLAnchorElement, first: HTMLAnchorElement, prev: HTMLAnchorElement, next: HTMLAnchorElement, last: HTMLAnchorElement}} */ #links = {};

    /** @type {(data: Pagination) => void} */ #onDataUpdate;
    /** @type {(page: number, updateHistory: boolean, next: () => void) => void} */ #onPageChange;

    constructor() {
        super();

        this.#baseRoute = this.getAttribute('base-route');
        
        const data = this.dataset.csv.split(',');
        const page = Number(data[0]);

        this.#data = new Pagination({
            page: page,
            pageSize: Number(data[1]),
            offset: Number(data[2]),
            itemCount: Number(data[3]),
            pageCount: Number(data[4])
        });
        
        this.#startPage = page;
    }

    connectedCallback() {
        const cId = Number(this.dataset.id);
        const navList = this.querySelector('ul');
        this.#lists.nav = navList;
        this.#lists.pages = navList.querySelector(`#pagination__pages-${cId}`);

        this.#links.first = navList.querySelector(`#pagination__first-${cId}`);
        this.#links.prev = navList.querySelector(`#pagination__previous-${cId}`);
        this.#links.next = navList.querySelector(`#pagination__next-${cId}`);
        this.#links.last = navList.querySelector(`#pagination__last-${cId}`);
        this.#links.active = navList.querySelector('.active');

        this.#links.first.addEventListener('click', event => {
            event.preventDefault();
            this.#gotoPage(Number(this.#links.first.getAttribute('target-page')));
            return false;
        });

        this.#links.prev.addEventListener('click', event => {
            event.preventDefault();
            this.#gotoNeighboringPage(false);
            return false;
        });

        this.#links.next.addEventListener('click', event => {
            event.preventDefault();
            this.#gotoNeighboringPage(true);
            return false;
        });

        this.#links.last.addEventListener('click', event => {
            event.preventDefault();
            this.#gotoPage(Number(this.#links.last.getAttribute('target-page')));
            return false;
        });

        for (const { firstElementChild: link } of this.#lists.pages.children) {
            link.addEventListener('click', event => {
                event.preventDefault();
                this.#gotoPage(Number(link.getAttribute('target-page')));
                return false;
            });
        }

        window.addEventListener('popstate', event => {
            const page = event.state ?? this.#startPage;

            if (page !== this.#data.page)
                this.#gotoPage(page, false);
        });
    }

    connectedMoveCallback() {}

    disconnectedCallback() {}

    getData() {
        return new Pagination(this.#data);
    }

    /**
     * @param {Pagination} value 
     * @param {boolean} [updateHistory=true]  */
    setData(value, updateHistory = true) {
        if (updateHistory)
            history.pushState(value.page, null, `${this.#baseRoute}/${value.page}`);

        const isNewPage = value.page !== this.#data.page;
        const hasNewPageCount = value.pageCount !== this.#data.pageCount;

        this.#data = new Pagination(value);

        if (isNewPage || hasNewPageCount)
            this.#refreshPagination();

        this.#onDataUpdate?.call(this, this.getData());
    }

    /** Lets the page using the pagination module update itself in response to a pagination data update
     * @param {(data: Pagination) => void} callbackFn  */
    set onDataUpdate(callbackFn) {
        if (typeof callbackFn === 'function')
            this.#onDataUpdate = callbackFn;
    }

    /** @param {(page: number, updateHistory: boolean, next: () => void) => void} callbackFn  */
    set onPageChange(callbackFn) {
        if (typeof callbackFn === 'function')
            this.#onPageChange = callbackFn;
    }

    /**
     * @param {number} page 
     * @returns {HTMLLIElement}
     */
    #createPaginationItem(page) {
        const a = document.createElement('a');

        a.href = `${this.#baseRoute}/${page}`;
        a.setAttribute('onclick', 'return false;');
        a.title = `Page ${page}`;
        a.setAttribute('target-page', `${page}`);
        a.textContent = `${page}`;
        a.addEventListener('click', event => {
            event.preventDefault();
            this.#gotoPage(page);
            return false;
        });

        const li = document.createElement('li');
        li.appendChild(a);

        return li;
    }

    /** @param {boolean} gotoNext  */
    #gotoNeighboringPage(gotoNext) {
        clearTimeout(this.#pageChangeId);

        const neighbor = gotoNext
            ? this.#links.active.parentElement.nextElementSibling
            : this.#links.active.parentElement.previousElementSibling;
        
        if (!neighbor)
            return false;

        const newActive = neighbor.firstElementChild;
        const targetPage = Number(newActive.getAttribute('target-page'));
        const pageCount = this.#data.pageCount;

        this.#links.first.toggleAttribute('disabled', targetPage < 3);
        this.#links.prev.toggleAttribute('disabled', targetPage === 1);
        this.#links.next.toggleAttribute('disabled', targetPage === pageCount);
        this.#links.last.toggleAttribute('disabled', targetPage > pageCount - 2);

        this.#links.active.classList.remove('active');
        newActive.classList.add('active');
        const isCentered = pageCount >= 5 && this.#lists.pages.children.item(2).firstElementChild === this.#links.active;
        this.#links.active = newActive;

        if (gotoNext) {
            const highestValue = Number(this.#lists.pages.lastElementChild.firstElementChild.getAttribute('target-page'));

            if (highestValue < pageCount && isCentered) {
                this.#lists.pages.append(
                    this.#createPaginationItem(highestValue + 1)
                );
                this.#lists.pages.firstElementChild.remove();
            }
        }
        else {
            const lowestValue = Number(this.#lists.pages.firstElementChild.firstElementChild.getAttribute('target-page'));

            if (lowestValue > 1 && isCentered) {
                this.#lists.pages.prepend(
                    this.#createPaginationItem(lowestValue - 1)
                );
                this.#lists.pages.lastElementChild.remove();
            }
        }

        this.#pageChangeId = setTimeout(
            () => this.#onPageChange?.call(this, targetPage),
            this.#pageChangeDelay
        );
    }

    /**
     * @param {number} targetPage 
     * @param {boolean} updateHistory 
     */
    async #gotoPage(targetPage, updateHistory = true) {
        clearTimeout(this.#pageChangeId);

        this.#lists.nav.toggleAttribute('disabled', true);

        const currentPage = Number(this.#links.active.getAttribute('target-page'));

        await this.#scrollPagination(targetPage, currentPage);

        const pageCount = this.#data.pageCount;

        this.#links.first.toggleAttribute('disabled', targetPage < 3);
        this.#links.prev.toggleAttribute('disabled', targetPage === 1);
        this.#links.next.toggleAttribute('disabled', targetPage === pageCount);
        this.#links.last.toggleAttribute('disabled', targetPage > pageCount - 2);

        this.#onPageChange?.call(this, targetPage, updateHistory,
            () => this.#lists.nav.removeAttribute('disabled')
        );
    }

    async #refreshPagination() {
        const currentPage = this.#data.page;
        const pageCount = this.#data.pageCount;
        const pageSet = new Set([ currentPage ]);

        for (let pageSteps = 1; pageSteps < 5; pageSteps++) {
            let oldSize = pageSet.size;

            let previousPage = Math.max(currentPage - pageSteps, 1);
            pageSet.add(previousPage);

            let nextPage = Math.min(currentPage + pageSteps, pageCount);
            pageSet.add(nextPage);

            const newSize = pageSet.size;

            if (newSize === oldSize || newSize >= 5)
                break;
        }

        const pages = Array.from(pageSet);
        pages.sort();

        const paginationItems = [];
        for (const page of pages) {
            const newItem = this.#createPaginationItem(page);
            paginationItems.push(newItem);

            if (page === currentPage) {
                this.#links.active = newItem.firstElementChild;
                this.#links.active.classList.add('active');
            }
        }

        this.#lists.pages.replaceChildren(...paginationItems);
    }

    /**
     * @param {number} targetPage 
     * @param {number} startPage 
     * @returns {Promise<void>}
     */
    async #scrollPagination(targetPage, startPage) {
        if (targetPage === startPage)
            return;

        const delayFor = (ms) => new Promise(res => setTimeout(res, ms));
        const time = Math.ceil(1000 / Math.abs(targetPage - startPage));

        const pageList = this.#lists.pages;

        const scrollForward = targetPage > startPage;
        const pageCount = this.#data.pageCount;
        let currentPage = startPage;
        
        while (
            ( scrollForward && currentPage < targetPage )
            ||
            ( !scrollForward && currentPage > targetPage )
        ) {
            if (currentPage !== startPage)
                await delayFor(time);

            this.#links.active.classList.remove('active');

            if (scrollForward) {
                this.#links.active = this.#links.active.parentElement.nextElementSibling.firstElementChild;
                currentPage++;
            }
            else {
                this.#links.active = this.#links.active.parentElement.previousElementSibling.firstElementChild;
                currentPage--;
            }

            this.#links.active.classList.add('active');

            if (pageCount < 6)
                continue;

            const middlePageNumber = Number(pageList.children.item(2).firstElementChild.getAttribute('target-page'));
            if (scrollForward && currentPage <= middlePageNumber)
                continue;
            if (!scrollForward && currentPage >= middlePageNumber)
                continue;

            const edgeNumber = scrollForward
                ? Number(pageList.lastElementChild.firstElementChild.getAttribute('target-page'))
                : Number(pageList.firstElementChild.firstElementChild.getAttribute('target-page'));

            if (edgeNumber === (scrollForward ? pageCount : 1))
                continue;

            if (scrollForward) {
                const newItem = this.#createPaginationItem(edgeNumber + 1);
                pageList.append(newItem);
                pageList.firstElementChild.remove();
            }
            else {
                const newItem = this.#createPaginationItem(edgeNumber - 1);
                pageList.prepend(newItem);
                pageList.lastElementChild.remove();
            }
        }
    }
}

customElements.define('pagination-component', PaginationComponent);



/* IMPORT: /js/constants/markup-constants.js */




/* IMPORT: /js/models/blog/blog-post.model.js */




/* IMPORT: /js/services/blog-post.service.js */



class BlogPostAdministrationComponent extends HTMLElement {
    /** @type {HTMLFormElement} */ #statusForm;
    /** @type {{start: HTMLSpanElement, end: HTMLSpanElement, total: HTMLSpanElement}} */ #itemCounters = {};
    /** @type {HTMLUListElement} */ #list;
    /** @type {HTMLTemplateElement} */ #template;
    /** @type {PaginationComponent} */ #pagination;

    /** @type {{published: '0'|'1'|'2', visibility: '0'|'1'|'2'}} */ #statuses = {};

    constructor() { super(); }

    connectedCallback() {
        const statusRow = this.querySelector('.admin__blog-post__status-row');
        this.#statusForm = statusRow.querySelector('#admin__blog-post__status-form');
        this.#itemCounters.start = statusRow.querySelector('#admin__blog-post__items-start');
        this.#itemCounters.end = statusRow.querySelector('#admin__blog-post__items-end');
        this.#itemCounters.total = statusRow.querySelector('#admin__blog-post__items-total');

        this.#list = this.querySelector('#admin__blog-post__list');
        this.#template = this.querySelector('#admin__blog-post__template');
        this.#pagination = this.querySelector('#admin__blog-post__pagination');

        this.#statusForm.addEventListener('change', event => {
            this.#statuses[event.target.name] = event.target.value;

            this.#loadPageContent();
        });

        const actionButtons = this.#list.querySelectorAll('[post-action]');
        this.#assignButtonActions(actionButtons);

        this.#pagination.onDataUpdate = data => {
            const counters = this.#itemCounters;
            counters.start.textContent = data.offset + 1;
            counters.end.textContent = data.offset + Number(this.#list.childElementCount);
            counters.total.textContent = data.itemCount;
        };

        this.#pagination.onPageChange = (page, updateHistory = true, next = undefined) => {
            this.#list.innerHTML = `<li>${MarkupConstants.loadingSpinner}</li>`;

            this.#loadPageContent(page, updateHistory, next);
        };
    }

    connectedMoveCallback() {}

    disconnectedCallback() {}

    /**
     * @param {HTMLButtonElement[]} buttons 
     * @param {number} [id=null] 
     */
    #assignButtonActions(buttons, id = null) {
        for (const button of buttons) {
            const postId = id ?? Number(button.dataset.id);
            
            if (isNaN(postId)) {
                console.error('Post ID for button is not a number', button);
                continue;
            }

            switch (button.getAttribute('post-action')) {
                case 'delete':
                    // TODO: Use a modal web component instead of confirm()
                    button.addEventListener('click', () => {
                        const message = button.dataset.prompt ?? 'Permanently delete this post?';

                        if (confirm(message)) {
                            button.toggleAttribute('btn-loading', true);
                            blogPostService.deleteBlogPost(postId,
                                next => {
                                    // TODO: Success notification
                                    this.#loadPageContent();
                                },
                                error => {
                                    // TODO: Error notification
                                    button.toggleAttribute('btn-loading', false);
                                }
                            );
                        }
                    });
                    break;

                case 'hide':
                    button.addEventListener('click', () => {
                        button.toggleAttribute('btn-loading', true);
                        blogPostService.hideBlogPost(postId,
                            () => {
                                // TODO: Success notification
                                this.#loadPageContent();
                            },
                            error => {
                                // TODO: Error notification
                                button.toggleAttribute('btn-loading', false);
                            }
                        );
                    });
                    break;

                case 'pin':
                    button.addEventListener('click', () => {
                        button.toggleAttribute('btn-loading', true);
                        blogPostService.pinBlogPost(postId,
                            () => {
                                // TODO: Success notification
                                this.#loadPageContent();
                            },
                            error => {
                                // TODO: Error notification
                                button.toggleAttribute('btn-loading', false);
                            }
                        );
                    });
                    break;

                case 'publish':
                    // TODO: Use a modal web component instead of confirm()
                    button.addEventListener('click', () => {
                        const message = button.dataset.prompt ?? 'Publish this post?';
                        
                        if (confirm(message)) {
                            button.toggleAttribute('btn-loading', true);
                            blogPostService.publishBlogPost(postId,
                                () => {
                                    // TODO: Success notification
                                    this.#loadPageContent();
                                },
                                error => {
                                    // TODO: Error notification
                                    button.toggleAttribute('btn-loading', false);
                                }
                            );
                        }
                    });
                    break;

                case 'unhide':
                    button.addEventListener('click', () => {
                        button.toggleAttribute('btn-loading', true);
                        blogPostService.unhideBlogPost(postId,
                            () => {
                                // TODO: Success notification
                                this.#loadPageContent();
                            },
                            error => {
                                // TODO: Error notification
                                button.toggleAttribute('btn-loading', false);
                            }
                        );
                    });
                    break;

                case 'unpin':
                    button.addEventListener('click', () => {
                        button.toggleAttribute('btn-loading', true);
                        blogPostService.unpinBlogPost(postId,
                            () => {
                                // TODO: Success notification
                                this.#loadPageContent();
                            },
                            error => {
                                // TODO: Error notification
                                button.toggleAttribute('btn-loading', false);
                            }
                        );
                    });
                    break;
            }

            button.removeAttribute('btn-loading');
        }
    }

    /**
     * @param {BlogPost} newBlogPost 
     * @returns {DocumentFragment} */
    #createBlogPostItem(newBlogPost) {
        /** @type {DocumentFragment} */
        const clone = this.#template.content.cloneNode(true);

        const id = newBlogPost.id;

        /** @type {HTMLAnchorElement} */
        const link = clone.querySelector('.admin__blog-post__link');
        link.href += id;
        link.prepend(document.createTextNode(newBlogPost.title));

        /** @type {HTMLDivElement} */
        const description = clone.querySelector('.admin__blog-post__description');
        description.textContent = newBlogPost.description;

        const buttons = clone.querySelectorAll('button');
        for (const button of buttons) {
            const postAction = button.getAttribute('post-action');

            if (postAction === 'hide' && newBlogPost.isHidden) {
                button.parentElement.remove();
                continue;
            }

            if (postAction === 'pin' && newBlogPost.isPinned) {
                button.parentElement.remove();
                continue;
            }

            if (postAction === 'publish') {
                if (newBlogPost.publishedOn) {
                    button.remove();
                    continue;
                }

                button.nextElementSibling?.remove();
            }

            if (postAction === 'unhide' && !newBlogPost.isHidden) {
                button.parentElement.remove();
                continue;
            }

            if (postAction === 'unpin' && !newBlogPost.isPinned) {
                button.parentElement.remove();
                continue;
            }

            button.dataset.id = id;
        }
        this.#assignButtonActions(buttons, id);

        return clone;
    }

    /**
     * @param {number} page 
     * @param {boolean} updateHistory
     * @param {() =>  void} next 
     */
    #loadPageContent(page = this.#pagination.getData().page, updateHistory = true, next = undefined) {
        blogPostService.getBlogPostsAdminData(page, this.#pagination.getData().pageSize, this.#statuses,
            (blogPosts, paginationData) => {
                const templateItems = blogPosts.map(post => this.#createBlogPostItem(post));
                this.#list.replaceChildren(...templateItems);
                this.#pagination.setData(paginationData, updateHistory);
                next?.call(this);
            }
        );
    }
}

customElements.define('blog-post-administration-component', BlogPostAdministrationComponent);



/* IMPORT: ./components/blog-view.js */



/* IMPORT: /js/components/pagination.js */




/* IMPORT: /js/models/blog/blog-post.model.js */




/* IMPORT: /js/services/blog-post.service.js */




/* IMPORT: /js/services/session.service.js */




/* IMPORT: /js/enums/user-role.enum.js */




/* IMPORT: /js/utilities/format-date.utility.js */




/* IMPORT: /js/constants/markup-constants.js */



class BlogViewComponent extends HTMLElement {
    #editingPermissions = false;

    /**@type {PaginationComponent} */ #pagination;

    /** @type {HTMLSpanElement} */ #start;
    /** @type {HTMLSpanElement} */ #end;
    /** @type {HTMLSpanElement} */ #total;

    /** @type {HTMLElement} */ #blogPosts;
    /** @type {HTMLTemplateElement} */ #blogPostTemplate;

    constructor() {
        super();
    }

    connectedCallback() {
        sessionService.user.subscribe({
            next: user => {
                // TODO: Proper permission checks
                const editingPermissions = user && (user.role === UserRole.Administrator || user.role === UserRole.Contributor);
                this.#editingPermissions = editingPermissions;

                this.querySelectorAll('article-toolbar').forEach(toolbar => toolbar.toggleAttribute('hidden', !editingPermissions));
            }
        }, { getCurrent: true });

        this.#start = this.querySelector('#blog__items-start');
        this.#end = this.querySelector('#blog__items-end');
        this.#total = this.querySelector('#blog__items-total');

        this.#blogPosts = this.querySelector('blog-posts');
        this.#blogPostTemplate = this.querySelector('[blog-post-template]');

        this.#pagination = this.querySelector('#blog__pagination');

        const actionButtons = this.#blogPosts.querySelectorAll('[post-action]');
        this.#assignButtonActions(actionButtons);

        this.#pagination.onDataUpdate = data =>  {
            this.#start.textContent = data.offset + 1;
            this.#end.textContent = data.offset + Number(this.#blogPosts.childElementCount);
            this.#total.textContent = data.itemCount;
        };

        this.#pagination.onPageChange = (page, updateHistory = true, next = undefined) => {
            this.#blogPosts.innerHTML = MarkupConstants.loadingSpinner;

            this.#loadPageContent(page, updateHistory, next);
        };

        blogPostService.subscription.subscribe({
            next: newBlogPost => {
                const paginationData = this.#pagination.getData();
                paginationData.itemCount++;

                if (paginationData.page !== 1) {
                    paginationData.offset++;
                    this.#pagination.setData(paginationData, false);
                    return;
                }
                
                this.#blogPosts.prepend(
                    this.#createBlogPostItem(newBlogPost)
                );

                if (this.#blogPosts.childElementCount > paginationData.pageSize) {
                    this.#blogPosts.lastElementChild.remove();
                    paginationData.pageCount = Math.ceil(paginationData.itemCount / paginationData.pageSize);
                }

                this.#pagination.setData(paginationData, false);
            }
        });
    }

    connectedMoveCallback() {}

    disconnectedCallback() {}

    /**
     * @param {HTMLButtonElement[]} buttons 
     * @param {number} [id=null] 
     */
    #assignButtonActions(buttons, id = null) {
        for (const button of buttons) {
            const postId = id ?? Number(button.dataset.id);
            
            if (isNaN(postId)) {
                console.error('Post ID for button is not a number', button);
                continue;
            }

            switch (button.getAttribute('post-action')) {
                case 'delete':
                    // TODO: Use a modal web component instead of confirm()
                    button.addEventListener('click', () => {
                        const message = button.dataset.prompt ?? 'Permanently delete this post?';

                        if (confirm(message)) {
                            button.parentElement.toggleAttribute('hidden', true);
                            blogPostService.deleteBlogPost(postId,
                                next => {
                                    // TODO: Success notification
                                    this.#loadPageContent();
                                },
                                error => {
                                    // TODO: Error notification
                                    button.parentElement.removeAttribute('hidden');
                                }
                            );
                        }
                    });
                    continue;

                case 'hide':
                    button.addEventListener('click', () => {
                        button.parentElement.toggleAttribute('hidden', true);
                        blogPostService.hideBlogPost(postId,
                            () => {
                                // TODO: Success notification
                                this.#loadPageContent();
                            },
                            error => {
                                // TODO: Error notification
                                button.parentElement.removeAttribute('hidden');
                            }
                        );
                    });
                    continue;

                case 'pin':
                    button.addEventListener('click', () => {
                        button.parentElement.toggleAttribute('hidden', true);
                        blogPostService.pinBlogPost(postId,
                            () => {
                                // TODO: Success notification
                                this.#loadPageContent();
                            },
                            error => {
                                // TODO: Error notification
                                button.parentElement.removeAttribute('hidden');
                            }
                        );
                    });
                    continue;

                case 'unpin':
                    button.addEventListener('click', () => {
                        button.parentElement.toggleAttribute('hidden', true);
                        blogPostService.unpinBlogPost(postId,
                            () => {
                                // TODO: Success notification
                                this.#loadPageContent();
                            },
                            error => {
                                // TODO: Error notification
                                button.parentElement.removeAttribute('hidden');
                            }
                        );
                    });
                    continue;
            }
        }
    }

    /**
     * @param {BlogPost} newBlogPost 
     * @returns {DocumentFragment} */
    #createBlogPostItem(newBlogPost) {
        const clone = this.#blogPostTemplate.content.cloneNode(true);
        
        const id = newBlogPost.id;

        /** @type {HTMLElement} */
        const article = clone.querySelector('article');
        article.dataset.id = id;
        article.classList.toggle('article-pinned', newBlogPost.isPinned);

        /** @type {HTMLAnchorElement} */
        const headingLink = clone.querySelector('.title');
        headingLink.textContent = newBlogPost.title;
        headingLink.href += newBlogPost.permalink;

        const createdOn = clone.querySelector('.created-on');
        let dateString = formatDate(newBlogPost.createdOn)
        createdOn.textContent = dateString;
        createdOn.setAttribute('date-string', dateString);
        createdOn.title = dateString;

        /** @type {HTMLElement} */
        const modifiedOn = clone.querySelector('.modified-on');
        if (newBlogPost.modifiedOn) {
            dateString = formatDate(newBlogPost.modifiedOn);
            modifiedOn.textContent = dateString;
            modifiedOn.setAttribute('date-string', dateString);
            modifiedOn.title = dateString;
        }
        else
            modifiedOn.parentElement.remove();

        const toolbar = clone.querySelector('article-toolbar');
        toolbar.toggleAttribute('hidden', !this.#editingPermissions);

        /** @type {HTMLAnchorElement} */
        const editLink = toolbar.querySelector('[post-edit]');
        editLink.href += id;

        const actionButtons = toolbar.querySelectorAll('[post-action]');
        this.#assignButtonActions(actionButtons, id);

        clone.querySelector('.content').innerHTML = newBlogPost.contentShort;

        return clone;
    }

    /**
     * @param {number} page 
     * @param {boolean} updateHistory
     * @param {() =>  void} next 
     */
    #loadPageContent(page = this.#pagination.getData().page, updateHistory = true, next = undefined) {
        blogPostService.getBlogPosts(page, this.#pagination.getData().pageSize,
            (blogPosts, paginationData) => {
                this.#blogPosts.innerText = '';

                for (const post of blogPosts) {
                    this.#blogPosts.append(
                        this.#createBlogPostItem(post)
                    );
                }

                this.#pagination.setData(paginationData, updateHistory);

                next?.call(this);
            }
        );
    }
}

customElements.define('blog-view-component', BlogViewComponent);


/* IMPORT: ./components/gallery-manager.js */



/* IMPORT: /js/models/image-gallery/gallery.dto.model.js */




/* IMPORT: /js/models/image-gallery/gallery.model.js */




/* IMPORT: /js/services/image-gallery.service.js */




/* IMPORT: /js/utilities/format-date.utility.js */



class GalleryManagerComponent extends HTMLElement {
    static observedAttributes = [ 'properties-mode' ];

    /** @type {GalleryManagerComponent} */ #self;
    #service;
    /** @type {HTMLElement} */ #insertTarget;

    /** @type {HTMLFieldSetElement} */ #galleryListFieldset;
    /** @type {HTMLElement} */ #galleryList;
    /** @type {HTMLButtonElement} */ #btnInsertGallery;
    /** @type {HTMLButtonElement} */ #btnEditGalleryProperties;

    #managerSelectedGallery;
    /** @type {HTMLElement} */ #includedImagesContainer;
    /** @type {HTMLElement} */ #excludedImagesContainer;
    /** @type {HTMLFieldSetElement} */ #includedImagesFieldset;
    /** @type {HTMLFieldSetElement} */ #excludedImagesFieldset;
    /** @type {HTMLUListElement} */ #includedImagesUL;
    /** @type {HTMLUListElement} */ #excludedImagesUL;
    /** @type {HTMLButtonElement} */ #btnDeleteGallery;
    /** @type {HTMLButtonElement} */ #btnSaveGalleryImages;

    #managerCreateGallery;
    /** @type {HTMLFormElement} */ #galleryPropertiesForm;
    /** @type {HTMLInputElement} */ #inputId;
    /** @type {HTMLInputElement} */ #inputTitle;
    /** @type {HTMLTextAreaElement} */ #inputDescription;
    /** @type {HTMLButtonElement} */ #btnResetGalleryProperties;
    /** @type {HTMLButtonElement} */ #btnCancelGalleryProperties;
    /** @type {HTMLButtonElement} */ #btnSaveGalleryProperties;

    /** @type {HTMLInputElement} */ #currentGallery = null;

    /** @type {HTMLLIElement} */ #dragItem;
    /** @type {HTMLElement} */ #dragTarget;
    #append = false;

    constructor() {
        const component = super();
        this.#self = component;
        this.#service = imageGalleryService;
    }

    /**
     * 
     * @param {string} name 
     * @param {string} _ 
     * @param {string} newValue 
     * @returns 
     */
    attributeChangedCallback(name, _, newValue) {
        if (name !== 'properties-mode')
            return;

        if (!this.#self.hasAttribute(name))
            return;

        switch (newValue) {
            case 'active':
                this.#galleryListFieldset.disabled = true;

                this.#btnInsertGallery.disabled = true;
                this.#btnEditGalleryProperties.disabled = true;

                if (this.#currentGallery) {
                    const data = this.#currentGallery.dataset;
                    this.#inputId.defaultValue = data.galleryId;
                    this.#inputTitle.defaultValue = data.galleryTitle;
                    this.#inputDescription.defaultValue = data.galleryDescription;
                }

                this.#galleryPropertiesForm.reset();

                this.#managerSelectedGallery.toggleAttribute('hidden', true);
                this.#managerCreateGallery.removeAttribute('hidden');
                break;
            
            case 'done':
                this.#currentGallery = null;
                this.#inputId.defaultValue = 0;
                this.#inputTitle.defaultValue = '';
                this.#inputDescription.defaultValue = '';

                this.#managerSelectedGallery.removeAttribute('hidden');
                this.#managerCreateGallery.toggleAttribute('hidden', true);

                this.#galleryListFieldset.disabled = false;
                
                this.#self.removeAttribute('properties-mode');
                break;
        }
    }

    connectedCallback() {
        const self = this.#self;

        if (self.hasAttribute('insert-target'))
            this.#insertTarget = document.querySelector(`#${self.getAttribute('insert-target')}`);

        const galleryListElement = self.querySelector('gallery-list');
        this.#galleryListFieldset = galleryListElement.querySelector('fieldset');
        this.#galleryList = this.#galleryListFieldset.querySelector('ul');
        this.#btnInsertGallery = self.querySelector('[btn-insert-gallery]');
        this.#btnEditGalleryProperties = self.querySelector('[btn-edit]');

        this.#managerSelectedGallery = self.querySelector('manager-selected-gallery');
        this.#includedImagesContainer = this.#managerSelectedGallery.querySelector('images-included');
        this.#excludedImagesContainer = this.#managerSelectedGallery.querySelector('images-excluded');
        this.#includedImagesFieldset = this.#includedImagesContainer.querySelector('fieldset');
        this.#excludedImagesFieldset = this.#excludedImagesContainer.querySelector('fieldset');
        this.#includedImagesUL = this.#includedImagesFieldset.querySelector('ul');
        this.#excludedImagesUL = this.#excludedImagesFieldset.querySelector('ul');
        this.#btnDeleteGallery = this.#managerSelectedGallery.querySelector('[btn-delete-gallery]');
        this.#btnSaveGalleryImages = this.#managerSelectedGallery.querySelector('[btn-save-gallery');

        this.#managerCreateGallery = self.querySelector('manager-create-gallery');
        this.#galleryPropertiesForm = this.#managerCreateGallery.querySelector('form');
        this.#inputId = this.#galleryPropertiesForm.querySelector('[name="id"]');
        this.#inputTitle = this.#galleryPropertiesForm.querySelector(['[name="title"]']);
        this.#inputDescription = this.#galleryPropertiesForm.querySelector('[name="description"]');
        this.#btnResetGalleryProperties = this.#galleryPropertiesForm.querySelector('[type="reset"]');
        this.#btnCancelGalleryProperties = this.#galleryPropertiesForm.querySelector('[btn-cancel-gallery]');
        this.#btnSaveGalleryProperties = this.#galleryPropertiesForm.querySelector('[type="submit"]');

        if (this.#insertTarget)
            this.#btnInsertGallery.removeAttribute('hidden');

        galleryListElement.addEventListener('change', event => {
            if (!event.target.checked)
                return;

            event.stopPropagation();

            this.#btnInsertGallery.disabled = false;
            this.#btnEditGalleryProperties.disabled = false;
            
            const galleryId = Number(event.target.dataset.galleryId);
            this.#renderImageLists(galleryId);
        });

        this.#btnInsertGallery.addEventListener('click', () => this.#insertGallery());

        this.#btnEditGalleryProperties.addEventListener('click', () => {
            this.#currentGallery = this.#galleryList.querySelector(':checked');
            this.#self.setAttribute('properties-mode', 'active');
        });

        this.#btnCancelGalleryProperties.addEventListener('click', () => {
            this.#self.setAttribute('properties-mode', 'done');
        });

        this.#setupDragTargets();

        this.#btnDeleteGallery.addEventListener('click', () => this.#deleteGallery());
        this.#btnSaveGalleryImages.addEventListener('click', () => this.#saveGalleryImages());
        
        this.#galleryPropertiesForm.addEventListener('submit', event => {
            event.preventDefault();

            this.#saveGalleryProperties();
        });

        const inputs = [this.#inputTitle, this.#inputDescription];
        this.#galleryPropertiesForm.addEventListener('reset', () => {
            this.#btnResetGalleryProperties.disabled = true;
            this.#btnResetGalleryProperties.toggleAttribute('hidden', true);
            this.#btnSaveGalleryProperties.disabled = true;
        });
        this.#inputTitle.addEventListener('input', () => {
            this.#setGalleryPropertiesButtonsStatus(inputs);

            if (this.#currentGallery)
                this.#currentGallery.dataset.galleryTitle = this.#inputTitle.value;
        });
        this.#inputDescription.addEventListener('input', () => {
            this.#setGalleryPropertiesButtonsStatus(inputs);

            if (this.#currentGallery)
                this.dataset.galleryDescription = this.#inputDescription.value;
        });

        this.#service.galleries.subscribe({
            next: galleries => this.#updateGalleriesMarkup(galleries),
            nextIndexed: (_, gallery) => this.#updateGalleryMarkup(gallery)
        }, { getCurrent: true });

        this.#galleryListFieldset.disabled = false;
    }

    disconnectedCallback() {}

    connectedMoveCallback() {}

    async #deleteGallery() {
        this.#btnDeleteGallery.disabled = true;
        this.#btnSaveGalleryImages.disabled = true;
        this.#galleryListFieldset.disabled = true;
        this.#btnInsertGallery.disabled = true;
        this.#btnEditGalleryProperties.disabled = true;

        const galleryId = Number(this.#galleryListFieldset.querySelector(':checked').dataset.galleryId);

        if (!galleryId) throw new Error("Can't find gallery id to delete");

        if (await this.#service.deleteGallery(galleryId)) {
            this.#galleryListFieldset.disabled = false;
        }
    }

    /** @param {HTMLUListElement} list */
    #dropItem(list) {
        this.#dragTarget?.style.removeProperty(this.#append ? 'border-bottom' : 'border-top');

        if (this.#dragItem === this.#dragTarget)
            return;

        if (!this.#append && this.#dragItem === this.#dragTarget?.previousElementSibling)
            return;

        if (this.#append || !this.#dragTarget) {
            list.appendChild(this.#dragItem);
        }
        else {
            list.insertBefore(this.#dragItem, this.#dragTarget);
        }

        this.#btnSaveGalleryImages.disabled = false;
    }

    async #insertGallery() {
        const checked = this.#galleryList.querySelector(':checked');

        if (!checked)
            throw new Error('Insert button clicked with no gallery selected');

        if (!this.#insertTarget)
            throw new Error('No place to insert gallery registered');

        this.#service.getGallery(Number(checked.dataset.galleryId), gallery => {
            if (!gallery)
                throw new Error('Gallery not found');

            const self = this.#self;
            const finishEvent = self.getAttribute('finish-event');
            
            this.#insertTarget.dataset.galleryInsert = JSON.stringify(gallery);
            if (finishEvent) {
                const event = new CustomEvent(finishEvent, { bubbles: true });
                self.dispatchEvent(event);
            }
        });
    }

    /** 
     * @param {Gallery[]} galleries
     * @returns {number|null}
     */
    #renderGalleryList(galleries) {
        const selectedId = this.#galleryList.querySelector(':checked')?.dataset.galleryId;

        this.#btnInsertGallery.disabled = true;
        this.#btnEditGalleryProperties.disabled = true;
        this.#galleryList.textContent = ''; // TODO: Loading spinner animation
        
        const listItems = [];
        let selectedIdExists = false;
        for (const gallery of galleries) {
            const listItem = document.createElement('li');
            listItem.classList.add('manager-list-item');
            listItems.push(listItem);

            const label = document.createElement('label');
            label.classList.add('gallery-title');
            label.title = gallery.title;
            listItem.appendChild(label);

            const input = document.createElement('input');
            input.toggleAttribute('hidden', true);
            input.type = 'radio';
            input.name = 'galleries';
            const data = input.dataset;
            data.galleryId = gallery.id;
            data.galleryTitle = gallery.title;
            data.galleryDescription = gallery.description;
            data.galleryCreatedOn = formatDate(gallery.createdOn);
            data.galleryModifiedOn = formatDate(gallery.modifiedOn);
            label.appendChild(input);

            label.appendChild(document.createTextNode(gallery.title));

            if (selectedId && selectedId === gallery.id) {
                input.checked = true;
                selectedIdExists = true;
                this.#btnInsertGallery.disabled = false;
                this.#btnEditGalleryProperties.disabled = false;
            }
        }

        this.#galleryList.replaceChildren(...listItems);

        if (selectedIdExists)
            return selectedId;

        return null;
    }

    /** @param {number|null} galleryId */
    #renderImageLists(galleryId = null) {
        this.#includedImagesFieldset.disabled = true;
        this.#excludedImagesFieldset.disabled = true;
        this.#btnDeleteGallery.disabled = true;
        this.#btnSaveGalleryImages.disabled = true;

        this.#service.getImages(images => {
            const includedImages = [];
            const excludedImages = new Map();

            for (const image of images) {
                const listItem = document.createElement('li');
                listItem.classList = 'manager-list-item';
                listItem.draggable = !!galleryId;

                const label = document.createElement('label');
                label.classList = 'image-title';
                label.title = image.title;
                listItem.appendChild(label);

                const input = document.createElement('input');
                input.type = 'hidden';
                input.dataset.imageId = image.id;
                label.appendChild(input);
                
                label.appendChild(document.createTextNode(image.title));

                excludedImages.set(image.id, listItem);
            }

            if (!galleryId) {
                this.#includedImagesUL.replaceChildren(...includedImages);
                this.#excludedImagesUL.replaceChildren(...excludedImages.values());
                this.#btnDeleteGallery.disabled = true;
                return;
            }

            this.#service.getGallery(galleryId, gallery => {
                for (const id of gallery.imageIds) {
                    includedImages.push(excludedImages.get(id));
                    excludedImages.delete(id);
                }

                this.#includedImagesUL.replaceChildren(...includedImages);
                this.#excludedImagesUL.replaceChildren(...excludedImages.values());

                this.#includedImagesFieldset.disabled = false;
                this.#excludedImagesFieldset.disabled = false;
                this.#btnDeleteGallery.disabled = !!this.#includedImagesUL.firstElementChild;
            });

            
        });
    }

    async #saveGalleryImages() {
        this.#btnSaveGalleryImages.disabled = true;
        this.#btnDeleteGallery.disabled = true;
        this.#galleryListFieldset.disabled = true;
        this.#includedImagesFieldset.disabled = true;
        this.#excludedImagesFieldset.disabled = true;

        const galleryId = Number(this.#galleryListFieldset.querySelector(':checked').dataset.galleryId);

        const imageIds = Array.from(this.#includedImagesFieldset.querySelectorAll('input'))
            .map(input => Number(input.dataset.imageId));

        if (await this.#service.updateGalleryImages(galleryId, imageIds)) {
            this.#galleryListFieldset.disabled = false;
            this.#includedImagesFieldset.disabled = false;
            this.#excludedImagesFieldset.disabled = false;
        }
    }

    async #saveGalleryProperties() {
        this.#btnResetGalleryProperties.disabled = true;
        this.#btnResetGalleryProperties.toggleAttribute('hidden', true);
        this.#btnCancelGalleryProperties.disabled = true;
        this.#btnSaveGalleryProperties.disabled = true;

        const gallery = new GalleryDTO(new FormData(this.#galleryPropertiesForm));

        if (Number(this.#inputId.value) === 0) {
            if (await this.#service.createGallery(gallery)) {
                this.#self.setAttribute('properties-mode', 'done');
                this.#btnCancelGalleryProperties.disabled = false;
            }
            return;
        }

        if (await this.#service.updateGallery(gallery)) {
            this.#self.setAttribute('properties-mode', 'done');
            this.#btnCancelGalleryProperties.disabled = false;
        }
    }

    /**
     * @param {HTMLInputElement[]} fields 
     */
    #setGalleryPropertiesButtonsStatus(fields) {
        const noChanges = fields.every(field => field.value === field.defaultValue);
        this.#btnResetGalleryProperties.disabled = noChanges;
        this.#btnResetGalleryProperties.toggleAttribute('hidden', noChanges);
        this.#btnSaveGalleryProperties.disabled = noChanges || !!fields.find(field => !field.checkValidity());
    }

    #setupDragTargets() {
        for (const list of [ this.#includedImagesUL, this.#excludedImagesUL ]) {
            list.addEventListener('dragstart', event => {
                event.stopPropagation();
                this.#dragItem = event.target;
            });
        }

        for (const container of [ this.#includedImagesContainer, this.#excludedImagesContainer ]) {
            container.addEventListener('dragenter', event => {
                event.preventDefault();

                if (this.#dragItem.className !== 'manager-list-item')
                    return;

                /** @type {HTMLElement} */
                let target = event.originalTarget;
                let append = false;

                switch (target.localName) {
                    case 'images-included':
                    case 'images-excluded':
                        target = container.querySelector('ul').lastElementChild;
                        append = true;
                        break;

                    case 'label':
                        target = target.parentElement;
                        break;

                    default:
                        target = container.querySelector('ul').firstElementChild;
                        break;
                }

                this.#dragTarget?.style.removeProperty(this.#append ? 'border-bottom' : 'border-top');

                this.#dragTarget = target;
                this.#append = append;

                if (target === this.#dragItem)
                    return;

                if (!append && target?.previousElementSibling === this.#dragItem)
                    return;

                this.#dragTarget?.style.setProperty(this.#append ? 'border-bottom' : 'border-top', '1px solid');
            });

            container.addEventListener('dragover', event => event.preventDefault());

            container.addEventListener('dragleave', event => {
                if (container.contains(event.relatedTarget))
                    return;

                this.#dragTarget?.style.removeProperty(this.#append ? 'border-bottom' : 'border-top');
                this.#dragTarget = null;
                this.#append = false;
            });

            container.addEventListener('drop', () => {
                if (this.#dragItem?.className === 'manager-list-item')
                    this.#dropItem(container.querySelector('ul'));

                this.#dragItem = null;
                this.#dragTarget = null;
                this.#append = false;
                this.#btnDeleteGallery.disabled = !!this.#includedImagesUL.firstElementChild;
            });
        }
    }

    /** @param {Gallery[]} galleries */
    #updateGalleriesMarkup(galleries) {
        const localDate = new Date(this.#self.dataset.modifiedOn);

        if (this.#service.galleryModified <= localDate)
            return;
        
        const galleryId = this.#renderGalleryList(galleries)
        this.#renderImageLists(galleryId);

        this.dataset.modifiedOn = formatDate(this.#service.galleryModified, true);
    }

    /** @param {Gallery} gallery */
    #updateGalleryMarkup(gallery) {
        /** @type {HTMLInputElement} */
        const galleryInput = this.#galleryListFieldset.querySelector(`[data-gallery-id="${gallery.id}"]`);

        if (!galleryInput)
            throw new Error('Updated gallery not found in list');

        const data = galleryInput.dataset;
        data.galleryTitle = gallery.title;
        data.galleryDescription = gallery.description;
        data.galleryCreatedOn = formatDate(gallery.createdOn);
        data.galleryModifiedOn = formatDate(gallery.modifiedOn);

        galleryInput.nextSibling.textContent = gallery.title;
        galleryInput.parentElement.title = gallery.title;

        this.dataset.modifiedOn = formatDate(this.#service.galleryModified, true);

        const checked = this.#galleryListFieldset.querySelector(':checked');
        if (galleryInput !== checked)
            return;

        this.#renderImageLists(gallery.id);
    }
}
customElements.define('gallery-manager-component', GalleryManagerComponent);



/* IMPORT: ./components/image-gallery.js */

class ImageGalleryComponent extends HTMLElement {
    /** @type {ImageGalleryComponent} */
    #self;

    #imageManager;
    #galleryManager;

    #imageUploadButton;
    #cancelUploadButton;

    #galleryCreateButton;
    #galleryCancelButton;
    
    constructor() {
        const component = super();
        this.#self = component;
    }

    connectedCallback() {
        const self = this.#self;

        this.#imageManager = self.querySelector('image-manager-component');
        this.#galleryManager = self.querySelector('gallery-manager-component');

        if (!this.#imageManager || !this.#galleryManager)
            throw new Error(`Image Manager (${!!this.#imageManager}) or Gallery Manager (${!!this.#galleryManager}) not found in Image Gallery`);

        const finishEvent = self.getAttribute('finish-event');
        if (finishEvent) {
            this.#imageManager.setAttribute('finish-event', finishEvent);
            this.#galleryManager.setAttribute('finish-event', finishEvent);
        }

        this.#imageUploadButton = self.querySelector('[btn-image-upload');
        this.#cancelUploadButton = self.querySelector('[btn-cancel-upload]');

        this.#galleryCreateButton = self.querySelector('[btn-gallery-create]');
        this.#galleryCancelButton = self.querySelector('[btn-cancel-create]');

        this.#imageUploadButton.addEventListener('click', () => {
            this.#imageManager.setAttribute('upload-mode', 'active');
        });
        this.#cancelUploadButton.addEventListener('click', () => {
            this.#imageManager.setAttribute('upload-mode', 'done');
        });

        this.#galleryCreateButton.addEventListener('click', () => {
            this.#galleryManager.setAttribute('properties-mode', 'active');
        });
        this.#galleryCancelButton.addEventListener('click', () => {
            this.#galleryManager.setAttribute('properties-mode', 'done');
        });

        const tabContainers = self.querySelectorAll('[data-tab]');
        const managerTabs = self.querySelector('manager-tabs');

        const btnImages = managerTabs.querySelector('.tab-images');
        const btnGalleries = managerTabs.querySelector('.tab-galleries');

        btnImages.addEventListener('click', () => {
            this.#toggleTab(btnGalleries, false);
            this.#toggleTab(btnImages, true);
        });

        btnGalleries.addEventListener('click', () => {
            this.#toggleTab(btnImages, false);
            this.#toggleTab(btnGalleries, true);
        });

        new MutationObserver((mutationList, _) =>
            this.#attributeObservation(mutationList, 'upload-mode', this.#imageUploadButton, this.#cancelUploadButton)
        ).observe(this.#imageManager, { attributeFilter: [ 'upload-mode' ] });

        new MutationObserver((mutationList, _) =>
            this.#attributeObservation(mutationList, 'properties-mode', this.#galleryCreateButton, this.#galleryCancelButton)
        ).observe(this.#galleryManager, { attributeFilter: [ 'properties-mode' ] });

        this.#imageUploadButton.disabled = false;
        this.#galleryCreateButton.disabled = false;
    }

    /**
     * @param {MutationRecord[]} mutationList
     * @param {string} attributeName 
     * @param {HTMLButtonElement} btnActivate
     * @param {HTMLButtonElement} btnDeactivate 
     * */
    #attributeObservation(mutationList, attributeName, btnActivate, btnDeactivate) {
        for (const mutation of mutationList) {
            if (mutation.type !== 'attributes')
                continue;

            if (mutation.attributeName !== attributeName)
                continue;

            switch (mutation.target.getAttribute(attributeName)) {
                case 'active':
                    btnActivate.toggleAttribute('hidden', true);
                    btnDeactivate.removeAttribute('hidden');
                    break;

                default:
                    btnActivate.removeAttribute('hidden');
                    btnDeactivate.toggleAttribute('hidden', true);
                    break;
            }
        }
    }

    /**
     * @param {HTMLButtonElement} button
     * @param {HTMLElement} pane 
     * @param {boolean} activate 
     */
    #toggleTab(button, activate) {
        button.classList.toggle('active', activate);
        button.ariaPressed = activate ? 'true' : 'false';

        const pane = button.ariaControlsElements.at(0);

        pane.toggleAttribute('hidden', !activate);
    }
}
customElements.define('image-gallery-component', ImageGalleryComponent);


/* IMPORT: ./components/image-manager.js */



/* IMPORT: /js/utilities/format-date.utility.js */




/* IMPORT: /js/models/image-gallery/image.model.js */




/* IMPORT: /js/models/image-gallery/image.dto.model.js */




/* IMPORT: /js/services/image-gallery.service.js */



class ImageManagerComponent extends HTMLElement {
    static observedAttributes = [ 'upload-mode' ];

    /** @type {ImageManagerComponent} */
    #self;
    #service;
    #galleryPath;
    #insertTarget;

    #listFieldset;
    #filesFieldset;
    /** @type {HTMLUListElement} */
    #fileList;
    /** @type {HTMLTemplateElement} */
    #imageItemTemplate;
    #insertImageButton;
    #deleteButton;
    #imageProperties;
    #imagePropertiesContent;
    /** @type {HTMLTemplateElement} */
    #propertiesTemplate;
    #uploadTemplete;
    #resetButton;
    #saveButton;

    constructor() {
        const component = super();
        this.#self = component;
        this.#service = imageGalleryService;
    }

    /**
     * 
     * @param {string} name 
     * @param {string} _ 
     * @param {string} newValue 
     */
    attributeChangedCallback(name, _, newValue) {
        if (name !== 'upload-mode')
            return;

        if (!this.#self.hasAttribute(name))
            return;

        switch (newValue) {
            case 'active':
                this.#listFieldset.disabled = true;

                this.#insertImageButton.disabled = true;
                this.#deleteButton.disabled = true;
                const checked = this.#fileList.querySelector(':checked');
                if (checked) checked.checked = false;

                this.#resetButton.disabled = true;
                this.#saveButton.disabled = true;
                this.#saveButton.textContent = this.#saveButton.dataset.contentUpload;
                this.#renderImageUpload();
                break;

            case 'done':
                this.#listFieldset.disabled = false;
                this.#saveButton.textContent = this.#saveButton.dataset.contentEdit;
                this.#imageProperties.innerHTML = this.#imagePropertiesContent;
                this.#self.removeAttribute('upload-mode');
                break;
        }
    }

    connectedCallback() {
        const self = this.#self;

        if (self.hasAttribute('insert-target'))
            this.#insertTarget = document.querySelector(`#${self.getAttribute('insert-target')}`);

        const managerFiles = self.querySelector('manager-files');
        this.#listFieldset = managerFiles.querySelector('fieldset');
        this.#galleryPath = managerFiles.dataset.galleryPath;
        this.#filesFieldset = managerFiles.querySelector('fieldset');
        this.#fileList = managerFiles.querySelector('ul');
        this.#imageItemTemplate = managerFiles.querySelector('[item-template]');
        this.#insertImageButton = self.querySelector('[btn-insert]');
        this.#deleteButton = self.querySelector('[btn-delete]');
        const form = self.querySelector('form');
        this.#imageProperties = self.querySelector('image-properties');
        this.#imagePropertiesContent = this.#imageProperties.innerHTML;
        this.#propertiesTemplate = self.querySelector('[properties-template]');
        this.#uploadTemplete = self.querySelector('[upload-template]');
        this.#resetButton = self.querySelector('[btn-reset]');
        this.#saveButton = self.querySelector('[btn-save]');

        if (this.#insertTarget)
            this.#insertImageButton.removeAttribute('hidden');

        this.#insertImageButton.addEventListener('click', event => this.#insertImage(event));

        this.#deleteButton.addEventListener('click', event => this.#deleteImage(event));

        managerFiles.addEventListener('change', event => {
            if (!event.target.checked)
                return;

            event.stopPropagation();

            this.#insertImageButton.disabled = false;
            this.#deleteButton.disabled = false;

            this.#renderImageProperties(event.target.dataset);
        });

        form.addEventListener('submit', event => this.#saveImage(event));

        form.addEventListener('reset', () => {
            this.#resetButton.disabled = true;
            this.#saveButton.disabled = true;

            this.#imageProperties.querySelector('[img-upload]')?.remove();
        });

        this.#service.images.subscribe({
            next: images => this.#renderImageList(images),
            nextIndexed: (_, image) => this.#updateImageListItem(image)
        }, { getCurrent: true });

        this.#filesFieldset.disabled = false;
    }

    disconnectedCallback() {}

    connectedMoveCallback() {}

    async #deleteImage(event) {
        event.stopPropagation();
        this.#deleteButton.disabled = true;
        this.#insertImageButton.disabled = true;
        this.#filesFieldset.disabled = true;

        const checked = this.#fileList.querySelector(':checked');

        if (!checked)
            throw new Error('Delete button clicked with no file selected');

        const id = Number(checked.dataset.imageId);

        if (id < 1)
            throw new Error('Invalid image id');

        if (await this.#service.deleteImage(id)) {
            this.#deleteButton.disabled = false;
            this.#insertImageButton.disabled = false;
            this.#filesFieldset.disabled = false;
        }
    }

    async #insertImage(event) {
        event.stopPropagation();

        const checked = this.#fileList.querySelector(':checked');

        if (!checked)
            throw new Error('Insert button clicked with no file selected');

        if (!this.#insertTarget)
            throw new Error('No place to insert image registered');

        const image = this.#service.getImage(Number(checked.dataset.imageId));

        if (!image)
            throw new Error('Image not found');

        const self = this.#self;
        const finishEvent = self.getAttribute('finish-event');
        this.#insertTarget.dataset.imageInsert = JSON.stringify(image);
        if (finishEvent) {
            const event = new CustomEvent(finishEvent, { bubbles: true });
            self.dispatchEvent(event);
        }
    }

    /** @param {Image[]} images  */
    #renderImageList(images) {
        const localDate = new Date(this.#self.dataset.modifiedOn);

        if (this.#service.imageModified <= localDate)
            return;

        this.#fileList.textContent = ''; // TODO: Loading spinner animation
        this.#imageProperties.innerHTML = this.#imagePropertiesContent;
        this.#insertImageButton.disabled = true;
        this.#deleteButton.disabled = true;
        this.#resetButton.disabled = true;
        this.#saveButton.disabled = true;

        images.forEach(image => {
            const template = this.#imageItemTemplate.content.cloneNode(true);

            const imageUrl = this.#galleryPath + image.filename;

            template.querySelector('label').title = image.title;

            /** @type {HTMLInputElement} */
            const input = template.querySelector('input');
            input.insertAdjacentText('afterend', image.title);

            /** @type {DOMStringMap} */
            const data = input.dataset;
            data.imageId = image.id;
            data.imageFilename = image.filename;
            data.imageUrl = imageUrl;
            data.imageTitle = image.title;
            data.imageDefaultTitle = image.title;
            data.imageDescription = image.description;
            data.imageDefaultDescription = image.description;
            data.imageCreatedOn = formatDate(image.createdOn);
            data.imageModifiedOn = formatDate(image.modifiedOn);

            /** @type {HTMLImageElement} */
            const img = template.querySelector('img');
            img.src = imageUrl;

            this.#fileList.appendChild(template);
        });

        this.#self.dataset.modifiedOn = formatDate(this.#service.imageModified, true);
    }

    #renderImageProperties(data) {
        this.#imageProperties.textContent = ''; // TODO: Loading spinner animation
        this.#resetButton.disabled = true;
        this.#saveButton.disabled = true;

        const template = this.#propertiesTemplate.content.cloneNode(true);
        template.querySelector('[name="id"]').defaultValue = data.imageId;
        template.querySelector('.image-header').textContent = data.imageFilename;

        const name = template.querySelector('[name="title"]');
        name.defaultValue = data.imageDefaultTitle;
        name.value = data.imageTitle;
        name.addEventListener('input', () => {
            data.imageTitle = name.value;
            this.#setUndoSaveButtonStatus([name, description]);
        });

        const description = template.querySelector('[name="description"]');
        description.defaultValue = data.imageDefaultDescription;
        description.value = data.imageDescription;
        description.addEventListener('input', () => {
            data.imageDescription = description.value;
            this.#setUndoSaveButtonStatus([name, description]);
        });

        template.querySelector('.created-on').textContent = data.imageCreatedOn;
        const modifiedOn = template.querySelector('.modified-on')
        if (data.imageModifiedOn)
            modifiedOn.textContent = data.imageModifiedOn;
        else
            modifiedOn.parentElement.innerHTML = '&nbsp;';

        const img = document.createElement('img');
        img.src = data.imageUrl;
        img.alt = 'Image preview';
        template.querySelector('.image-preview').appendChild(img);
        
        this.#imageProperties.appendChild(template);
        this.#setUndoSaveButtonStatus([name, description]);
    }
    
    #renderImageUpload() {
        const template = this.#uploadTemplete.content.cloneNode(true);
        /** @type {HTMLDivElement} */
        const imagePreview = template.querySelector('.image-preview');
        /** @type {HTMLInputElement} */
        const fileInput = template.querySelector('input-file');
        const titleInput = template.querySelector('[name="title"]');
        const descInput = template.querySelector('[name="description"]');

        const reader = new FileReader();
        reader.addEventListener('load', event => {
            const img = document.createElement('img');
            img.src = event.target.result;
            img.alt = 'Image preview';
            img.setAttribute('img-upload', '');
            const title = fileInput.files.item(0).name.replace(/(\.[a-zA-Z0-9]{1,4})$/, '');
            titleInput.value = title.charAt(0).toUpperCase() + title.slice(1);
            imagePreview.replaceChildren(img);
        });
        
        fileInput.addEventListener('change', event => {
            event.stopPropagation();
            
            if (!fileInput.files.length)
                return;

            const file = fileInput.files.item(0);
            reader.readAsDataURL(file);

            this.#resetButton.disabled = false;
            this.#setUndoSaveButtonStatus([fileInput, titleInput, descInput]);
        });

        titleInput.defaultValue = '';

        [titleInput, descInput].forEach(input => input.addEventListener('input', event => {
            event.stopPropagation();
            this.#setUndoSaveButtonStatus([fileInput, titleInput, descInput]);
        }));

        this.#imageProperties.textContent = '';
        this.#imageProperties.appendChild(template);
    }

    /** @param {Event} event */
    async #saveImage(event) {
        event.preventDefault();
        
        this.#saveButton.disabled = true;
        const formData = new FormData(event.target);
        const imageDTO = new ImageDTO(formData);

        if (formData.has('image')) {
            /** @type {File} */
            const file = formData.get('image');

            const fileReader = new FileReader();
            fileReader.addEventListener('load', async event => {
                // TODO: Create something akin to an "ImageUploadDTO" to formalize the structure
                const data = {
                    dto: imageDTO,
                    file: event.target.result.replace(/^data:\w*\/\w*;base64,/, '')
                };

                if (await this.#service.createImage(data)) {
                    this.#self.setAttribute('upload-mode', 'done');
                    this.#filesFieldset.disabled = false;
                }
            });
            fileReader.readAsDataURL(file);

            return;
        }
        
        if (await this.#service.updateImage(imageDTO)) {
            // TODO: Notification
        }
    }

    /**
     * @param {HTMLInputElement[]} fields 
     */
    #setUndoSaveButtonStatus(fields) {
        const noChanges = fields.every(field => field.value === field.defaultValue);
        this.#resetButton.disabled = noChanges;
        this.#saveButton.disabled = noChanges || !!fields.find(field => !field.checkValidity());
    }

    /** @param {Image} image  */
    #updateImageListItem(image) {
        /** @type {HTMLInputElement} */
        const input = this.#fileList.querySelector(`input[data-image-id="${image.id}"]`);

        if (!input)
            throw new Error(`Image list item with id ${image.id} can't be found`);
        
        if (input.nextSibling)
            input.nextSibling.textContent = image.title;
        else
            input.insertAdjacentText('afterend', image.title);

        /** @type {DOMStringMap} */
        const data = input.dataset;
        data.imageTitle = image.title;
        data.imageDefaultTitle = image.title;
        data.imageDescription = image.description;
        data.imageDefaultDescription = image.description;
        data.imageModifiedOn = formatDate(image.modifiedOn);

        this.#self.dataset.modifiedOn = formatDate(this.#service.imageModified, true);

        this.#renderImageProperties(data);
    }
}
customElements.define('image-manager-component', ImageManagerComponent);


/* IMPORT: ./components/modal-popup.js */

class ModalPopupContainer extends HTMLElement {
    /** @type ModalPopupContainer */
    #self;
    #popup;
    #root;
    #body;

    constructor() {
        const component = super();
        this.#self = component;
    }

    connectedCallback() {
        // TODO: Implement some kind of focus trap

        const self = this.#self;
        this.#root = document.querySelector('html');
        this.#body = document.querySelector('body');
        this.#popup = self.querySelector('modal-popup');

        
        if (!self.hasAttribute('hidden')) {
            this.#root.style.overflow = 'hidden';
            this.#body.style.overflow = 'hidden';
        }
        
        if (self.id)
            document.querySelector(`[modal-target="${self.id}"]`)?.addEventListener('click', () => {
                self.removeAttribute('hidden');
                this.#root.style.overflow = 'hidden';
                this.#body.style.overflow = 'hidden';
            });

        self.addEventListener('click', event => {
            event.stopPropagation();

            if (!this.#popup.contains(event.target))
                this.#close(event);
        });

        self.addEventListener('closemodal', event => {
            event.stopPropagation();
            this.#close(event);
        });
    }

    #close(event) {
        event.preventDefault();
        this.#self.toggleAttribute('hidden', true);
        this.#root.style.removeProperty('overflow');
        this.#body.style.removeProperty('overflow');
    }
}
customElements.define('modal-popup-component', ModalPopupContainer);


/* IMPORT: ./components/tabs.js */

class TabsComponent extends HTMLElement {
    /** @type {HTMLElement} */ #container;
    constructor() { super(); }

    connectedCallback() {
        const containerId = this.getAttribute('container-target');
        this.#container = document.querySelector(containerId);

        /** @type {NodeListOf<HTMLButtonElement>} */
        const buttons = this.querySelectorAll('[tab-target]');

        for (const button of buttons) {
            const target = this.#container.querySelector(button.getAttribute('tab-target'));

            button.addEventListener('click', () => {
                buttons.forEach(btn => btn.disabled = btn === button);

                const children = this.#container.children;
                for (const child of children) {
                    child.toggleAttribute('hidden', child !== target);
                }
            });
        }
    }

    connectedMoveCallback() {}

    disconnectedCallback() {}
}

customElements.define('tabs-component', TabsComponent);



/* IMPORT: ./components/text-editor.js */



/* Non-elemental components */


/* IMPORT: ./components/non-elemental/config-csv.js */



/* IMPORT: /js/models/configuration.model.js */





// TODO: Export configuration object

class ConfigCSV {
    #components;
    #textFieldCollections;
    #stringFields;

    #onChanges = [];

    constructor() {
        const components = Array.from(document.querySelectorAll('config-csv-component'));
        this.#components = components;

        const defaultValues = components.map(c => c.querySelector('default-value'));
        const fieldsets = components.map(c => c.querySelector('fieldset'));
        this.#stringFields = components.map(c => this.#findStringField({ at: c }));
        const addButtons = components.map(c => this.#findAddButton({ at: c }));
        this.#textFieldCollections = components.map(c => this.#findTextField({ at: c, all: true }));
        const deleteButtonCollections = components.map(c => this.#findDeleteButton({ at: c, all: true }));

        const toggles = components.map(c => c.querySelector('[default-toggle'));

        components.forEach((component, key) => {
            component.dataset.fields = this.#textFieldCollections[key].length;

            toggles[key].addEventListener('change', () => {
                const isDefault = !!toggles[key].checked;

                defaultValues[key].toggleAttribute('hidden', !isDefault);
                defaultValues[key].nextElementSibling.toggleAttribute('hidden', isDefault);
                
                fieldsets[key].disabled = isDefault;

                const textChanges = !isDefault && this.#hasNewValue(this.#stringFields[key]);
                const hasChanges = textChanges || this.#hasNewValue(toggles[key]);
                component.toggleAttribute('has-changes', hasChanges);

                this.#emitChanges(this.#hasValidChanges());
            });

            addButtons[key].addEventListener('click', () => {
                this.#addItem(key);
            });

            this.#textFieldCollections[key].forEach(field => this.#addEventListeners(field, key));

            deleteButtonCollections[key].forEach(btn => {
                btn.addEventListener('click', event => this.#deleteItem(event, key));
            });

            component.removeAttribute('hidden');
        });
    }

    #addEventListeners(field, key) {
        const component = this.#components[key];

        field.addEventListener('input', () => {
            this.#findAddButton({ at: component }).disabled = this.#isInvalid(key);
            this.#findStringField({ at: component }).value = this.#textFieldCollections[key].map(f => f.value).join(', ');
            component.toggleAttribute('has-changes', this.#hasNewValue(this.#stringFields[key]));
            this.#findAddButton({ at: component }).disabled = this.#isInvalid(key);
            this.#emitChanges(this.#hasValidChanges());
        });

        field.addEventListener('change', () => {
            field.value = field.value.toLocaleLowerCase();
            this.#findStringField({ at: component }).value = this.#textFieldCollections[key].map(f => f.value).join(', ');
            this.#emitChanges(this.#hasValidChanges());
        });
    }

    #addItem(key) {
        const component = this.#components[key];
        this.#findAddButton({ at: component }).disabled = true;

        const template = component.querySelector('template');
        const itemNumber = Number(component.dataset.fields);

        const newItem = template.content.cloneNode(true);
        const textField = this.#findTextField({ at: newItem });
        textField.id = textField.id.replace('template', `${itemNumber}`);
        this.#addEventListeners(textField, key);

        const deleteButton = this.#findDeleteButton({ at: newItem });
        deleteButton.addEventListener('click', event => {
            this.#deleteItem(event, key);
        });
        
        template.parentNode.appendChild(newItem);
        this.#textFieldCollections[key].push(textField);
        textField.focus();

        component.dataset.fields = itemNumber + 1;
        
        this.#emitChanges(this.#hasValidChanges());
    }

    #deleteItem(event, key) {
        event.preventDefault();

        if (event.shiftKey) {
            let item = event.target;
            while (item.localName !== 'li') {
                item = item.parentNode;
            }
            const field = this.#findTextField({ at: item });
            this.#textFieldCollections[key] = this.#textFieldCollections[key].filter(f => f !== field);
            this.#stringFields[key].value = this.#textFieldCollections[key].map(f => f.value).join(', ');

            item.remove();

            this.#emitChanges(this.#hasValidChanges());
        }
        else
            alert('Hold shift when clicking to delete item.');
    }

    #emitChanges([hasChanges, isValid]) {
        this.#onChanges.forEach(func => func.call(this, hasChanges, isValid));
    }

    #findAddButton({ at, all = false }) {
        return this.#findQuery(at, '[btn-add]', all)
    }

    #findDeleteButton({ at, all = false }) {
        return this.#findQuery(at, '[btn-delete]', all)
    }

    #findStringField({ at, all = false }) {
        return this.#findQuery(at, '[input-string]', all);
    }

    #findTextField({ at, all = false }) {
        return this.#findQuery(at, '[text-item]', all);
    }

    #findQuery(container, query, findAll) {
        if (findAll)
            return Array.from(container.querySelectorAll(query));

        return container.querySelector(query);
    }

    async getChanges() {
        return this.#components
            .filter(c => c.hasAttribute('has-changes'))
            .map(c => {
                const id = Number(c.querySelector('[config-id]').value.trim());
                const stringField = this.#findStringField({ at: c });

                if (id < 0)
                    return new Configuration({
                        id: 0,
                        name: stringField.dataset.constant.trim(),
                        value: stringField.value.trim(),
                        isActive: true
                });

                const toggle = c.querySelector('[default-toggle]');

                const data = { id: id, name: stringField.dataset.constant.trim() };

                if (toggle.checked !== Boolean(toggle.dataset.originalValue))
                    data.isActive = !toggle.checked;

                if (!toggle.checked && this.#hasNewValue(stringField))
                    data.value = stringField.value.trim();

                return new Configuration(data);
            });
    }

    #hasNewValue(inputElement) {
        const originalValue = inputElement.dataset.originalValue;

        switch (inputElement.getAttribute('type')) {
            case 'hidden':
                return inputElement.value.trim() !== originalValue.trim();
            case 'checkbox':
                return inputElement.checked !== Boolean(originalValue.trim());
            default:
                throw new Error('Input type not implemented!');
        }
    }

    #hasValidChanges() {
        return [ this.#components.some(c => c.hasAttribute('has-changes')),
            this.#textFieldCollections.every(c => c.every(t => t.checkValidity())) ];
    }

    #isInvalid(key) {
        return this.#textFieldCollections[key].some(f => f.checkValidity() === false);
    }

    onChanges(func) {
        if (typeof func === 'function')
            this.#onChanges.push(func);
    }
}
const configCSV = new ConfigCSV();


/* IMPORT: ./components/non-elemental/config-field.js */



/* IMPORT: /js/models/configuration.model.js */




/* IMPORT: /js/services/form-validation.service.js */





class ConfigField {
    #components;
    #onChanges = [];

    constructor() {
        const components = Array.from(document.querySelectorAll('config-field-component'));
        this.#components = components;

        const configFields = components.map(c => c.querySelector('input[config-field]'));
        const toggles = components.map(c => c.querySelector('input[type="checkbox"]'));
        const errorContainers = components.map(c => c.querySelector('[input-errors]'));
        const restoreButtons = components.map(c => c.querySelector('button[restore-input]'));
        
        components.forEach((component, key) => {
            const textField = configFields[key];
            const restoreButton = restoreButtons[key];
            const toggle = toggles[key];
            const errorContainer = errorContainers[key];

            toggle.addEventListener('change', () => {
                const isDefault = toggle.checked;

                textField.disabled = isDefault;
                textField.value = isDefault
                    ? textField.dataset.defaultValue.trim()
                    : textField.dataset.inputValue.trim();

                    
                const textChanges = !isDefault && this.#hasNewValue(textField);
                const hasChanges = textChanges || this.#hasNewValue(toggle);

                if (isDefault)
                    errorContainer.innerHTML = '';

                if (textChanges)
                    formValidationService.validateField(textField, errorContainer);

                const isNew = Boolean(toggle.dataset.originalValue.trim());
                restoreButton.classList.toggle('hidden', !textChanges || isNew);
                component.toggleAttribute('has-changes', hasChanges);

                this.#emitChanges(
                    components.some(c => c.hasAttribute('has-changes')),
                    configFields.every(t => t.checkValidity())
                );
            });

            textField.addEventListener('input', () => {
                textField.dataset.inputValue = textField.value.trim();

                const hasChanges = this.#hasNewValue(textField);
                const isNew = Boolean(toggle.dataset.originalValue.trim());
                restoreButton.classList.toggle('hidden', !hasChanges || isNew);
                component.toggleAttribute('has-changes', hasChanges);
                
                this.#emitChanges(
                    components.some(c => c.hasAttribute('has-changes')),
                    configFields.every(t => t.checkValidity())
                );
            });

            textField.addEventListener('change', () => {
                textField.value = textField.value.trim();
                formValidationService.validateField(textField, errorContainer);
            });

            restoreButton.addEventListener('click', event => {
                event.preventDefault();
                const isNew = Boolean(toggle.dataset.originalValue.trim());

                if (isNew)
                    textField.value = textField.dataset.defaultValue.trim();
                else
                    textField.value = textField.dataset.originalValue.trim();
                
                textField.dataset.inputValue = textField.value.trim();
                restoreButton.classList.add('hidden');

                const hasChanges = this.#hasNewValue(toggle);
                component.toggleAttribute('has-changes', hasChanges);
                this.#emitChanges(
                    components.some(c => c.hasAttribute('has-changes')),
                    configFields.every(t => t.checkValidity())
                );
            });

            component.removeAttribute('hidden');
        });
    }

    #emitChanges(hasChanges, isValid) {
        this.#onChanges.forEach(func => func.call(this, hasChanges, isValid));
    }

    async getChanges() {
        return this.#components
            .filter(c => c.hasAttribute('has-changes'))
            .map(c => {
                const id = Number(c.querySelector('input[type="hidden"]').value.trim());
                /** @type {HTMLInputElement} */
                const configInput = c.querySelector('input[config-field]');

                const value = configInput.type === 'number'
                    ? Number(configInput.value)
                    : configInput.value.trim();

                if (id < 1)
                    return new Configuration({
                        id: 0,
                        name: configInput.dataset.constant.trim(),
                        value: value,
                        isActive: true
                    });

                const toggle = c.querySelector('input[type="checkbox"]');

                const data = { id: id, name: configInput.dataset.constant.trim() };

                if (toggle.checked !== Boolean(toggle.dataset.originalValue))
                    data.isActive = !toggle.checked;

                if (!toggle.checked && this.#hasNewValue(configInput))
                    data.value = value;
                
                return new Configuration(data);
            });
    }

    #hasNewValue(inputElement) {
        const originalValue = inputElement.dataset.originalValue;

        switch (inputElement.getAttribute('type')) {
            case 'text':
                return inputElement.value.trim() !== originalValue.trim();
            case 'number':
                return inputElement.value !== originalValue;
            case 'checkbox':
                return inputElement.checked !== Boolean(originalValue.trim());
            default:
                throw new Error('Input type not implemented!');
        }
    }

    onChanges(func) {
        if (typeof func === 'function')
            this.#onChanges.push(func);
    }
}
const configField = new ConfigField();


/* IMPORT: ./components/non-elemental/mobile-menu.js */

const html = document.querySelector(':root');
const body = document.querySelector('body');
const mobileMenu = document.querySelector('#mobile-menu');
const menuButton = mobileMenu.querySelector('#mobile-menu-button');
const animatedSvgParts = Array.from(menuButton.querySelectorAll('svg *[style]'));
const menuButtonFrame = menuButton.querySelector('#svg-rect-frame');
const menuContents = mobileMenu.querySelector('#mobile-menu-contents');
const menuItems = Array.from(menuContents.querySelectorAll('a[href]'));

window.addEventListener('resize', () =>
    menuContents.classList.contains('shown') && closeMobileMenu()
);

menuContents.addEventListener('click', (e) => e.stopPropagation());

menuContents.addEventListener('animationend', (event) => {
    const animationName = event.animationName;

    switch (animationName) {
        case 'hide-mobile-menu':
            event.target.classList.add('hidden');
            event.target.classList.remove('hide-mobile-menu');
            break;
        
        case 'show-mobile-menu':
            event.target.classList.add('shown');
            event.target.classList.remove('show-mobile-menu');
            break;

        default:
            event.stopPropagation();
            break;
    }
});

const KEYCODE_TAB = 9;
function menuFocusTrap(e) {
    if ( !(e.key === 'Tab' || e.keyCode === KEYCODE_TAB))
        return;

    const checkIndex = e.shiftKey ? 0 : menuItems.length-1;
    const targetIndex = e.shiftKey ? menuItems.length-1 : 0;

    if (document.activeElement === menuItems[checkIndex]
        || document.activeElement === menuButton
    ) {
        menuItems[targetIndex].focus();
        e.preventDefault();
        return;
    }
}

let hoverAnimation = false;
let activated = false;
menuButtonFrame.addEventListener('mouseover', () => buttonMouseOver());
menuButtonFrame.addEventListener('focus', () => buttonMouseOver());
menuButtonFrame.addEventListener('mouseout', () => buttonMouseOut());
menuButtonFrame.addEventListener('blur', () => buttonMouseOut());

function buttonMouseOver() {
    if (hoverAnimation)
        return;

    hoverAnimation = true;

    if (menuButton.classList.contains('reverting'));
        animatedSvgParts.forEach(part => 
            part.style.cssText = part.style.cssText.replace('third', 'first'));
    
    menuButton.classList.add('animating');
    menuButton.classList.remove('reverting');
    menuButton.addEventListener('animationend', () => {
        if (activated) {
            animatedSvgParts.forEach(part => 
                part.style.cssText = part.style.cssText.replace('first', 'second'));
            menuButton.classList.add('active');
            menuButton.classList.remove('animating');
        }

        hoverAnimation = false;
    }, {once: true});
}

function buttonMouseOut() {
    if (activated)
        return;

    menuButton.classList.remove('animating');
    hoverAnimation = false;
}

function openMobileMenu(e) {
    if (menuContents.classList.contains('hidden')) {
        e.stopPropagation();
        
        if (hoverAnimation) {
            activated = true;
        }
        else if (menuButton.classList.contains('animating')) {
            animatedSvgParts.forEach(part => 
                part.style.cssText = part.style.cssText.replace('first', 'second'));
            menuButton.classList.add('active');
            menuButton.classList.remove('animating');
        }
        else {
            activated = true;
            buttonMouseOver();
        }

        menuContents.classList.remove('hidden');
        menuContents.classList.add('show-mobile-menu');
        body.classList.add('fixed');
        body.classList.add('pointer-events-none');
        body.addEventListener('keydown', menuFocusTrap);

        html.addEventListener('click', () => 
            closeMobileMenu(), {once: true}
        );
    }
}

function closeMobileMenu() {
    if (menuContents.classList.contains('shown')) {
        activated = false;
        animatedSvgParts.forEach(part => 
            part.style.cssText = part.style.cssText.replace('second', 'third'));
        menuButton.classList.add('reverting');
        menuButton.classList.remove('active');
        menuContents.classList.remove('shown');
        menuContents.classList.add('hide-mobile-menu');
        body.classList.remove('fixed');
        body.classList.remove('pointer-events-none');
        body.removeEventListener('keydown', menuFocusTrap);
    }
}


/* IMPORT: ./components/non-elemental/site-configuration.js */



/* IMPORT: /js/services/api/configuration-api.service.js */




/* IMPORT: /js/components/non-elemental/config-field.js */




/* IMPORT: /js/components/non-elemental/config-csv.js */



class SiteConfiguration {
    #configApiService;
    #fieldsUnchanged = true;
    #csvUnchanged = true;

    constructor() {
        this.#configApiService = configurationApiService;
        const component = document.querySelector('site-configuration-component');

        // TODO: This should be a custom element so its code doesn't try to execute when it doesn't exist
        if (!component)
            return;

        const form = component.querySelector('form');
        const fieldset = form.querySelector('fieldset');
        const saveButton = fieldset.querySelector('button[type="submit"]');
        const isLoading = fieldset.querySelector('[is-loading]');

        configField.onChanges((hasChanges, isValid) => {
            this.#fieldsUnchanged = !hasChanges;
            saveButton.disabled = !isValid || (this.#fieldsUnchanged && this.#csvUnchanged);
        });

        configCSV.onChanges((hasChanges, isValid) => {
            this.#csvUnchanged = !hasChanges;
            saveButton.disabled = !isValid || (this.#fieldsUnchanged && this.#csvUnchanged);
        })

        form.addEventListener('submit', event => {
            event.preventDefault();
            this.#save(fieldset);
        });

        isLoading.remove();
    }

    async #save(fieldset) {
        fieldset.disabled = true;

        let changes = await configField.getChanges();
        changes = [...changes, ...await configCSV.getChanges()];

        const newConfigs = changes.filter(c => c.id === 0);
        const updatedConfigs = changes.filter(c => c.id > 0);

        const responses = [];

        if (newConfigs.length > 0)
            responses.push(this.#configApiService.createConfigurations(newConfigs));

        if (updatedConfigs.length > 0)
            responses.push(this.#configApiService.updateConfigurations(updatedConfigs));

        Promise.all(responses).then(() => {
            setTimeout(() => location.reload(), 1000);
        }, reason => {
            console.error(reason);
        });
    }
}
const siteConfiguration = new SiteConfiguration();


/* IMPORT: ./components/non-elemental/sub-menu.js */

const menuButtons = Array.from(document.querySelectorAll('[id^="menu-button-"]'));
const subMenus = Array.from(document.querySelectorAll('[id^="submenu-"]'));
let activeSubmenuId = -1;

subMenus.forEach(submenu => {
    submenu.addEventListener('animationend', (event) => {
        const animationName = event.animationName;

        switch (animationName) {
            case 'hide-menu':
                event.target.classList.add('hidden');
                event.target.classList.remove('hide-menu');
                showSubMenu();
                break;

            case 'show-menu':
                event.target.classList.remove('show-menu');
                break;

            default:
                event.stopPropagation();
                break;
        }

    });
});

function toggleSubMenu(id, btn) {
    if (isNaN(id)) return;

    activeSubmenuId = id === activeSubmenuId
        ? -1
        : id;

    menuButtons.forEach(menuBtn => menuBtn.classList.remove('selected'));
    
    if (activeSubmenuId >= 0)
        btn.classList.add('selected')

    const submenusToClose = subMenus.filter(
        submenu => submenu.id !== `submenu-${activeSubmenuId}`
        && submenu.classList.contains('hidden') == false
        && submenu.classList.contains('hide-menu') == false
    );

    if (submenusToClose.length > 0) {
        submenusToClose.forEach(submenu => submenu.classList.add('hide-menu'));
        return;
    }

    showSubMenu();
    
}

function showSubMenu() {
    if (activeSubmenuId < 0) return;

    const submenuToOpen = subMenus.find(submenu => submenu.id === `submenu-${activeSubmenuId}`);
    submenuToOpen?.classList.add('show-menu');
    submenuToOpen?.classList.remove('hidden');
}