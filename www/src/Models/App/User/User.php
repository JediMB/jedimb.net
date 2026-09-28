<?php declare(strict_types=1);

namespace App\Models\App\User;

use DateTime;
use App\Enums\UserRole;
use App\Models\DB\User as DbUser;

class User {
    public int $id;
    public string $username;
    public string $email;
    public UserRole $role;
    public DateTime $passwordTimestamp;
    public DateTime $registeredOn;
    public ?DateTime $lastLogin;

    public function __construct(DbUser $dbUser) {
        $this->id = $dbUser->id;
        $this->username = $dbUser->username;
        $this->email = $dbUser->email;
        $this->role = $dbUser->role;
        $this->passwordTimestamp = $dbUser->passwordTimestamp;
        $this->registeredOn = $dbUser->registeredOn;
        $this->lastLogin = $dbUser->lastLogin;
    }
}

?>