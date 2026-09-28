<?php declare(strict_types=1);

namespace App\Models\DB;

use App\Abstract\DbBase;
use App\Utils\DateTime;

class BlogPostSchedule extends DbBase {
    public int $blogPostId;
    public \DateTime $publishOn;

    public function __construct(array $dbRow) {
        parent::__construct($dbRow);

        $this->blogPostId = $dbRow['blog_post_id'];
        $this->publishOn = DateTime::parse($dbRow['publish_on']);
    }
}
