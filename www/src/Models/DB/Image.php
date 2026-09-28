<?php declare(strict_types=1);

namespace App\Models\DB;

use App\Abstract\DbCreatedModified;

class Image extends DbCreatedModified {
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