<?php declare(strict_types=1);

namespace Abstract;

use Abstract\Singleton;
use Database\DatabaseService;

abstract class BaseDbService extends Singleton {
    protected DatabaseService $dbService;
    protected string $table;

    protected function __construct() {
        $this->dbService = DatabaseService::getInstance();
    }
}