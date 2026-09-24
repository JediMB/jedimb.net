<?php declare(strict_types=1);

namespace Models;

class PageNavigationData {
    public int $id;
    public ?int $parentId;
    public string $pathPart;
    public ?string $menuTitle;
    public ?string $description;

    public function __construct(array $dbRow) {
        $this->id = $dbRow['id'] ?? 0;
        $this->parentId = $dbRow['parent_id'] ?? null;
        $this->pathPart = $dbRow['path_part'] ?? '';
        $this->menuTitle = $dbRow['menu_title'] ?? null;
        $this->description = $dbRow['description'] ?? null;
    }
}

?>