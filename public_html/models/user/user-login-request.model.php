<?php declare(strict_types=1);

namespace Models\User;

class UserLoginRequest {
    public string $username;
    public string $password;
    public bool $persistent;

    public function __construct(array $postData) {
        $this->username = $postData['username'] ?? '';
        $this->password = $postData['password'] ?? '';
        $this->persistent = $postData['persistent'] ?? false;
    }
}

?>