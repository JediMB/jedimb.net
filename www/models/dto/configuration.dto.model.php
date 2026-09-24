<?php declare(strict_types=1);

namespace Models\DTO;

use InvalidArgumentException;

require_once 'models/db/configuration.db.model.php';

class Configuration {
    public int $id;
    public string $name;
    public string|int|null $value;
    public ?bool $isActive;

    public function __construct(array $input) {
        $this->id = $input['id'];
        $this->name = trim($input['name']);

        $value = $input['value'];
        $this->value = is_null($value)
            ? null
            : (
                is_int($value)
                ? $value
                : trim("$value")
            );
        $this->isActive = $input['isActive'] ?? null;
    }

    public static function update(\Models\DB\Configuration &$object, Configuration $source) {
        if ($object->id !== $source->id)
            throw new InvalidArgumentException('Incorrect Configuration id in update call');
        if ($object->name !== $source->name)
            throw new InvalidArgumentException('Incorrect Configuration name in update call');

        if ($source->value !== null) {
            if (is_int($source->value)) {
                $object->valueInt = $source->value;
                $object->valueString = null;
            }
            else {
                $object->valueString = $source->value;
                $object->valueInt = null;
            }
        }

        if ($source->isActive !== null) $object->isActive = $source->isActive;
    }
}

?>