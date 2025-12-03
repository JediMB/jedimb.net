<?php declare(strict_types=1);

namespace Models\DB;

require_once 'models/base/db-created-modified.model.php';

use Models\Base\DBCreatedModified;

class Image extends DBCreatedModified {
    public string $filename;
    public string $title;
    public string $description;
    public array $galleryIds;

    public function __construct(array $dbRow) {
        parent::__construct($dbRow);

        $this->filename = $dbRow['filename'];
        $this->title = $dbRow['title'];
        $this->description = $dbRow['description'];
        $this->galleryIds = [];
    }
}

?>