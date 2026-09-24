<?php declare(strict_types=1);

namespace Models\DB;

use Abstract\DbBase;
use Utils\DateTime;

class UserToken extends DbBase {
    public int $userId;
    public string $selector;
    public string $validator_hash;
    public \DateTime $expiresOn;

    public function __construct(array $dbRow) {
        parent::__construct($dbRow);

        $this->userId = $dbRow['user_id'];
        $this->selector = $dbRow['selector'];
        $this->validator_hash = $dbRow['validator_hash'];
        $this->expiresOn = DateTime::parse($dbRow['expires_on']);
    }
}