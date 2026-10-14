<?php declare(strict_types=1);

namespace App\Models\DB;

use App\Abstract\DbCreatedModified;
use App\Enums\ConfigType;

class Configuration extends DbCreatedModified {
    public string $name;
    public string $value;
    public ConfigType $configType;
    public bool $isInactive;

    public function __construct(array $dbRow) {
        parent::__construct($dbRow);

        $this->name = $dbRow['name'];
        $this->value = $dbRow['value'];
        $this->configType = ConfigType::from($dbRow['config_type']);
        $this->isInactive = $dbRow['is_inactive'];
    }
}