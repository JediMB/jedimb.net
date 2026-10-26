/**
 * @param {Object.<string, Object.<string, InputErrors>|string>} errors 
 * @param {HTMLCollectionOf<HTMLInputElement>} inputs 
 * @returns {boolean}
 */
export function handleInputCollectionErrors(errors, inputs) {
    // if (!errors)
    //     console.error('Errors parameter empty');

    // if (!Object.hasOwn(errors[0], 'required'))
    //     return false;
    
    for (const input of inputs) {
        handleInputErrors(errors[input.name], input);
    }

    return true;
}

/**
 * @param {Object.<string, InputErrors>|string} errors 
 * @param {InputErrors} errors.value
 * @param {HTMLInputElement} input 
 */
export function handleInputErrors(errors, input) {
    if (!errors)
        return clearInputErrors(input);

    if (typeof errors === 'string') {
        // TODO: Print error message to page;
        return;
    }

    for (const property in errors) {
        if (property === 'value') {
            // These exist only to trigger class|=error- styling?
            input.classList.toggle('error-required', !!errors[property].required);
            input.classList.toggle('error-too-short', !!errors[property].tooShort);
            input.classList.toggle('error-too-long', !!errors[property].tooLong);
            input.classList.toggle('error-mismatch', !!errors[property].mismatch);
        }

        // TODO: Print error message to page
    }
}

/**
 * @param {HTMLInputElement} input 
 */
export function clearInputErrors(input) {
    if (!input.classList.length)
        return;

    input.classList.remove('error-required');
    input.classList.remove('error-too-short');
    input.classList.remove('error-too-long');
    input.classList.remove('error-mismatch');
}

/**
 * @typedef InputErrors
 * @type {object}
 * @property {true=} required
 * @property {true=} tooShort
 * @property {true=} tooLong
 * @property {true=} mismatch
 */