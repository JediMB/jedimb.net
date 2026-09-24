<?php declare(strict_types=1);

namespace Services\Base;

require_once 'services/base/singleton.php';
require_once 'services/db/database.service.php';

use Exception;
use Services\Base\Singleton;
use Services\DB\DatabaseService;

class BaseDBService extends Singleton {
    protected DatabaseService $dbService;
    protected string $table;

    protected function __construct() {
        $this->dbService = DatabaseService::getInstance();
    }
}

?>