<?php declare(strict_types=1);

namespace Services;

require_once 'models/user/user.model.php';
require_once 'models/user/user-login-response.model.php';
require_once 'services/base/singleton.php';
require_once 'services/db/user.db.service.php';

use DateTime;
use SensitiveParameter;
use Models\DB\User as UserDB;
use Models\User\User;
use Models\User\UserLoginResponse;
use Services\Base\Singleton;
use Services\DB\UserDBService;
use Services\DB\UserTokenDBService;

class UserService extends Singleton {
    private UserDBService $userDbService;
    private UserTokenDBService $tokenDbService;

    protected function __construct() {
        $this->userDbService = UserDBService::getInstance();
        $this->tokenDbService = UserTokenDBService::getInstance();
    }

    public function authenticateUser(string $username, #[SensitiveParameter] string $password) : int|false {
        $dbPassword = $this->userDbService->getUserPassword($username);

        if ( !$dbPassword || !password_verify($password, $dbPassword->password) )
            return false;

        return $dbPassword->id;
    }

    public function createUserToken(int $userId) : UserLoginResponse {
        do {
            $selector = uniqid('', true);
            $tokenMatch = $this->tokenDbService->getUserToken($selector);
        } while ($tokenMatch);

        $validator = str_pad(dechex(rand(0x00000000, 0xFFFFFFFF)), 8, '0', STR_PAD_LEFT)
            . str_pad(dechex(rand(0x00000000, 0xFFFFFFFF)), 8, '0', STR_PAD_LEFT);
        
        $validatorHash = password_hash($validator, PASSWORD_BCRYPT);

        $expiresOn = (new DateTime('+' . COOKIE_EXPIRATION))->format(DB_DATETIME_FORMAT);

        $token = $this->tokenDbService->setUserToken($userId, $selector, $validatorHash, $expiresOn);

        return new UserLoginResponse($token->userId, $token->selector, $validator, $token->expiresOn);
    }

    public function getUser(int $userId) : User|false {
        $user = $this->userDbService->getUser($userId);

        if ($user)
            return new User($user);

        return false;
    }
}

?>