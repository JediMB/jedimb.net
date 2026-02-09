<?php declare(strict_types=1);

namespace Models\Base;

require_once 'models/base/db-created-modified.model.php';

class DBPageContent extends DBCreatedModified {
    public ?int $user_id;
    public string $title;
    public ?string $description; 
    public string $contentShort;
    public ?string $contentRest;
    public bool $isHidden;

    public function __construct(array $dbRow) {
        parent::__construct($dbRow);

        $this->user_id = $dbRow['user_id'] ?? null;
        $this->title = $dbRow['title'];
        $this->description = $dbRow['description'] ?? null;
        $this->contentShort = $dbRow['content_short'];
        $this->contentRest = $dbRow['content_rest'] ?? null;
        $this->isHidden = $dbRow['is_hidden'];
    }
}

?>