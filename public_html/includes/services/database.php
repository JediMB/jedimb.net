<?php

function dbConnect() {
    $dbConnection = pg_connect($GLOBALS['db_connection_string'])
        or throw new Exception('Couldn\'t connect to database.');

    $GLOBALS['db_connection'] = $dbConnection;
}

function dbSelectFunction(
        string $functionName,
        array $args = []
) {
    dbResultFree();

    $dbConnection =
        $GLOBALS['db_connection']
        ?? throw new Exception('No database connection available for query.');

    $query = 'SELECT * FROM ' . $GLOBALS['db_schema'] . '.' .
        $functionName . '(\'' .
            ($args ? implode('\', \'', $args) : null)
        . '\')';

    $result = pg_query($dbConnection, $query)
        or throw new Exception('Database query failed: ' . pg_last_error());

    $GLOBALS['db_result'] = $result;
}

function dbSelect(
        string $tableName,
        array $columns = [],
        array $conditions = [],
        array $orderBy = [],
        ?int $rowLimit = null,
        ?int $rowOffset = null
) {
    dbResultFree();

    $dbConnection =
        $GLOBALS['db_connection']
        ?? throw new Exception('No database connection available for query.');

    $query = 'SELECT ' . ( $columns ? implode(', ', $columns) : '*' ) .
        ' FROM ' . $GLOBALS['db_schema']. '.' . $tableName .
        ( $conditions ? ' WHERE ' . implode(' AND ', $conditions) : null ) .
        ( $orderBy ? ' ORDER BY ' . implode(' THEN ', $orderBy) : null ) .
        ( $rowLimit ? ' LIMIT ' . $rowLimit : null ) .
        ( $rowOffset ? ' OFFSET ' . $rowOffset : null );

    $result = pg_query($dbConnection, $query)
        or throw new Exception('Database query failed: ' . pg_last_error());

    $GLOBALS['db_result'] = $result;
}

function dbResultNextRow() {
    $result = $GLOBALS['db_result']
        ?? throw new Exception('No database result to fetch row from.');

    return pg_fetch_array($result, null, PGSQL_ASSOC);
}

function dbResultFree(?\PgSql\Result $result = null) {
    if ($result)
        return pg_free_result($result);
    
    if (isset($GLOBALS['db_result'])) {
        $success = pg_free_result($GLOBALS['db_result']);
        unset($GLOBALS['db_result']);
        return $success;
    }

    return false;
}

function dbDisconnect() {
    dbResultFree();
    unset($GLOBALS['db_connection']);
    return pg_close();
}

?>