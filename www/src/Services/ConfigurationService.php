<?php declare(strict_types=1);

namespace App\Services;

use Exception;
use App\Abstract\Singleton;
use App\Database\ConfigurationDbService;
use App\Enums\ConfigType;
use App\Models\DB\Configuration;
use App\Models\DTO\ConfigurationDTO;

class ConfigurationService extends Singleton {
    /** @var (array<string, ConfigType>) $CONFIGURABLE_CONSTANTS */
    public static array $CONFIGURABLE_CONSTANTS = [
        'SITE_TITLE' => ConfigType::Text,
        'SITE_TAGLINE' => ConfigType::Text,
        'SITE_AUTHOR' => ConfigType::Text,
        'META_DESCRIPTION' => ConfigType::Text,
        'META_KEYWORDS' => ConfigType::CSV,
        'PAGINATION_PAGE_SIZE' => ConfigType::Number
    ];

    public static function isConfigurable(string $name) {
        return array_key_exists($name, static::$CONFIGURABLE_CONSTANTS);
    }

    private readonly ConfigurationDbService $configDbService;
    /** @var (array<string, Configuration>) $configuration */
    private readonly array $configuration;
    /** @var (array<string, string|int>) */
    private readonly array $constants;

    protected function __construct() {
        $this->configDbService = ConfigurationDbService::getInstance();

        $this->configuration = $this->configDbService->getConfiguration();

        $this->constants = get_defined_constants(true)['user'] ?? [];
    }

    private function checkValidity(string $name) {
        if (empty($this->constants[$name]))
            throw new Exception('Specified constant does not exist');
    }

    public function createConfiguration(ConfigurationDTO $object) : Configuration {
        if (!isset($this->constants[$object->name]))
            throw new Exception("Trying to create a configuration for a non-eligible constant name {$object->name}");

        if (gettype($object->value) !== gettype($this->constants[$object->name]))
            throw new Exception("Submitted configuration value type does not match constant value type for {$object->name}");

        return $this->configDbService->createConfiguration($object);
    }

    public function getDefault(string $name) : string|int {
        $this->checkValidity($name);

        return $this->constants[$name];
    }

    public function getConfiguration(string $name) : Configuration|false {
        $this->checkValidity($name);

        $configuration = $this->configuration[$name] ?? false;

        return $configuration;
    }

    public function getCurrentValue(string $name) : string|int {
        $this->checkValidity($name);

        if ($this->noActiveConfiguration($name))
            return $this->constants[$name];

        return $this->configuration[$name]->value;
    }

    /**
     * @param string[] $names
     * @return (string|int)[]
     */
    public function getCurrentValues(array $names) : array {
        return array_map(fn($name) => $this->getCurrentValue($name), $names);
    }

    private function noActiveConfiguration(string $name) : bool {
        return $this->configuration[$name]?->isInactive ?? true;
    }

    public function updateConfiguration(Configuration $object) : Configuration {
        if (!isset($this->constants[$object->name]))
            throw new Exception("Trying to update a configuration for non-eligible constant name {$object->name}");

        $oldConfig = $this->configuration[$object->name]
            ?? throw new Exception("Trying to update nonexistent configuration for constant name {$object->name}");

        if ($object->configType !== $oldConfig->configType)
            throw new Exception("Submitted configuration type does not match preexisting type for constant name {$object->name}");

        return $this->configDbService->updateConfiguration($object);
    }
}