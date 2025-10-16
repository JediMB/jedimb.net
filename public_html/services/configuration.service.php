<?php declare(strict_types=1);

namespace Services;

require_once 'services/base/singleton.php';
require_once 'services/db/configuration.db.service.php';

use Exception;
use Models\DB\Configuration;
use Services\Base\Singleton;
use Services\DB\ConfigurationDBService;

class ConfigurationService extends Singleton {
    private readonly ConfigurationDBService $configDbService;
    private readonly array $configuration;
    private readonly array $constants;

    protected function __construct() {
        $this->configDbService = ConfigurationDBService::getInstance();

        $this->configuration = $this->configDbService->getConfiguration();

        $this->constants = get_defined_constants(true)['user'] ?? [];
    }

    public function getUserConstant(string $name) : string {
        if (empty($this->constants[$name]))
            throw new Exception('Trying to access nonexistent constant');

        if ($this->noActiveConstant($name))
            return $this->constants[$name];
        
        return $this->configuration[$name]->value;
    }

    public function getUserConstants(array $names) : array {
        $constants = [];

        foreach ($names as $name) {
            $constants[strtolower($name)] = $this->getUserConstant($name);
        }

        return $constants;
    }

    public function hasConfiguration() : bool {
        return !!$this->configuration;
    }

    private function noActiveConstant(string $name) : bool {
        return isset($this->configuration[$name]) === false
            || $this->configuration[$name]->isActive === false;
    }
}

?>