<?php declare(strict_types=1);

namespace Models;

require_once 'models/page-base.model.php';

use DateTime;

class Page extends PageBase {
    public int $id;
    public ?int $parentId;
    public string $pathPart;
    public ?string $menuTitle;
    public DateTime $createdOn;
    public ?DateTime $modifiedOn;
    public bool $isVisible;
    public int $order;

    public function __construct(array $dbRow) {
        parent::__construct($dbRow);

        $this->id = $dbRow['id'] ?? 0;
        $this->parentId = $dbRow['parent_id'] ?? null;
        $this->pathPart = $dbRow['path_part'] ?? '';
        $this->menuTitle = $dbRow['menu_title'] ?? null;
        $this->createdOn = DateTime::createFromFormat('Y-m-d H:i:se', $dbRow['created_on'] ?? '') ?: new DateTime();
        $this->modifiedOn = DateTime::createFromFormat('Y-m-d H:i:se', $dbRow['modified_on']) ?: null;
        $this->isVisible = $dbRow['is_visible'] ?? false;
        $this->order = $dbRow['order'] ?? 0;
    }
}

?>