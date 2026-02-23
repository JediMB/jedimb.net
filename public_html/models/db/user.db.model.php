<?php declare(strict_types=1);

namespace Models\DB;

require_once 'enums/user-role.enum.php';
require_once 'models/base/db-base.model.php';

use Enums\UserRole;
use Models\Base\DBBase;
use Utilities\DateTime;

class User extends DBBase {
    public string $username;
    public string $email;
    public UserRole $role;
    public string $roleString;
    public string $password;
    public \DateTime $passwordTimestamp;
    public \DateTime $registeredOn;
    public ?\DateTime $lastLogin;

    public function __construct(array $dbRow) {
        parent::__construct($dbRow);
        
        $this->username = $dbRow['username'];
        $this->email = $dbRow['email'];
        $this->role = UserRole::tryFrom($dbRow['role']) ?: UserRole::User;
        $this->roleString = $dbRow['role_string'];
        $this->password = $dbRow['password'];
        $this->passwordTimestamp = DateTime::parse($dbRow['password_timestamp']);
        $this->registeredOn = DateTime::parse($dbRow['registered_on']);
        $this->lastLogin = DateTime::parse($dbRow['last_login']);
    }
}

?>