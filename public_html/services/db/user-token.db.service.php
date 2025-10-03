<?php declare(strict_types=1);

namespace Services\DB;

require_once 'models/db/user-token.db.model.php';
require_once 'services/base/singleton.php';
require_once 'services/db/database.service.php';

use DateTime;
use Exception;
use PDO;
use PDOException;
use Models\DB\UserToken;
use Services\Base\Singleton;

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

    public function setUserToken(int $userId, string $selector, string $validatorHash, string $expiresOn) : UserToken {
        try {
            

            $token = $this->dbService->selectFunction(
                'create_user_token', [
                    1 => [ 'value' => $userId, 'type' => PDO::PARAM_INT ],
                    2 => [ 'value' => $selector, 'type' => PDO::PARAM_STR ],
                    3 => [ 'value' => $validatorHash, 'type' => PDO::PARAM_STR ],
                    4 => [ 'value' => $expiresOn, 'type' => PDO::PARAM_STR ]
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

    public function removeUserToken(string $tokenSelector) : int|false {
        try {
            $result = $this->dbService->selectFunction(
                'delete_user_token', [
                    1 => [ 'value' => $tokenSelector, 'type' => PDO::PARAM_STR ]
                ]
            );

            if ($result[0] === 0)
                return false;

            return $result[0];
        }
        catch (PDOException $e) {
            return false;
        }
    }
}

?>