<?php declare(strict_types=1);

namespace Services;

require_once 'services/base/singleton.php';

use Database\BlogPostScheduleDbService;
use Models\DB\BlogPostSchedule;
use Services\Base\Singleton;

class BlogPostScheduleService extends Singleton {
    private BlogPostScheduleDbService $blogPostScheduleDbService;

    protected function __construct() {
        $this->blogPostScheduleDbService = BlogPostScheduleDbService::getInstance();
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

    public function updateBlogPostSchedule(int $id, string $publishOn) : BlogPostSchedule|false {
        return $this->blogPostScheduleDbService->updateBlogPostSchedule($id, $publishOn);
    }

    /** @return BlogPostSchedule[] */
    public function publishPendingScheduledBlogPosts() : array {
        return $this->blogPostScheduleDbService->publishPendingScheduledBlogPost();
    }
}

?>
