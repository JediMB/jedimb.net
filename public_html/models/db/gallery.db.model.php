<?php declare(strict_types=1);

namespace Models\DB;

require_once 'models/base/db-created-modified.model.php';

use Models\Base\DBCreatedModified;

class Gallery extends DBCreatedModified {
    public string $title;
    public string $description;
    public array $imageIds;

    public function __construct(array $dbRow) {
        parent::__construct($dbRow);

        $this->title = $dbRow['title'];
        $this->description = $dbRow['description'];
        $this->imageIds = [];
    }
}

?>