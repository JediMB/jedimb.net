<?php declare(strict_types=1);

namespace Models\App\User;

class UserPassword {
    public int $id;
    public string $password;

    public function __construct(array $dbRow) {
        $this->id = $dbRow['id'] ?? 0;
        $this->password = $dbRow['password'] ?? '';
    }
}

?>