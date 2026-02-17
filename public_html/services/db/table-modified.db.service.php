<?php declare(strict_types=1);

namespace Services\DB;

require_once 'services/base/base.db.service.php';
require_once 'utilities/datetime.utility.php';

use Exception;
use PDO;
use PDOException;
use Services\Base\BaseDBService;
use Utilities\DateTime;

class TableModifiedDBService extends BaseDBService {
    protected function __construct() {
        parent::__construct();
    }

    public function getTableModifiedDate(string $table) : \DateTime|false {
        try {
            $result = $this->dbService->selectByColumnValues('table_modified', [ 'table_name' => $table ]);

            if (!$result)
                return false;

            return DateTime::Parse($result['modified_on']) ?? false;
        }
        catch (PDOException $e) {
            throw new Exception('Database error: ' . $e->getMessage());
        }

        return false;
    }

    public function createTableModifiedDate(string $table) : \DateTime {
        try {
            $result = $this->dbService->selectFunction(
                'create_table_modified_date', [
                    1 => [ 'value' => $table, 'type' => PDO::PARAM_STR ]
                ]
            );

            if (!$result || empty($result['modified_on']))
                throw new Exception('Table modified date creation failed to return value.');

            return DateTime::Parse($result['modified_on']);
        }
        catch (PDOException $e) {
            throw new Exception('Database error: ' . $e->getMessage());
        }
    }

    public function updateTableModifiedDate(string $table) : \DateTime {
        try {
            $result = $this->dbService->selectFunction(
                'update_table_modified_date', [
                    1 => [ 'value' => $table, 'type' => PDO::PARAM_STR ]
                ]
            );

            if (!$result || empty($result['modified_on']))
                throw new Exception('Table modified date update failed to return value.');

            return DateTime::Parse($result['modified_on']);
        }
        catch (PDOException $e) {
            throw new Exception('Database error: ' . $e->getMessage());
        }
        
    }
}

?>