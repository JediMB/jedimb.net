<?php declare(strict_types=1);

namespace Services;

require_once 'services/base/singleton.php';
require_once 'services/db/configuration.db.service.php';

use Services\Base\Singleton;
use Services\DB\ConfigurationDBService;

class ConfigurationService extends Singleton {
    private ConfigurationDBService $configDbService;
    private bool $hasDBRows;

    protected function __construct() {
        $this->configDbService = ConfigurationDBService::getInstance();

        $this->hasDBRows = $this->configDbService->hasRows();
    }

    public function hasConfiguration() : bool {
        return $this->hasDBRows;
    }
}

?>