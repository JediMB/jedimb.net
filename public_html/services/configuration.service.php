<?php declare(strict_types=1);

namespace Services;

require_once 'services/base/singleton.php';
require_once 'services/db/configuration.db.service.php';

use Exception;
use Models\DB\Configuration;
use Models\DTO\Configuration as ConfigurationDTO;
use Services\Base\Singleton;
use Services\DB\ConfigurationDBService;

class ConfigurationService extends Singleton {
    private readonly ConfigurationDBService $configDbService;
    /** @var (array<string, Configuration>) $configuration */
    private readonly array $configuration;
    /** @var (array<string, string|int>) */
    private readonly array $constants;

    protected function __construct() {
        $this->configDbService = ConfigurationDBService::getInstance();

        $this->configuration = $this->configDbService->getConfiguration();

        $this->constants = get_defined_constants(true)['user'] ?? [];
    }


    /** @return (array{'default': int|string, 'config': ?Configuration}) */
    public function getConfiguration(string $name) : array {
        if (empty($this->constants[$name]))
            throw new Exception('Trying to access nonexistent constant');

        $configuration = $this->configuration[$name] ?? null;

        return [
            'default' => $this->constants[$name],
            'config' => $configuration
        ];
    }

    public function getUserConstant(string $name) : Configuration|string|int {
        if (empty($this->constants[$name]))
            throw new Exception('Trying to access nonexistent constant');

        if ($this->noActiveConfiguration($name))
            return $this->constants[$name];

        $configItem = $this->configuration[$name];

        if ($configItem->valueInt !== null)
            return $configItem->valueInt;

        return $configItem->valueString;
    }

    /** @return (array<string, Configuration|string|int>) */
    public function getUserConstants(array $names) : array {
        $constants = [];

        foreach ($names as $name) {
            $constants[strtolower($name)] = $this->getUserConstant($name);
        }

        return $constants;
    }

    private function noActiveConfiguration(string $name) : bool {
        return isset($this->configuration[$name]) === false
            || $this->configuration[$name]->isActive === false;
    }

    public function createConfiguration(ConfigurationDTO $object) : Configuration {
        return $this->configDbService->createConfiguration($object);
    }

    public function updateConfiguration(Configuration $object) : Configuration {
        return $this->configDbService->updateConfiguration($object);
    }
}

?>