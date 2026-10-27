<?php declare(strict_types=1);

namespace App\Models\Exceptions;

use Exception;
use Override;
use Throwable;

class DatabaseException extends Exception {
    public function __construct(string $message, int $code = 0, Throwable|null $previous = null)
    {
        if (DEBUG_VERBOSE_DB_ERRORS)
            return parent::__construct('Database error: ' . $message, $code, $previous);

        return parent::__construct('Database error', $code, $previous);
    }
}