<?php declare(strict_types=1);

namespace Services\DB;

require_once 'enums/db-fetch.enum.php';
require_once 'services/base/singleton.php';

use Exception;
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

    public function deleteById(string $table, int $id) {
        $query = $this->service->prepare(
            "DELETE FROM {$this->schema}.$table WHERE id = :id RETURNING *"
        );
        $query->bindParam(':id', $id, PDO::PARAM_INT);

        $query->execute();

        return $query->fetch();
    }

    public function hasRows(string $table) : bool {
        $query = $this->service->prepare(
            "SELECT id FROM {$this->schema}.$table LIMIT 1"
        );

        $query->execute();

        if ($query->fetch())
            return true;

        return false;
    }

    public function selectAllByColumnValue(string $table, string $column, mixed $value, ?string $orderBy = null, bool $descending = false) {
        $query = $this->service->prepare(
            "SELECT * FROM {$this->schema}.$table WHERE $column = :val" .
            $this->buildOrderString($orderBy, $descending)
        );
        $query->bindParam(':val', $value, $this->getPDOParamType($value));

        $query->execute();

        return $query->fetchAll();
    }

    public function selectOneByColumnValue(string $table, string $column, mixed $value) {
        $query = $this->service->prepare(
            "SELECT * FROM {$this->schema}.$table WHERE $column = :val LIMIT 1"
        );
        $query->bindParam(':val', $value, $this->getPDOParamType($value));

        $query->execute();

        return $query->fetch();
    }

    public function selectById(string $table, int $id, ?string $orderBy = null, bool $descending = false) {
        $query = $this->service->prepare(
            "SELECT * FROM {$this->schema}.$table WHERE id = :id" .
            $this->buildOrderString($orderBy, $descending)
        );
        $query->bindParam(':id', $id, PDO::PARAM_INT);

        $query->execute();

        return $query->fetch();
    }

    public function selectCount(string $table) : int {
        $query = $this->service->prepare(
            "SELECT count(*) FROM {$this->schema}.$table"
        );
        
        $query->execute();

        return (int) $query->fetch()['count'];
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

    public function selectView(string $view, ?string $orderBy = null, bool $descending = false) {
        $query = $this->service->prepare(
            "SELECT * FROM {$this->schema}.$view" .
            $this->buildOrderString($orderBy, $descending)
        );
        $query->execute();

        return $query->fetchAll() ?: [];
    }

    private function buildOrderString(?string $orderBy = null, bool $descending = false) : string {
        if (empty($orderBy))
            return ' ORDER BY id ASC';

        return " ORDER BY \"$orderBy\" " . ($descending ? 'DESC' : 'ASC');
    }

    private function getPDOParamType($value) : int {
        switch (gettype($value)) {
            case 'integer':
                return PDO::PARAM_INT;
            
            case 'string':
                return PDO::PARAM_STR;

            case 'boolean':
                return PDO::PARAM_BOOL;

            default:
                throw new Exception('Unrecognized parameter type');
        }
    }
}

?>