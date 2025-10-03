<?php declare(strict_types=1);

namespace Services\DB;

require_once 'enums/db-fetch.enum.php';
require_once 'services/base/singleton.php';

use PDO;
use Enums\DBFetch;
use Services\Base\Singleton;

class DatabaseService extends Singleton {
    private PDO|null $service;
    private string $schema;

    protected function __construct() {
        $this->service = new PDO(
            DB_SOURCE['dsn'],
            DB_SOURCE['user'],
            DB_SOURCE['pass'],
            DB_OPTIONS
        );
        $this->schema = DB_SOURCE['schema'];
    }
    public function __destruct() {
        $this->service = null;
    }

    public function selectById(string $table, int $id) {
        $query = $this->service->prepare(
            "SELECT * FROM {$this->schema}.$table WHERE id = :id"
        );
        $query->bindParam(':id', $id, PDO::PARAM_INT);

        $query->execute();

        return $query->fetch();
    }

    public function selectFunction(string $function, array $parameters, DBFetch $amount = DBFetch::One) {
        $paramString = rtrim(str_repeat('?, ', count($parameters)), ', ');
        $query = $this->service->prepare(
            "SELECT * FROM {$this->schema}.$function($paramString)"
        );

        foreach ($parameters as $id => $param) {
            $query->bindParam($id, $param['value'], $param['type']);
        }

        $query->execute();

        if ($amount === DBFetch::All)
            return $query->fetchAll() ?: [];
        
        return $query->fetch();
    }

    public function selectView(string $view) {
        $query = $this->service->prepare(
            "SELECT * FROM {$this->schema}.$view"
        );
        $query->execute();

        return $query->fetchAll() ?: [];
    }
}

?>