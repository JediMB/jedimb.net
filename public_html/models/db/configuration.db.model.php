<?php declare(strict_types=1);

namespace Models\DB;

require_once 'enums/config-type.enum.php';
require_once 'models/base/db-created-modified.model.php';

use Enums\ConfigType;
use Models\Base\DBCreatedModified;

class Configuration extends DBCreatedModified {
    public string $name;
    public string $value;
    public ConfigType $type;
    public string $typeString;
    public string $isActive;

    public function __construct(array $dbRow) {
        parent::__construct($dbRow);

        $this->name = $dbRow['name'];
        $this->value = $dbRow['value'];
        $this->type = ConfigType::tryFrom($dbRow['type']) ?: ConfigType::string;
        $this->typeString = $dbRow['type_string'];
        $this->isActive = $dbRow['is_active'];
    }
}

?>