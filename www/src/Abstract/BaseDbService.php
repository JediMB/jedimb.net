<?php declare(strict_types=1);

namespace App\Abstract;

use App\Abstract\Singleton;
use App\Database\DatabaseService;

abstract class BaseDbService extends Singleton {
    protected DatabaseService $dbService;
    protected string $table;

    protected function __construct() {
        $this->dbService = DatabaseService::getInstance();
    }
}