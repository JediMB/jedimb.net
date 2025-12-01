const dbStatuses = Object.freeze({
    UNCHANGED: 0,
    MODIFIED: 1,
    ADDED: 2,
    REMOVED: 3
});

export default class DBStatus {
    static get UNCHANGED() { return dbStatuses.UNCHANGED; };
    static get MODIFIED() { return dbStatuses.MODIFIED };
    static get ADDED() { return dbStatuses.ADDED };
    static get REMOVED() { return dbStatuses.REMOVED };

    /**
     * @param {Number} status 
     * @returns {Boolean}
     */
    static isValid(status) {

        Object.keys(dbStatuses).forEach(dbStatus => {
            if (dbStatus === status)
                return true;
        });

        return false;
    }

    static parse(status) {
        status = Number(status);

        if (DBStatus.isValid(status))
            return status;

        return undefined;
    }
}