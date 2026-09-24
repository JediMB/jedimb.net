<?php declare(strict_types=1);

namespace Utilities;

require_once 'enums/input-error.enum.php';

use Enums\InputError;

class Input {
    /**
     * @param string $key
     * @param array $inputs 
     * @param (array{'min': int, 'max': int}) $inputLengths 
     * @param (array<string, array<string, true>>) $outErrors 
     * @param string|null $regEx 
     * @return string|null
     * */
    public static function verifyOptionalTextInput(string $key, array $inputs, array $inputLengths, array $outErrors, ?string $regEx = null) : string|null {
        if (empty($inputs[$key]))
            return null;

        return Input::verifyTextInput($key, $inputs[$key], $inputLengths, $outErrors, $regEx);
    }

    /**
     * @param string $key
     * @param array $inputs 
     * @param (array{'min': int, 'max': int}) $inputLengths 
     * @param (array<string, array<string, true>>) $outErrors 
     * @param string|null $regEx 
     * @return string|null
     * */
    public static function verifyRequiredTextInput(string $key, array $inputs, array $inputLengths, array $outErrors, ?string $regEx = null) : string|null {
        if (empty($inputs[$key])) {
            $errors[$key][InputError::Required->value] = true;
            return null;
        }

        return Input::verifyTextInput($key, $inputs[$key], $inputLengths, $outErrors, $regEx);
    }

    /**
     * @param string $key
     * @param string $inputString 
     * @param (array{'min': int, 'max': int}) $inputLengths 
     * @param (array<string, array<string, true>>) $outErrors
     * @param string|null $regEx 
     * @return string|null
     * */
    private static function verifyTextInput(string $key, string $inputString, array $inputLengths, array $outErrors, ?string $regEx) : string|null {
        $inputString = trim($inputString);
        $length = strlen($inputString);

        if ($length < $inputLengths['min'])
            $outErrors[$key][InputError::TooShort->value] = true;
        else if ($length > $inputLengths['max'])
            $outErrors[$key][InputError::TooLong->value] = true;

        if ($regEx && !preg_match($regEx, $inputString))
            $outErrors[$key][InputError::Mismatch->value] = true;

        return $inputString;
    }
}

?>