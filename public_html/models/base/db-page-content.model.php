<?php declare(strict_types=1);

namespace Models\Base;

require_once 'models/base/db-created-modified.model.php';

use DateTime;

class DBPageContent extends DBCreatedModified {
    public string $title;
    public ?string $description; 
    public string $content;
    public bool $isVisible;

    public function __construct(array $dbRow) {
        parent::__construct($dbRow);

        $this->title = $dbRow['title'];
        $this->description = $dbRow['description'] ?? null;
        $this->content = $dbRow['content'];
        $this->isVisible = $dbRow['is_visible'];
    }
}

?>