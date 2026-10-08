/** Fills a select element with options from an iterable collection of key-value pairs
 * @param {HTMLSelectElement} select
 * @param {(Map<(string|number), string>|[(string|number), string][])} keyValues */
export function fillSelect(select, keyValues) {
    for (const [key, value] of keyValues) {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = value;
        select.appendChild(option);
    }
}