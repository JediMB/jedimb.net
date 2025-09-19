<?php

namespace Models;

use DateTime;

class Page {
    public int $id;
    public ?int $parentId;
    public string $pathPart;
    public ?string $menuTitle;
    public string $pageTitle;
    public ?string $content;
    public DateTime $createdOn;
    public ?DateTime $modifiedOn;
    public bool $isVisible;
    public int $order;

    public function __construct(array $dbRow) {
        $this->id = $dbRow['id'] ?? 0;
        $this->parentId = $dbRow['parent_id'] ?? null;
        $this->pathPart = $dbRow['path_part'] ?? '';
        $this->menuTitle = $dbRow['menu_title'] ?? null;
        $this->pageTitle = $dbRow['page_title'] ?? null;
        $this->content = $dbRow['content'] ?? null;
        $this->createdOn = DateTime::createFromFormat('Y-m-d H:i:se', $dbRow['created_on'] ?? '') ?: new DateTime();
        $this->modifiedOn = DateTime::createFromFormat('Y-m-d H:i:se', $dbRow['modified_on']) ?: null;
        $this->isVisible = $dbRow['is_visible'] ?? false;
        $this->order = $dbRow['order'] ?? 0;
    }
}

?>