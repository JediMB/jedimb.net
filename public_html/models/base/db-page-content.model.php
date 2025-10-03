<?php declare(strict_types=1);

namespace Models\Base;

require_once 'models/base/db-object.model.php';

use DateTime;

class DBPageContent extends DBObject {
    public string $title;
    public ?string $description; 
    public string $content;
    public DateTime $createdOn;
    public ?DateTime $modifiedOn;
    public bool $isVisible;

    public function __construct(array $dbRow) {
        $this->title = $dbRow['title'] ?? '';
        $this->description = $dbRow['description'] ?? null;
        $this->content = $dbRow['content'] ?? '';
        $this->createdOn = DateTime::createFromFormat(DB_DATETIME_FORMAT, $dbRow['created_on'])
            ?: DateTime::createFromFormat(DB_DATETIME_FORMAT_FALLBACK, $dbRow['created_on'])
            ?: new DateTime();
        $this->modifiedOn = isset($dbRow['modified_on'])
            ? (
                DateTime::createFromFormat(DB_DATETIME_FORMAT, $dbRow['modified_on'])
                ?: DateTime::createFromFormat(DB_DATETIME_FORMAT_FALLBACK, $dbRow['modified_on'])
            )
            : null;
        $this->isVisible = $dbRow['is_visible'] ?? false;
    }
}

?>