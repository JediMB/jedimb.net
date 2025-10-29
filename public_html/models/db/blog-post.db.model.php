<?php declare(strict_types=1);

namespace Models\DB;

require_once 'models/base/db-page-content.model.php';

use Models\Base\DBPageContent;

class BlogPost extends DBPageContent {
    public string $permalink;
    public ?string $mastolink;
    public bool $isPublished;
    public bool $isPinned;

    public function __construct(array $dbRow) {
        parent::__construct($dbRow);

        $this->permalink = $dbRow['permalink'];
        $this->mastolink = $dbRow['mastolink'] ?? null;
        $this->isPublished = $dbRow['is_published'];
        $this->isPinned = $dbRow['is_pinned'];
    }
}

?>