<?php declare(strict_types=1);

namespace Models\DTO;

use InvalidArgumentException;

require_once 'models/db/configuration.db.model.php';

class Configuration {
    public int $id;
    public string $name;
    public ?string $value;
    public ?bool $isActive;

    public function __construct(array $input) {
        $this->id = $input['id'];
        $this->name = $input['name'];
        $this->value = $input['value'] ?? null;
        $this->isActive = $input['isActive'] ?? null;
    }

    public static function update(\Models\DB\Configuration &$object, Configuration $source) {
        if ($object->id !== $source->id)
            throw new InvalidArgumentException('Incorrect Configuration id in update call');
        if ($object->name !== $source->name)
            throw new InvalidArgumentException('Incorrect Configuration name in update call');

        if ($source->value !== null) $object->value = $source->value;
        if ($source->isActive !== null) $object->isActive = $source->isActive;
    }
}

?>