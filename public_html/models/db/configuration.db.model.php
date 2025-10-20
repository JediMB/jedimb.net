<?php declare(strict_types=1);

namespace Models\DB;

require_once 'models/base/db-created-modified.model.php';

use Models\Base\DBCreatedModified;

class Configuration extends DBCreatedModified {
    public string $name;
    public string $value;
    public bool $isActive;

    public function __construct(array $dbRow) {
        parent::__construct($dbRow);

        $this->name = $dbRow['name'];
        $this->value = $dbRow['value'];
        $this->isActive = $dbRow['is_active'];
    }
}

?>