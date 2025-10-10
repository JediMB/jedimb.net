<?php declare(strict_types=1);

namespace Models\DB;

require_once 'enums/user-role.enum.php';
require_once 'models/base/db-object.model.php';

use DateTime;
use Enums\UserRole;
use Models\Base\DBObject;

class User extends DBObject {
    public string $username;
    public string $email;
    public UserRole $role;
    public string $roleString;
    public string $password;
    public DateTime $passwordTimestamp;
    public DateTime $registeredOn;
    public ?DateTime $lastLogin;

    public function __construct(array $dbRow) {
        parent::__construct($dbRow);
        
        $this->username = $dbRow['username'];
        $this->email = $dbRow['email'];
        $this->role = UserRole::from($dbRow['role']);
        $this->roleString = $dbRow['role_string'];
        $this->password = $dbRow['password'];
        $this->passwordTimestamp = DateTime::createFromFormat(DB_DATETIME_FORMAT, $dbRow['password_timestamp'])
            ?: DateTime::createFromFormat(DB_DATETIME_FORMAT_FALLBACK, $dbRow['password_timestamp']);
        $this->registeredOn = DateTime::createFromFormat(DB_DATETIME_FORMAT, $dbRow['registered_on'])
            ?: DateTime::createFromFormat(DB_DATETIME_FORMAT_FALLBACK, $dbRow['registered_on']);
        $this->lastLogin = isset($dbRow['last_login'])
            ? (
                DateTime::createFromFormat(DB_DATETIME_FORMAT, $dbRow['last_login'])
                ?: DateTime::createFromFormat(DB_DATETIME_FORMAT_FALLBACK, $dbRow['last_login'])
            )
            : null;
    }
}

?>