<?php declare(strict_types=1);

namespace App\Models\DTO;

use InvalidArgumentException;
use App\Enums\ConfigType;
use App\Models\DB\Configuration;

class ConfigurationDTO {
    public int $id;
    public string $name;
    public string|null $value;
    public ConfigType $configType;
    public ?bool $isInactive;

    public function __construct(array $input) {
        $this->id = $input['id'];
        $this->name = trim($input['name']);

        if (is_string($input['value']))
            $this->value = $input['value'];
        else
            $this->value = null;
        
        $this->configType = ConfigType::from($input['configType']);
        $this->isInactive = $input['isInactive'] ?? null;
    }

    public static function update(Configuration &$object, ConfigurationDTO $source) {
        if ($object->id !== $source->id)
            throw new InvalidArgumentException('Incorrect Configuration id in update call');
        if ($object->name !== $source->name)
            throw new InvalidArgumentException('Incorrect Configuration name in update call');
        if ($object->configType !== $object->configType)
            throw new InvalidArgumentException('Incorrect Configuration type in update call');

        if ($source->value !== null)
            $object->value = $source->value;

        if ($source->isInactive !== null)
            $object->isInactive = $source->isInactive;
    }
}