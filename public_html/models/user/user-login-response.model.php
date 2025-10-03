<?php declare(strict_types=1);

namespace Models\User;

use DateTime;

class UserLoginResponse {
    public int $userId;
    public ?string $token;
    public ?string $validator;
    public ?DateTime $expiresOn;

    public function __construct(int $userId, ?string $token = null, ?string $validator = null, ?DateTime $expiresOn = null) {
        $this->userId = $userId;
        $this->token = $token;
        $this->validator = $validator;
        $this->expiresOn = $expiresOn;
    }
}

?>