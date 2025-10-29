<?php declare(strict_types=1);

namespace API\Session;

require_once 'services/session.service.php';

use Services\SessionService;

switch ( $_SERVER['REQUEST_METHOD'] ) {
    case 'GET':
        $service = SessionService::getInstance(); /** @var SessionService $service */

        return [ 'success' => true, 'value' => $service->isLoggedIn() ];

    default:
        return [ 'success' => false, 'errors' => [ TEXT_INVALID_REQUEST ] ];
}

?>