<?php declare(strict_types=1);

namespace Models\User;

require_once 'enums/user-role.enum.php';
require_once 'models/db/user.db.model.php';

use DateTime;
use Enums\UserRole;

class User {
    public string $username;
    public string $email;
    public UserRole $role;
    public DateTime $passwordTimestamp;
    public DateTime $registeredOn;
    public ?DateTime $lastLogin;

    public function __construct(\Models\DB\User $dbUser) {
        $this->username = $dbUser->username;
        $this->email = $dbUser->email;
        $this->role = $dbUser->role;
        $this->passwordTimestamp = $dbUser->passwordTimestamp;
        $this->registeredOn = $dbUser->registeredOn;
        $this->lastLogin = $dbUser->lastLogin;
    }
}

?>