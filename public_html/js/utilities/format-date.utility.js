/**
 * 
 * @param {(Date|undefined)} dt 
 * @param {Boolean} millisecondPrecision
 * @returns {string}
 */
export function formatDate(dt, millisecondPrecision = false) {
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
export function formatTimezone(dt) {
    let offset = dt.getTimezoneOffset();
    let sign = offset < 0 ? '+' : '-';
    offset = Math.abs(offset);
    let hours = Math.floor(offset / 60).toString().padStart(2, '0');
    let minutes = Math.floor(offset % 60).toString().padStart(2, '0');

    return `${sign}${hours}${minutes}`;
}