<?php declare(strict_types=1);

namespace Models\User;

class UserLoginResponse {
    public int $id;
    public string $token;
    public string $validator;

    public function __construct(int $id, string $token, string $validator) {
        $this->id = $id;
        $this->token = $token;
        $this->validator = $validator;
    }
}

?>