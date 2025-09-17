<?php

namespace Models;

use DateTime;

class Page {
    public int $id;
    public ?int $parentId;
    public string $pathPart;
    public string $title;
    public ?string $content;
    public DateTime $createdOn;
    public ?DateTime $modifiedOn;
    public bool $isVisible;

    public function __construct(array $dbRow) {
        $this->id = $dbRow['id'] ?? 0;
        $this->parentId = $dbRow['parent_id'] ?? null;
        $this->pathPart = $dbRow['path_part'] ?? '';
        $this->title = $dbRow['title'] ?? '';
        $this->content = $dbRow['content'] ?? null;
        $this->createdOn = DateTime::createFromFormat('Y-m-d H:i:se', $dbRow['created_on'] ?? '') ?: new DateTime();
        $this->modifiedOn = DateTime::createFromFormat('Y-m-d H:i:se', $dbRow['modified_on']) ?: null;
        $this->isVisible = $dbRow['is_visible'] ?? false;
    }
}

?>