<?php declare(strict_types=1);

namespace Services;

require_once 'services/base/singleton.php';
require_once 'services/db/table-modified.db.service.php';

use DateTime;
use Services\Base\Singleton;
use Services\DB\TableModifiedDBService;

class TableModifiedService extends Singleton {
    private TableModifiedDBService $tableModifiedDbService;

    protected function __construct() {
        $this->tableModifiedDbService = TableModifiedDBService::getInstance();
    }

    public function getOrCreateModifiedDate(string $table) : DateTime {
        $date = $this->tableModifiedDbService->getTableModifiedDate($table);

        if (!$date)
            $date = $this->tableModifiedDbService->createTableModifiedDate($table);

        return $date;
    }

    public function createTableModifiedDate(string $table) : DateTime {
        return $this->tableModifiedDbService->createTableModifiedDate($table);
    }
}

?>