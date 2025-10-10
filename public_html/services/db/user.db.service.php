<?php declare(strict_types=1);

namespace Services\DB;

require_once 'models/db/user.db.model.php';
require_once 'models/db/user-token.db.model.php';
require_once 'models/user/user-password.model.php';
require_once 'services/base/singleton.php';
require_once 'services/db/database.service.php';

use Exception;
use PDO;
use PDOException;
use Models\DB\User;
use Models\User\UserPassword;
use Services\Base\Singleton;

class UserDBService extends Singleton {
    private DatabaseService $dbService;

    protected function __construct() {
        $this->dbService = DatabaseService::getInstance();
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
}

?>