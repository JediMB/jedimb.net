<?php declare(strict_types=1);

require_once 'services/session.service.php';
require_once 'services/db/user-token.db.service.php';

use Services\SessionService;
use Services\DB\UserTokenDBService;

switch ( $_SERVER['REQUEST_METHOD'] ) {
    case 'POST':
        try {
            $sessionService = SessionService::getInstance(); /** @var SessionService $sessionService */

            $result = false;
            if (!empty($_SESSION[SESSION_TOKEN_KEY]))
                $result = UserTokenDBService::getInstance()->removeUserToken($_SESSION[SESSION_TOKEN_KEY]);

            $sessionService->clearSession();

            return [ 'success' => true, 'value' => [ 'tokensRemoved' => $result ] ];
        }
        catch (Exception $e) {
            return [ 'success' => false, 'errors' => [$e->getMessage()]];
        }
        break;

    default:
        return [ 'success' => false, 'errors' => [ TEXT_INVALID_REQUEST ] ];
}

?>