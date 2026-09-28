<?php declare(strict_types=1);

namespace App\Models\DB;

use App\Abstract\DbCreatedModified;

class Configuration extends DbCreatedModified {
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