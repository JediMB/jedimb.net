<?php declare(strict_types=1);

namespace App\Models\DTO;

use InvalidArgumentException;
use TypeError;
use App\Abstract\DbBase;
use App\Enums\ConfigType;
use App\Enums\InputError;
use App\Models\DB\Configuration;
use App\Models\Exceptions\InputException;
use App\Utils\Input;

class ConfigurationDTO extends DbBase {
    public string $name;
    public string|null $value;
    public ConfigType $configType;
    public ?bool $isInactive;

    /** @param (array{id: int, name: string, value: string, configType: string, isInactive: boolean}) $input */
    public function __construct(array $input) {
        parent::__construct($input);

        $errors =  [];

        $this->name = $input['name'];
        $this->value = Input::verifyOptionalTextInput('value', $input, INPUT_LENGTH['constant_value'], $errors, REGEX_PHP['default_text']);
        $this->configType = ConfigType::from($input['configType']);
        $this->isInactive = $input['isInactive'] ?? null;

        if (!empty($errors))
            throw new InputException(__CLASS__, $errors);
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