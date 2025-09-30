<?php declare(strict_types=1);

namespace Services;

require_once 'models/user/user-password.model.php';
require_once 'models/user/user-token.model.php';
require_once 'services/database.service.php';
require_once 'services/singleton.php';

use DateTime;
use Exception;
use PDO;
use PDOException;
use Models\User\UserPassword;
use Models\User\UserToken;

class UserService extends Singleton {
    private DatabaseService $dbService;

    protected function __construct() {
        $this->dbService = DatabaseService::getInstance();
    }

    public function getUserPassword(string $userName) : UserPassword|false {
        try {
            $user = $this->dbService->selectFunction(
                'read_user_password', [
                    1 => [ 'value' => $userName, 'type' => PDO::PARAM_STR ]
                ]
            );
        }
        catch (PDOException $e) {
            throw new Exception('Database error: ' . $e->getMessage());
        }
        finally {
            if ($user)
                return new UserPassword($user);

            return false;
        }
    }

    public function getUserToken(string $selector) : UserToken|false {
        try {
            $token = $this->dbService->selectFunction(
                'read_user_token', [
                    1 => [ 'value' => $selector, 'type' => PDO::PARAM_STR ]
                ]
            );
        }
        catch (PDOException $e) {
            throw new Exception('Database error: ' . $e->getMessage());
        }
        finally {
            if ($token)
                return new UserToken($token);

            return false;
        }
    }

    public function setUserToken(int $userId, string $selector, string $validatorHash) : UserToken {
        try {
            $token = $this->dbService->selectFunction(
                'create_user_token', [
                    1 => [ 'value' => $userId, 'type' => PDO::PARAM_INT ],
                    2 => [ 'value' => $selector, 'type' => PDO::PARAM_STR ],
                    3 => [ 'value' => $validatorHash, 'type' => PDO::PARAM_STR ],
                    4 => [ 'value' => (new DateTime('+' . LOGIN_EXPIRATION))->format(DB_DATETIME_FORMAT), 'type' => PDO::PARAM_STR ]
                ]
            );
        }
        catch (PDOException $e) {
            throw new Exception('Database error: ' . $e->getMessage());
        }
        finally {
            return new UserToken($token);
        }
    }
}

?>