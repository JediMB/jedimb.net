<?php declare(strict_types=1);

namespace Models\DB;

use Abstract\DbPageContent;

class Page extends DbPageContent {
    public ?string $titleShort;
    public ?int $parentId;
    public string $pathPart;
    public int $order;

    public function __construct(array $dbRow) {
        parent::__construct($dbRow);

        $this->titleShort = $dbRow['menu_title'] ?? null;
        $this->parentId = $dbRow['parent_id'] ?? null;
        $this->pathPart = $dbRow['path_part'];
        $this->order = $dbRow['order'];
    }
}