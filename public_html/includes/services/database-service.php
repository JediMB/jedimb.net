<?php

require_once 'includes/services/singleton.php';

use PgSql\Connection;
use PgSql\Result;

class DatabaseService extends Singleton {
    function __destruct() {
        $this->disconnect();
    }

    private string|false $connectionString = false;
    private string|false $schema = false;

    public function initialize(string $connectionString, string $schema) {
        $this->connectionString = $connectionString;
        $this->schema = $schema;
    }

    private Connection|false $connection = false;
    private Result|false $latest = false;

    function connect() {
        if (!$this->connectionString)
            throw new Exception('No connection string or database service uninitialized.');

        $this->connection = pg_connect($GLOBALS['db_connection_string'])
            or throw new Exception('Couldn\'t connect to database.');
    }

    function selectFunction(
        string $functionName,
        array $args = []
    ) {
        $this->resultFree();

        $dbConnection =
            $this->connection
            ?: throw new Exception('No database connection available for query.');

        $query = 'SELECT * FROM ' . $this->schema . '.' .
            $functionName . '(\'' .
                ($args ? implode('\', \'', $args) : null)
            . '\')';

        $this->latest = pg_query($dbConnection, $query)
            or throw new Exception('Database query failed: ' . pg_last_error());
    }

    function select(
        string $tableName,
        array $columns = [],
        array $conditions = [],
        array $orderBy = [],
        ?int $rowLimit = null,
        ?int $rowOffset = null
    ) {
        $this->resultFree();

        $dbConnection =
            $this->connection
            ?: throw new Exception('No database connection available for query.');

        $query = 'SELECT ' . ( $columns ? implode(', ', $columns) : '*' ) .
            ' FROM ' . $this->schema . '.' . $tableName .
            ( $conditions ? ' WHERE ' . implode(' AND ', $conditions) : null ) .
            ( $orderBy ? ' ORDER BY ' . implode(' THEN ', $orderBy) : null ) .
            ( $rowLimit ? ' LIMIT ' . $rowLimit : null ) .
            ( $rowOffset ? ' OFFSET ' . $rowOffset : null );

        $this->latest = pg_query($dbConnection, $query)
            or throw new Exception('Database query failed: ' . pg_last_error());
    }

    function nextRow() {
        $result = $this->latest
            ?: throw new Exception('No database result to fetch row from.');

        return pg_fetch_array($result, null, PGSQL_ASSOC);
    }

    function resultFree(?Result $result = null) {
        if ($result)
            return pg_free_result($result);
        
        if ($this->latest && pg_free_result($this->latest)) {
            $this->latest = false;
            return true;
        }

        return false;
    }

    function disconnect() {
        $this->resultFree();

        if (!$this->connection)
            return false;

        pg_close($this->connection);
        $this->connection = false;
        return true;
    }
}

?>