<?php declare(strict_types=1);

namespace Services\DB;

require_once 'models/db/configuration.db.model.php';
require_once 'services/base/base.db.service.php';

use Exception;
use PDO;
use PDOException;
use Models\DB\Configuration;
use Models\DTO\Configuration as ConfigurationDTO;
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

    public function createConfiguration(ConfigurationDTO $object) : Configuration {
        try {
            $result = $this->dbService->selectFunction(
                'create_configuration', [
                    1 => [ 'value' => $object->name, 'type' => PDO::PARAM_STR ],
                    2 => [ 'value' => $object->value, 'type' => PDO::PARAM_STR ]
                    ]
                );

            return new Configuration($result);
        }
        catch (PDOException $e) {
            throw new Exception('Database error: ' . $e->getMessage());
        }
    }

    public function updateConfiguration(Configuration $object) : Configuration {
        try {
            $result = $this->dbService->selectFunction(
                'update_configuration', [
                    1 => [ 'value' => $object->id, 'type' => PDO::PARAM_INT ],
                    2 => [ 'value' => $object->name, 'type' => PDO::PARAM_STR ],
                    3 => [ 'value' => $object->value, 'type' => PDO::PARAM_STR ],
                    4 => [ 'value' => $object->isActive, 'type' => PDO::PARAM_BOOL ]
                    ]
                );

            return new Configuration($result);
        }
        catch (PDOException $e) {
            throw new Exception('Database error: ' . $e->getMessage());
        }
    }
}

?>