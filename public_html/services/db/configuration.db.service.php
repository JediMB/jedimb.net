<?php declare(strict_types=1);

namespace Services\DB;

require_once 'services/base/singleton.php';
require_once 'services/db/database.service.php';

use Exception;
use PDOException;
use Services\Base\Singleton;
use Services\DB\DatabaseService;

class ConfigurationDBService extends Singleton {
    private DatabaseService $dbService;

    protected function __construct() {
        $this->dbService = DatabaseService::getInstance();
    }

    public function hasRows() : bool {
        try {
            $result = $this->dbService->hasRows('configuration');

            return $result;
        }
        catch (PDOException $e) {
            throw new Exception('Database error: ' . $e->getMessage());
        }

        return false;
    }
}

?>