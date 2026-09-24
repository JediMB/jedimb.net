<?php declare(strict_types=1);

namespace Models\Base;

class DBBase {
    public int $id;

    public function __construct(array $dbRow) {
        $this->id = $dbRow['id'];
    }
}

?>