<?php

namespace Models\Exceptions;

use Exception;
use Throwable;

class InputException extends Exception {
    /** @var (array<string, array<string, true>>) */
    protected array $errors;

    /**
     * @param string $className
     * @param (array<string, array<string, true>>) $errors
     * @param int $code
     * @param Throwable|null $previous
     */
    public function __construct(string $className, array $errors, int $code = 0, ?Throwable $previous = null) {
        $this->errors = $errors;

        parent::__construct("Input errors in $className", $code, $previous);
    }

    public function __toString(): string {
        $errorMessage = '';

        foreach ($this->errors as $inputKey => $err) {
            $errKeys = implode(', ', array_keys($err));
            $errorMessage = "$errorMessage $inputKey ($errKeys)";
        }

        return __CLASS__ . ": [{$this->code}]: {$this->message}: $errorMessage";
    }

    /** @return (array<string, array<string, true>>) */
    final public function getErrors() : array {
        return $this->errors;
    }
}

?>