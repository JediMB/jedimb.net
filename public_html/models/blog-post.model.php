<?php

namespace Models;

use DateTime;

class BlogPost {
    public int $id;
    public string $permalink;
    public string $title;
    public string $content;
    public ?string $mastolink;
    public DateTime $createdOn;
    public ?DateTime $modifiedOn;
    public bool $isPublished;
    public bool $isVisible;
    public bool $isPinned;

    public function __construct(array $dbRow) {
        $this->id = $dbRow['id'] ?? 0;
        $this->permalink = $dbRow['permalink'] ?? '';
        $this->title = $dbRow['title'] ?? '';
        $this->content = $dbRow['content'] ?? '';
        $this->mastolink = $dbRow['mastolink'] ?? '';
        $this->createdOn = DateTime::createFromFormat('Y-m-d H:i:se', $dbRow['created_on'] ?? '') ?: new DateTime();
        $this->modifiedOn = DateTime::createFromFormat('Y-m-d H:i:se', $dbRow['modified_on']) ?: null;
        $this->isPublished = $dbRow['is_published'] ?? false;
        $this->isVisible = $dbRow['is_visible'] ?? false;
        $this->isPinned = $dbRow['is_pinned'] ?? false;
    }
}

?>