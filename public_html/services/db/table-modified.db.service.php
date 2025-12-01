<?php declare(strict_types=1);

namespace Services\DB;

require_once 'services/base/base.db.service.php';

use Exception;
use PDOException;
use Services\Base\BaseDBService;

class TableModifiedDBService extends BaseDBService {
    protected function __construct() {
        parent::__construct();
    }

    public function getTableModifiedDate(string $table) : false {
        try {
            
        }
        catch (PDOException $e) {
            throw new Exception('Database error: ' . $e->getMessage());
        }

        return false;
    }
}

?>