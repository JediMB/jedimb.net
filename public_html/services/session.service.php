<?php declare(strict_types=1);

namespace Services;

require_once 'services/singleton.php';
require_once 'services/db/user-token.db.service.php';

use DateTime;
use Exception;
use Models\User\UserToken;
use Services\DB\UserTokenDBService;

class SessionService extends Singleton {
    private UserTokenDBService $tokenDBService;

    protected function __construct() {
        session_start();

        $this->tokenDBService = UserTokenDBService::getInstance();
    }

    public function isLoggedIn() : bool {
        return isset($_SESSION[SESSION_STATUS_KEY]);
    }

    public function loginFromCookie() : bool {
        $token = $this->verifyCookie();

        if (!$token)
            return false;

        $this->setSession($token->userId, 'TestName');
        $this->tokenDBService->refreshUserToken($token->id);
        return true;
    }

    public function setSession(int $userId, string $userName) {
        session_regenerate_id();
        $_SESSION[SESSION_STATUS_KEY] = true;
        $_SESSION[SESSION_USERID_KEY] = $userId;
        $_SESSION[SESSION_USERNAME_KEY] = $userName;
    }

    public function clearSession() {
        // TODO: See if clearing cookies via backend works when called via REST API
        session_unset();
        session_destroy();
    }

    public function verifyCookie() : UserToken|false {
        if (!isset($_COOKIE[COOKIE_USER_KEY], $_COOKIE[COOKIE_TOKEN_KEY], $_COOKIE[COOKIE_VALIDATOR_KEY]))
            return false;

        $userId = (int) $_COOKIE[COOKIE_USER_KEY];
        $selector = $_COOKIE[COOKIE_TOKEN_KEY];
        $validator = $_COOKIE[COOKIE_VALIDATOR_KEY];

        try {
            $token = $this->tokenDBService->getUserToken($selector);
            
            if ( !$token ) {
                return false;
            }
            
            if ( $token->expiresOn < new DateTime() )
                return false;

            if ( $userId !== $token->userId )
                return false;

            if ( !password_verify($validator, $token->validator_hash) )
                return false;

            return $token;
        }
        catch (Exception $e) {
            throw new Exception('Error verifying cookie: ' . $e->getMessage());
        }
    }
}

?>