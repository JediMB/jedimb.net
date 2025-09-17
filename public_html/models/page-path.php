<?php

namespace Models;

class PagePath {
    public int $id;
    public ?int $parentId;
    public string $pathPart;

    public function __construct(array $dbRow) {
        $this->id = $dbRow['id'] ?? 0;
        $this->parentId = $dbRow['parent_id'] ?? null;
        $this->pathPart = $dbRow['path_part'] ?? '';
    }
}

?>