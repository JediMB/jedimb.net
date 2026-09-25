<?php declare(strict_types=1);

namespace API\Session;

use Exception;
use Services\SessionService;
use Database\UserTokenDbService;

switch ( $_SERVER['REQUEST_METHOD'] ) {
    case 'POST':
        try {
            $sessionService = SessionService::getInstance(); /** @var SessionService $sessionService */

            $result = false;
            if (!empty($_SESSION[SESSION_TOKEN_KEY]))
                $result = UserTokenDbService::getInstance()->removeUserToken($_SESSION[SESSION_TOKEN_KEY]);

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