<?php declare(strict_types=1);

namespace Services\DB;

require_once 'enums/db-fetch.enum.php';
require_once 'services/base/singleton.php';

use Exception;
use InvalidArgumentException;
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

    /** 
     * @param string $table
     * @param (array<string, bool|int|string>|null) $columnValues Key-Value pairs with the name of the column and the value to match
     * @param (array<string, bool>|null) $nullChecks Columns to check whether or not they're null
    */
    public function selectByColumnValues(string $table, array $columnValues = [], array $nullChecks = []) {
        if (empty($columnValues) && empty($nullChecks))
            throw new InvalidArgumentException('No column values or null checks provided');

        $whereString = $this->buildWhereString($columnValues, $nullChecks);

        $query = $this->service->prepare(
            "SELECT * FROM {$this->schema}.$table WHERE $whereString LIMIT 1"
        );

        $index = 1;
        foreach ($columnValues as $value) {
            $query->bindValue($index, $value, $this->getPDOParamType($value));
            $index++;
        }

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

    /** 
     * @param string $table
     * @param (array<string, bool|int|string>|null) $columnValues Key-Value pairs with the name of the column and the value to match
     * @param (array<string, bool>|null) $nullChecks Columns to check whether or not they're null
    */
    public function selectCount(string $table, array $columnValues = [], array $nullChecks = []) : int {
        if (empty($columnValues) && empty($nullChecks))
            $where = '';
        else
            $where = " WHERE {$this->buildWhereString($columnValues, $nullChecks)}";

        $query = $this->service->prepare(
            "SELECT count(*) FROM {$this->schema}.$table" . $where
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

    /** 
     * @param (array<string, bool|int|string>|null) $columnValues Key-Value pairs with the name of the column and the value to match
     * @param (array<string, bool>|null) $nullChecks Columns to check whether or not they're null
    */
    private function buildWhereString(array $columnValues, array $nullChecks) : string {
        $result = '';
        
        $valueCount = count($columnValues);
        if ($valueCount > 0) {
            $valueColumns = array_keys($columnValues);
            $result = "{$valueColumns[0]} = ?";

            for ($i = 1; $i < $valueCount; $i++) {
                $result =  "$result AND {$valueColumns[$i]} = ?";
            }
        }

        if (!$nullChecks)
            return $result;

        $nullCount = count($nullChecks);
        $nullColumns = array_keys($nullChecks);
        $startIndex = 0;

        if (!$result) {
            $startIndex = 1;
            $not = $nullChecks[$nullColumns[0]] ? '' : ' NOT';
            $result = "{$nullColumns[0]} IS$not NULL";
        }

        for ($i = $startIndex; $i < $nullCount; $i++) {
            $not = $nullChecks[$nullColumns[$i]] ? '' : ' NOT';
            $result = "$result AND {$nullColumns[$i]} IS$not NULL";
        }

        return $result;
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