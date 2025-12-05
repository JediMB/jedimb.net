<?php declare(strict_types=1);

namespace Models\Base;

require_once 'models/base/db-base.model.php';
require_once 'utilities/datetime.utility.php';

use Utilities\DateTime;

class DBCreatedModified extends DBBase {
    public \DateTime $createdOn;
    public ?\DateTime $modifiedOn;

    public function __construct(array $dbRow) {
        parent::__construct($dbRow);

        $this->createdOn = DateTime::Parse($dbRow['created_on']);
        $this->modifiedOn = DateTime::Parse($dbRow['modified_on']);
    }
}

?>