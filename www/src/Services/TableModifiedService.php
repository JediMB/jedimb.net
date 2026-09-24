<?php declare(strict_types=1);

namespace Services;

require_once 'services/base/singleton.php';

use DateTime;
use Services\Base\Singleton;
use Database\TableModifiedDbService;

class TableModifiedService extends Singleton {
    private TableModifiedDbService $tableModifiedDbService;

    protected function __construct() {
        $this->tableModifiedDbService = TableModifiedDbService::getInstance();
    }

    public function getOrCreateModifiedDate(string $table) : DateTime {
        $date = $this->tableModifiedDbService->getTableModifiedDate($table);

        if (!$date)
            $date = $this->tableModifiedDbService->createTableModifiedDate($table);

        return $date;
    }

    public function createOrUpdateTableModifiedDate(string $table) : DateTime {
        $date = $this->tableModifiedDbService->getTableModifiedDate($table);

        if (!$date)
            return $this->tableModifiedDbService->createTableModifiedDate($table);

        return $this->tableModifiedDbService->updateTableModifiedDate($table);
    }
}