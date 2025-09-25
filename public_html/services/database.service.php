<?php declare(strict_types=1);

namespace Services;

require_once 'services/singleton.php';
require_once 'enums/db-fetch.enum.php';

use PDO;
use Enums\DBFetch;

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

    public function selectById(string $name, int $id) {
        $query = $this->service->prepare(
            "SELECT * FROM " . $this->schema . ".$name WHERE id = $id"
        );
        $query->execute();

        return $query->fetch();
    }

    public function selectFunction(string $name, string $parameters, DBFetch $amount = DBFetch::One) {
        $query = $this->service->prepare(
            "SELECT * FROM " . $this->schema . ".$name($parameters)"
        );
        $query->execute();

        if ($amount === DBFetch::All)
            return $query->fetchAll();

        return $query->fetch();
    }

    public function selectView(string $name) {
        $query = $this->service->prepare(
            "SELECT * FROM " . $this->schema . ".$name"
        );
        $query->execute();

        return $query->fetchAll();
    }
}

?>