<?php declare(strict_types=1);

namespace Services\DB;

require_once 'models/user/user-token.model.php';
require_once 'services/database.service.php';
require_once 'services/singleton.php';

use DateTime;
use Exception;
use PDO;
use PDOException;
use Models\User\UserToken;
use Services\DatabaseService;
use Services\Singleton;

class UserTokenDBService extends Singleton {
    private DatabaseService $dbService;

    protected function __construct() {
        $this->dbService = DatabaseService::getInstance();
    }

    public function getUserToken(string $selector) : UserToken|false {
        try {
            $token = $this->dbService->selectFunction(
                'read_user_token', [
                    1 => [ 'value' => $selector, 'type' => PDO::PARAM_STR ]
                ]
            );

            if ($token)
                return new UserToken($token);

            return false;
        }
        catch (Exception $e) {
            throw new Exception('Database error: ' . $e->getMessage());
        }
    }

    public function setUserToken(int $userId, string $selector, string $validatorHash) : UserToken {
        try {
            $formattedExpirationDate = (new DateTime('+' . COOKIE_EXPIRATION))->format(DB_DATETIME_FORMAT);

            $token = $this->dbService->selectFunction(
                'create_user_token', [
                    1 => [ 'value' => $userId, 'type' => PDO::PARAM_INT ],
                    2 => [ 'value' => $selector, 'type' => PDO::PARAM_STR ],
                    3 => [ 'value' => $validatorHash, 'type' => PDO::PARAM_STR ],
                    4 => [ 'value' => $formattedExpirationDate, 'type' => PDO::PARAM_STR ]
                ]
            );

            return new UserToken($token);
        }
        catch (PDOException $e) {
            throw new Exception('Database error: ' . $e->getMessage());
        }
    }

    public function refreshUserToken(int $tokenId) : UserToken|false {
        try {
            $formattedExpirationDate = (new DateTime('+' . COOKIE_EXPIRATION))->format(DB_DATETIME_FORMAT);

            $token = $this->dbService->selectFunction(
                'update_user_token_expiration', [
                    1 => [ 'value' => $tokenId, 'type' => PDO::PARAM_INT ],
                    2 => [ 'value' => $formattedExpirationDate, 'type' => PDO::PARAM_STR ]
                ]
            );

            if ($token)
                return new UserToken($token);

            return false;
        }
        catch (PDOException $e) {
            throw new Exception('Database error: ' . $e->getMessage());
        }
    }
}

?>