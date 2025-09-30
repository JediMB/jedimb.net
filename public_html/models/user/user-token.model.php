<?php declare(strict_types=1);

namespace Models\User;

use DateTime;

class UserToken {
    public int $id;
    public int $userId;
    public string $selector;
    public string $validator_hash;
    public DateTime $expiresOn;

    public function __construct(array $dbRow) {
        $this->id = $dbRow['id'] ?? 0;
        $this->userId = $dbRow['userId'] ?? 0;
        $this->selector = $dbRow['selector'] ?? '';
        $this->validator_hash = $dbRow['validator_hash'] ?? '';
        $this->expiresOn = DateTime::createFromFormat(DB_DATETIME_FORMAT, $dbRow['expires_on'] ?? '') ?: new DateTime();
    }
}

?>