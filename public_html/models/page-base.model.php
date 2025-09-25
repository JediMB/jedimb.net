<?php declare(strict_types=1);

namespace Models;

use DateTime;

class PageBase {
    public int $id;
    public string $title;
    public ?string $description; 
    public string $content;
    public DateTime $createdOn;
    public ?DateTime $modifiedOn;
    public bool $isVisible;

    public function __construct(array $dbRow)
    {
        $this->id = $dbRow['id'] ?? 0;
        $this->title = $dbRow['title'] ?? '';
        $this->description = $dbRow['description'] ?? null;
        $this->content = $dbRow['content'] ?? '';
        $this->createdOn = DateTime::createFromFormat(DB_DATETIME_FORMAT, $dbRow['created_on'] ?? '') ?: new DateTime();
        $this->modifiedOn = DateTime::createFromFormat(DB_DATETIME_FORMAT, $dbRow['modified_on'] ?? '') ?: null;
        $this->isVisible = $dbRow['is_visible'] ?? false;
    }
}

?>