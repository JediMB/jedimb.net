<?php declare(strict_types=1);

namespace App\Services;

use DateTime;
use SensitiveParameter;
use App\Abstract\Singleton;
use App\Database\UserDbService;
use App\Database\UserTokenDbService;
use App\Models\App\User\User;
use App\Models\App\User\UserLoginResponse;
use App\Services\ConfigurationService;
use Exception;

class UserService extends Singleton {
    private readonly UserDbService $userDbService;
    private readonly UserTokenDbService $tokenDbService;
    private readonly ConfigurationService $configService;

    protected function __construct() {
        $this->userDbService = UserDbService::getInstance();
        $this->tokenDbService = UserTokenDbService::getInstance();
        $this->configService = ConfigurationService::getInstance();
    }

    public function authenticateUser(string $username, #[SensitiveParameter] string $password) : int|false {
        $dbPassword = $this->userDbService->getUserPassword($username);

        if (!$dbPassword)
            return false;

        if (password_verify($password, $dbPassword->password))
            return $dbPassword->id;

        if (password_get_info($dbPassword->password)['algo'])
            return false;

        if ($password !== $dbPassword->password)
            return false;

        return $this->setPassword($dbPassword->id, $password);
    }

    public function createUserToken(int $userId) : UserLoginResponse {
        do {
            $selector = uniqid('', true);
            $tokenMatch = $this->tokenDbService->getUserToken($selector);
        } while ($tokenMatch);

        $validator = str_pad(dechex(rand(0x00000000, 0xFFFFFFFF)), 8, '0', STR_PAD_LEFT)
            . str_pad(dechex(rand(0x00000000, 0xFFFFFFFF)), 8, '0', STR_PAD_LEFT);
        
        $validatorHash = password_hash($validator, PASSWORD_BCRYPT);

        $expiresOn = (new DateTime('+' . $this->configService->getUserConstant('COOKIE_EXPIRATION')))->format(DB_DATETIME_FORMAT);

        $token = $this->tokenDbService->setUserToken($userId, $selector, $validatorHash, $expiresOn);

        return new UserLoginResponse($token->userId, $token->selector, $validator, $token->expiresOn);
    }

    public function getUser(int $userId) : User|false {
        $user = $this->userDbService->getUser($userId);

        if ($user)
            return new User($user);

        return false;
    }

    private function setPassword(int $userId, #[SensitiveParameter] string $password) : int|false {
        $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

        $dbPassword = $this->userDbService->setUserPassword($userId, $hashedPassword);

        if (!$dbPassword)
            return false;

        if ($dbPassword->id !== $userId)
            throw new Exception("Error: id returned on password change for userId $userId incorrect!");

        if ($dbPassword->password !== $hashedPassword)
            throw new Exception("Error: hashed password returned on password change for userId $userId incorrect!");

        return $dbPassword->id;
    }
}