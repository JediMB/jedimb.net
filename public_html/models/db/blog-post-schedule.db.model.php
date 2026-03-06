<?php declare(strict_types=1);

namespace Models\DB;

require_once 'models/base/db-base.model.php';

use Models\Base\DBBase;
use Utilities\DateTime;

class BlogPostSchedule extends DBBase {
    public int $blogPostId;
    public \DateTime $publishOn;

    public function __construct(array $dbRow) {
        parent::__construct($dbRow);

        $this->blogPostId = $dbRow['blog_post_id'];
        $this->publishOn = DateTime::parse($dbRow['publish_on']);
    }
}

?>
