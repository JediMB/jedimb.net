<?php

namespace Models;

require_once 'models/page-base.model.php';

use DateTime;

class BlogPost extends PageBase {
    public int $id;
    public string $permalink;
    public ?string $mastolink;
    public DateTime $createdOn;
    public ?DateTime $modifiedOn;
    public bool $isPublished;
    public bool $isVisible;
    public bool $isPinned;

    public function __construct(array $dbRow) {
        parent::__construct($dbRow);

        $this->id = $dbRow['id'] ?? 0;
        $this->permalink = $dbRow['permalink'] ?? '';
        $this->mastolink = $dbRow['mastolink'] ?? null;
        $this->createdOn = DateTime::createFromFormat('Y-m-d H:i:se', $dbRow['created_on'] ?? '') ?: new DateTime();
        $this->modifiedOn = DateTime::createFromFormat('Y-m-d H:i:se', $dbRow['modified_on']) ?: null;
        $this->isPublished = $dbRow['is_published'] ?? false;
        $this->isVisible = $dbRow['is_visible'] ?? false;
        $this->isPinned = $dbRow['is_pinned'] ?? false;
    }
}

?>