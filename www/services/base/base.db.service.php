<?php declare(strict_types=1);

namespace Services\Base;

require_once 'services/base/singleton.php';

use Services\Base\Singleton;
use Database\DatabaseService;

class BaseDbService extends Singleton {
    protected DatabaseService $dbService;
    protected string $table;

    protected function __construct() {
        $this->dbService = DatabaseService::getInstance();
    }
}

?>