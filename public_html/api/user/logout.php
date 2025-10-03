<?php declare(strict_types=1);

require_once 'services/session.service.php';

use Services\SessionService;

switch ( $_SERVER['REQUEST_METHOD'] ) {
    case 'POST':
        try {
            $sessionService = SessionService::getInstance(); /** @var SessionService $sessionService */

            $sessionService->clearSession();

            return [ 'success' => true, 'value' => true ];
        }
        catch (Exception $e) {
            return [ 'success' => false, 'errors' => [$e->getMessage()]];
        }
        break;

    default:
        return [ 'success' => false, 'errors' => [ TEXT_INVALID_REQUEST ] ];
}

?>