<?php declare(strict_types=1);

namespace Abstract;

use Utils\DateTime;

abstract class DbCreatedModified extends DbBase {
    public \DateTime $createdOn;
    public ?\DateTime $modifiedOn;

    public function __construct(array $dbRow) {
        parent::__construct($dbRow);

        $this->createdOn = DateTime::parse($dbRow['created_on']);
        $this->modifiedOn = DateTime::parse($dbRow['modified_on']);
    }
}