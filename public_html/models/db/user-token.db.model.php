<?php declare(strict_types=1);

namespace Models\DB;

require_once 'models/base/db-object.model.php';

use DateTime;
use Models\Base\DBObject;

class UserToken extends DBObject {
    public int $userId;
    public string $selector;
    public string $validator_hash;
    public DateTime $expiresOn;

    public function __construct(array $dbRow) {
        parent::__construct($dbRow);

        $this->userId = $dbRow['user_id'];
        $this->selector = $dbRow['selector'];
        $this->validator_hash = $dbRow['validator_hash'];
        $this->expiresOn = DateTime::createFromFormat(DB_DATETIME_FORMAT, $dbRow['expires_on'])
            ?: DateTime::createFromFormat(DB_DATETIME_FORMAT_FALLBACK, $dbRow['expires_on']);
    }
}

?>