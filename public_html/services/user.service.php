<?php declare(strict_types=1);

namespace Services;

require_once 'models/user/user-password.model.php';
require_once 'services/database.service.php';
require_once 'services/singleton.php';

use PDO;
use PDOException;
use Models\User\UserPassword;

class UserService extends Singleton {
    public function getUserPassword(string $userName) : UserPassword|false {
        try {
            $user = DatabaseService::getInstance()->selectFunction(
                'read_user_password', [
                    1 => [ 'value' => $userName, 'type' => PDO::PARAM_STR ]
                ]
            );
        }
        catch (PDOException $e) {
            $user['id'] = 0;
        }
        finally {
            if ($user)
                return new UserPassword($user);

            return false;
        }
    }
}

?>