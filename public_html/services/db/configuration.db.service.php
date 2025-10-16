<?php declare(strict_types=1);

namespace Services\DB;

require_once 'models/db/configuration.db.model.php';
require_once 'services/base/base.db.service.php';

use Exception;
use PDOException;
use Models\DB\Configuration;
use Services\Base\BaseDBService;

class ConfigurationDBService extends BaseDBService {
    protected function __construct() {
        parent::__construct();
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

    public function getConfiguration() : array {
        try {
            $result = $this->dbService->selectView('configuration');

            $return = [];
            foreach ($result as $row) {
                $row = new Configuration($row);
                $return[$row->name] = $row;
            }

            return $return;
        }
        catch (PDOException $e) {
            throw new Exception('Database error: ' . $e->getMessage());
        }

        return [];
    }
}

?>