<?php declare(strict_types=1);

namespace API\Session;

use Services\SessionService;

switch ( $_SERVER['REQUEST_METHOD'] ) {
    case 'GET':
        $service = SessionService::getInstance(); /** @var SessionService $service */

        return [ 'success' => true, 'value' => $service->getUser() ];

    default:
        return [ 'success' => false, 'errors' => [ TEXT_INVALID_REQUEST ] ];
}

?>