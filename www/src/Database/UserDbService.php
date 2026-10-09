<?php declare(strict_types=1);

namespace App\Database;

use Exception;
use PDO;
use PDOException;
use App\Abstract\BaseDbService;
use App\Models\DB\User;
use App\Models\App\User\UserPassword;

class UserDbService extends BaseDbService {
    protected function __construct() {
        parent::__construct();
    }

    public function getUser(int $userId) : User|false {
        try {
            $user = $this->dbService->selectById('user', $userId);

            if ($user)
                return new User($user);
        }
        catch (PDOException $e) {
            throw new Exception('Database error: ' . $e->getMessage());
        }

        return false;
    }

    public function getUserPassword(string $userName) : UserPassword|false {
        try {
            $userPassword = $this->dbService->selectFunction(
                'read_user_password', [
                    1 => [ 'value' => $userName, 'type' => PDO::PARAM_STR ]
                ]
            );

            if ($userPassword)
                return new UserPassword($userPassword);
        }
        catch (PDOException $e) {
            throw new Exception('Database error: ' . $e->getMessage());
        }

        return false;
    }

    public function setUserPassword(int $userId, string $hashedPassword) : UserPassword|false {
        try {
            $userPassword = $this->dbService->selectFunction(
                'update_user_password', [
                    1 => [ 'value' => $userId, 'type' => PDO::PARAM_INT ],
                    2 => [ 'value' => $hashedPassword, 'type' => PDO::PARAM_STR ]
                ]
            );

            if ($userPassword)
                return new UserPassword($userPassword);
        }
        catch (PDOException $e) {
            $code = $e->getCode();
            throw new Exception("Database error ($code): could not set new password for userId $userId");
        }

        return false;
    }
}