<?php declare(strict_types=1);

namespace Services;
require_once 'services/table-modified.service.php';
require_once 'services/base/singleton.php';
require_once 'services/db/blog-post-schedule.db.service.php';

use Models\DB\BlogPostSchedule;
use Services\TableModifiedService;
use Services\Base\Singleton;
use Services\DB\BlogPostScheduleDBService;

class BlogPostScheduleService extends Singleton {
    private BlogPostScheduleDBService $blogPostScheduleDbService;

    protected function __construct() {
        $this->blogPostScheduleDbService = BlogPostScheduleDBService::getInstance();
    }

    public function createBlogPostSchedule(int $blogPostId, string $publishOn) : BlogPostSchedule|false {
        return $this->blogPostScheduleDbService->createBlogPostSchedule($blogPostId, $publishOn);
    }

    public function getBlogPostSchedule(int $blogPostId) : BlogPostSchedule|false {
        return $this->blogPostScheduleDbService->getBlogPostSchedule($blogPostId);
    }

    /** @return BlogPostSchedule[] */
    public function getBlogPostSchedules() : array {
        return $this->blogPostScheduleDbService->getBlogPostSchedules();
    }

    /** @return BlogPostSchedule[] */
    public function publishPendingScheduledBlogPosts() : array {
        return $this->blogPostScheduleDbService->publishPendingScheduledBlogPost();
    }
}

?>
