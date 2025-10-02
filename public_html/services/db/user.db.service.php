<?php declare(strict_types=1);

namespace Services\DB;

require_once 'models/user/user-password.model.php';
require_once 'models/user/user-token.model.php';
require_once 'services/database.service.php';
require_once 'services/singleton.php';

use Exception;
use PDO;
use PDOException;
use Models\User\UserPassword;
use Services\Base\Singleton;

class UserDBService extends Singleton {
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
}

?>