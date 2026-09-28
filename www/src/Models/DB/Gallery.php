<?php declare(strict_types=1);

namespace App\Models\DB;

use App\Abstract\DbCreatedModified;

class Gallery extends DbCreatedModified {
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