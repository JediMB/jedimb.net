/**
 * @param {InputErrors[]} errors 
 * @param {HTMLCollectionOf<HTMLInputElement>} inputs 
 * @returns {boolean}
 */
export function handleInputErrors(errors, inputs) {
    if (!errors)
        console.error('Errors parameter empty');

    if (!Object.hasOwn(errors[0], 'required'))
        return false;
    
    for (const input of inputs) {
        const error = errors[input.name];

        if (!error)
            clearInputErrors(input);

        input.classList.toggle('error-required', !!error.required);
        input.classList.toggle('error-too-short', !!error.tooShort);
        input.classList.toggle('error-too-long', !!error.tooLong);
        input.classList.toggle('error-mismatch', !!error.mismatch);
    }

    return true;
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