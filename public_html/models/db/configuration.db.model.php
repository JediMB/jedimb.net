<?php declare(strict_types=1);

namespace Models\DB;

require_once 'models/base/db-created-modified.model.php';

use Models\Base\DBCreatedModified;

class Configuration extends DBCreatedModified {
    public string $name;
    public ?int $valueInt;
    public ?string $valueString;
    public bool $isActive;

    public function __construct(array $dbRow) {
        parent::__construct($dbRow);

        $this->name = $dbRow['name'];
        $this->valueString = $dbRow['value'];
        $this->valueInt = $dbRow['value_int'];
        $this->isActive = $dbRow['is_active'];
    }
}

?>