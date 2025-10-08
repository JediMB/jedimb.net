<?php

namespace Models\Exceptions;

use Exception;
use Throwable;

class InputException extends Exception {
    protected array $messages = [];

    public function __construct(array $messages, int $code = 0, ?Throwable $previous = null) {
        $this->messages = [...$messages];

        parent::__construct('Input errors', $code, $previous);
    }

    public function __toString(): string {
        $messages = implode(' AND ', $this->messages);

        return __CLASS__ . ": [{$this->code}]: {$this->message}: $messages";
    }

    final public function getMessages() : array {
        return [...$this->messages];
    }
}

?>