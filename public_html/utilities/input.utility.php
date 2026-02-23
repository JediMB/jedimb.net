<?php declare(strict_types=1);

namespace Utilities;

require_once 'enums/input-error.enum.php';

use Enums\InputError;

class Input {
    /**
     * @param string $key
     * @param string $input 
     * @param (array{'min': int, 'max': int}) $inputLengths 
     * @param (array<string, array<InputError, true>>) $outErrors 
     * @param string|null $regEx 
     * @return string|null
     * */
    public static function verifyOptionalTextInput(string $key, string $input, array $inputLengths, array $outErrors, ?string $regEx = null) : string|null {
        if (empty($input))
            return null;

        return Input::verifyTextInput($key, $input, $inputLengths, $outErrors, $regEx);
    }

    /**
     * @param string $key
     * @param string $input 
     * @param (array{'min': int, 'max': int}) $inputLengths 
     * @param (array<string, array<InputError, true>>) $outErrors 
     * @param string|null $regEx 
     * @return string|null
     * */
    public static function verifyRequiredTextInput(string $key, string $input, array $inputLengths, array $outErrors, ?string $regEx = null) : string|null {
        if (empty($input)) {
            $errors[$key][InputError::Required] = true;
            return null;
        }

        return Input::verifyTextInput($key, $input, $inputLengths, $outErrors, $regEx);
    }

    /**
     * @param string $key
     * @param string $input 
     * @param (array{'min': int, 'max': int}) $inputLengths 
     * @param (array<string, array<InputError, true>>) $outErrors
     * @param string|null $regEx 
     * @return string|null
     * */
    private static function verifyTextInput(string $key, string $input, array $inputLengths, array $outErrors, ?string $regEx) : string|null {
        $length = strlen($input);

        if ($length < $inputLengths['min'])
            $outErrors[$key][InputError::TooShort] = true;
        else if ($length > $inputLengths['max'])
            $outErrors[$key][InputError::TooLong] = true;

        if ($regEx && !preg_match($regEx, $input))
            $outErrors[$key][InputError::Mismatch] = true;

        return $input;
    }
}

?>