<?php declare(strict_types=1);

namespace Models;

require_once 'models/page-base.model.php';

class Page extends PageBase {
    public ?int $parentId;
    public string $pathPart;
    public ?string $menuTitle;
    public int $order;

    public function __construct(array $dbRow) {
        parent::__construct($dbRow);

        $this->parentId = $dbRow['parent_id'] ?? null;
        $this->pathPart = $dbRow['path_part'] ?? '';
        $this->menuTitle = $dbRow['menu_title'] ?? null;
        $this->order = $dbRow['order'] ?? 0;
    }
}

?>