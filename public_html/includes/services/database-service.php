<?php

namespace Services;

require_once 'includes/services/singleton.php';

use Configuration;
use PDO;

enum Fetch {
    case One;
    case All;
}

class DatabaseService extends Singleton {
    private PDO|null $service;
    private string $schema;

    protected function __construct() {
        $config = Configuration::getInstance();

        $this->service = new PDO(
            $config->dbDSN,
            $config->dbUser,
            $config->dbPass,
            DB_OPTIONS
        );
        $this->schema = $config->dbSchema;
    }
    public function __destruct() {
        $this->service = null;
    }

    public function selectById(string $name, int $id) {
        $query = $this->service->prepare(
            "SELECT * FROM " . $this->schema . ".$name WHERE id = $id"
        );
        $query->execute();

        return $query->fetch();
    }

    public function selectFunction(string $name, string $parameters, Fetch $amount = Fetch::One) {
        $query = $this->service->prepare(
            "SELECT * FROM " . $this->schema . ".$name($parameters)"
        );
        $query->execute();

        if ($amount === Fetch::All)
            return $query->fetchAll();

        return $query->fetch();
    }

    public function selectView(string $name, Fetch $amount = Fetch::One) {
        $query = $this->service->prepare(
            "SELECT * FROM " . $this->schema . ".$name"
        );
        $query->execute();

        if ($amount === Fetch::All)
            return $query->fetchAll();

        return $query->fetch();
    }
}

?>