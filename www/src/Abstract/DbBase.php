<?php declare(strict_types=1);

namespace Abstract;

abstract class DbBase {
    public int $id;

    public function __construct(array $dbRow) {
        $this->id = $dbRow['id'];
    }
}