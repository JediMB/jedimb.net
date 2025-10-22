<?php declare(strict_types=1);

namespace Utilities;

class Response {
    public static function Forbidden(string $reason) : array {
        return [
            'success' => false,
            'header' => 'HTTP/1.1 403 Forbidden',
            'errors' => [ $reason ]
        ];
    }

    public static function InvalidRequest() : array {
        return [
            'success' => false,
            'errors' => [ TEXT_INVALID_REQUEST ]
        ];
    }

    public static function Success(mixed $result) : array {
        return [
            'success' => true,
            'value' => $result
        ];
    }
}

?>