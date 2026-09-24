<?php declare(strict_types=1);

namespace Models\DB;

use Abstract\DbPageContent;
use Utils\DateTime;

class BlogPost extends DbPageContent {
    public string $permalink;
    public ?string $mastolink;
    public bool $isPinned;
    public ?\DateTime $publishedOn;

    public function __construct(array $dbRow) {
        parent::__construct($dbRow);

        $this->permalink = $dbRow['permalink'];
        $this->mastolink = $dbRow['mastolink'] ?? null;
        $this->isPinned = $dbRow['is_pinned'];
        $this->publishedOn = DateTime::parse($dbRow['published_on']);
    }
}