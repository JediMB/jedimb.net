<?php declare(strict_types=1);

namespace Models\User;

class UserLoginResponse {
    public bool $isSuccess;
    public string $token;
    public string $validator;

    public function __construct(bool $isSuccess, string $token, string $validator) {
        $this->isSuccess = $isSuccess;
        $this->token = $token;
        $this->validator = $validator;
    }
}

?>