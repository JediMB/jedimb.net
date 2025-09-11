<?php

require_once 'includes/services/singleton.php';

enum Fetch {
    case One;
    case All;
}

class DatabaseService extends Singleton {
    private PDO|null $service;
    private Configuration $config;

    protected function __construct() {
        $this->service = new PDO(
                $GLOBALS['db_dsn'],
                $GLOBALS['db_user'],
                $GLOBALS['db_pass'],
                [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
            );
        
            $this->config = Configuration::getInstance();
    }
    public function __destruct() {
        $this->service = null;
    }

    public function selectFunction(string $name, string $parameters, Fetch $amount = Fetch::One) {
        $schema = $GLOBALS['db_schema'];
        
        $query = $this->service->prepare(
            "SELECT * FROM $schema.$name($parameters)"
        );
        $query->execute();

        if ($amount === Fetch::All)
            return $query->fetchAll();

        return $query->fetch();
    }

    public function selectView(string $name, Fetch $amount = Fetch::One) {
        $schema = $GLOBALS['db_schema'];
        
        $query = $this->service->prepare(
            "SELECT * FROM $schema.$name"
        );
        $query->execute();

        if ($amount === Fetch::All)
            return $query->fetchAll();

        return $query->fetch();
    }
}

?>