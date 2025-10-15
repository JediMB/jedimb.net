<?php declare(strict_types=1);

namespace Models\Base;

require_once 'models/base/db-base.model.php';

use DateTime;

class DBCreatedModified extends DBBase {
    public DateTime $createdOn;
    public ?DateTime $modifiedOn;

    public function __construct(array $dbRow) {
        parent::__construct($dbRow);

        $this->createdOn = DateTime::createFromFormat(DB_DATETIME_FORMAT, $dbRow['created_on'])
            ?: DateTime::createFromFormat(DB_DATETIME_FORMAT_FALLBACK, $dbRow['created_on']);
        $this->modifiedOn = isset($dbRow['modified_on'])
            ? (
                DateTime::createFromFormat(DB_DATETIME_FORMAT, $dbRow['modified_on'])
                ?: DateTime::createFromFormat(DB_DATETIME_FORMAT_FALLBACK, $dbRow['modified_on'])
            )
            : null;
    }
}

?>