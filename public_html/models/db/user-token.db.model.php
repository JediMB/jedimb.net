<?php declare(strict_types=1);

namespace Models\DB;

require_once 'models/base/db-base.model.php';

use Models\Base\DBBase;
use Utilities\DateTime;

class UserToken extends DBBase {
    public int $userId;
    public string $selector;
    public string $validator_hash;
    public \DateTime $expiresOn;

    public function __construct(array $dbRow) {
        parent::__construct($dbRow);

        $this->userId = $dbRow['user_id'];
        $this->selector = $dbRow['selector'];
        $this->validator_hash = $dbRow['validator_hash'];
        $this->expiresOn = DateTime::Parse($dbRow['expires_on']);
    }
}

?>