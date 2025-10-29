<?php declare(strict_types=1);

namespace Utilities;

class Response {
    public static function BadRequest(string $reason) : array {
        return [
            'success' => false,
            'header' => 'HTTP/1.1 400 Bad Request',
            'errors' => [ $reason ]
        ];
    }

    public static function Error(array $reasons) : array {
        return [
            'success' => false,
            'header' => 'HTTP/1.1 500 Internal Server Error',
            'errors' => $reasons
        ];
    }

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