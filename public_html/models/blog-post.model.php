<?php declare(strict_types=1);

namespace Models;

require_once 'models/page-base.model.php';

use DateTime;

class BlogPost extends PageBase {
    public string $permalink;
    public ?string $mastolink;
    public bool $isPublished;
    public bool $isPinned;

    public function __construct(array $dbRow) {
        parent::__construct($dbRow);

        $this->permalink = $dbRow['permalink'] ?? '';
        $this->mastolink = $dbRow['mastolink'] ?? null;
        $this->isPublished = $dbRow['is_published'] ?? false;
        $this->isPinned = $dbRow['is_pinned'] ?? false;
    }
}

?>