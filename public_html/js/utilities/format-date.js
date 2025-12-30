export { formatDate as default };

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

    let timezone = dt.getTimezoneOffset();
    let tzSign = timezone < 0 ? '+' : '-';
    timezone = Math.abs(timezone);
    let tzHours = Math.floor(timezone / 60).toString().padStart(2, '0');
    let tzMinutes = Math.floor(timezone % 60).toString().padStart(2, '0');

    if (millisecondPrecision)
        return `${year}-${month}-${date} ${hours}:${minutes}:${seconds}.${dt.getMilliseconds()} ${tzSign}${tzHours}${tzMinutes}`;

    return `${year}-${month}-${date} ${hours}:${minutes}:${seconds} ${tzSign}${tzHours}${tzMinutes}`;
}