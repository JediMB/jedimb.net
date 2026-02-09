<?php declare(strict_types=1);

namespace Models\DB;

require_once 'models/base/db-page-content.model.php';

use Models\Base\DBPageContent;
use Utilities\DateTime;

class BlogPost extends DBPageContent {
    public string $permalink;
    public ?string $mastolink;
    public bool $isPinned;
    public bool $isPublished;
    public ?\DateTime $publishedOn;

    public function __construct(array $dbRow) {
        parent::__construct($dbRow);

        $this->permalink = $dbRow['permalink'];
        $this->mastolink = $dbRow['mastolink'] ?? null;
        $this->isPinned = $dbRow['is_pinned'];
        $this->isPublished = $dbRow['is_published'];
        $this->publishedOn = DateTime::Parse($dbRow['published_on']);
    }
}

?>