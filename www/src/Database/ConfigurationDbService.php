<?php declare(strict_types=1);

namespace App\Database;

use Exception;
use PDO;
use PDOException;
use App\Abstract\BaseDbService;
use App\Models\DB\Configuration;
use App\Models\DTO\ConfigurationDTO;
use App\Models\Exceptions\DatabaseException;

class ConfigurationDbService extends BaseDbService {
    protected function __construct() {
        parent::__construct();
    }

    public function hasRows() : bool {
        try {
            $result = $this->dbService->hasRows('configuration');
            
            return $result;
        }
        catch (PDOException $e) {
            throw new DatabaseException($e->getMessage());
        }

        return false;
    }

    /** @return (array<string, Configuration>) */
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
            throw new DatabaseException($e->getMessage());
        }

        return [];
    }

    public function createConfiguration(ConfigurationDTO $object) : Configuration {
        try {
            $result = $this->dbService->selectFunction(
                'create_configuration', [
                    1 => [ 'value' => $object->name, 'type' => PDO::PARAM_STR ],
                    2 => [ 'value' => $object->value, 'type' => PDO::PARAM_STR ],
                    3 => [ 'value' => $object->configType->value, 'type' => PDO::PARAM_STR ]
                    ]
                );

            return new Configuration($result);
        }
        catch (PDOException $e) {
            throw new DatabaseException($e->getMessage());
        }
    }

    public function updateConfiguration(Configuration $object) : Configuration {
        try {
            $result = $this->dbService->selectFunction(
                'update_configuration', [
                    1 => [ 'value' => $object->id, 'type' => PDO::PARAM_INT ],
                    2 => [ 'value' => $object->name, 'type' => PDO::PARAM_STR ],
                    3 => [ 'value' => $object->value, 'type' => PDO::PARAM_STR ],
                    4 => [ 'value' => $object->configType->value, 'type' => PDO::PARAM_STR ],
                    5 => [ 'value' => $object->isInactive, 'type' => PDO::PARAM_BOOL ]
                    ]
                );

            return new Configuration($result);
        }
        catch (PDOException $e) {
            throw new DatabaseException($e->getMessage());
        }
    }
}