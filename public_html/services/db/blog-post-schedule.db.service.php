<?php declare(strict_types=1);

namespace Services\DB;

require_once 'services/base/base.db.service.php';

use Exception;
use PDO;
use PDOException;
use Enums\DBFetch;
use Models\DB\BlogPostSchedule;
use Services\Base\BaseDBService;

class BlogPostScheduleDbService extends BaseDBService {
    protected function __construct() {
        parent::__construct();
        $this->table = 'blog_post_schedule';
    }

    public function createBlogPostSchedule(int $blogPostId, string $publishOn) : BlogPostSchedule|false {
        try {
            $blogPostSchedule = $this->dbService->selectFunction('create_blog_post_schedule', [
                1 => [ 'value' => $blogPostId, 'type' => PDO::PARAM_INT],
                2 => [ 'value' => $publishOn, 'type' => PDO::PARAM_STR]
            ]);

            if (!$blogPostSchedule)
                return false;

            return new BlogPostSchedule($blogPostSchedule);
        }
        catch (PDOException $e) {
            throw new Exception('Database error: ' . $e->getMessage());
        }
    }

    public function updateBlogPostSchedule(int $id, string $publishOn) : BlogPostSchedule|false {
        try {
            $blogPostSchedule = $this->dbService->selectFunction('update_blog_post_schedule', [
                1 => [ 'value' => $id, 'type' => PDO::PARAM_INT ],
                2 => [ 'value' => $publishOn, 'type' => PDO::PARAM_STR ]
            ]);

            if (!$blogPostSchedule)
                return false;

            return new BlogPostSchedule($blogPostSchedule);
        }
        catch (PDOException $e) {
            throw new Exception('Database error: ' . $e->getMessage());
        }
    }

    public function getBlogPostSchedule(int $blogPostId) : BlogPostSchedule|false {
        try {
            $blogPostSchedule = $this->dbService->selectByColumnValues($this->table, [
                'blog_post_id' => $blogPostId
            ]);

            if (!$blogPostSchedule)
                return false;

            return new BlogPostSchedule($blogPostSchedule);
        }
        catch (PDOException $e) {
            throw new Exception('Database error: ' . $e->getMessage());
        }
    }

    /** @return BlogPostSchedule[] */
    public function getBlogPostSchedules() : array {
        try {
            $blogPostSchedules = $this->dbService->selectView($this->table);

            return array_map(
                fn($schedule) => new BlogPostSchedule($schedule),
                $blogPostSchedules
            );

        }
        catch (PDOException $e) {
            throw new Exception('Database error: ' . $e->getMessage());
        }
    }

    /** @return BlogPostSchedule[] */
    public function publishPendingScheduledBlogPost() : array {
        try {
            $blogPostSchedules = $this->dbService->selectFunction('publish_pending_scheduled_posts', amount: DBFetch::All);

            if (!$blogPostSchedules)
                return [];

            return array_map(
                fn($schedule) => new BlogPostSchedule($schedule),
                $blogPostSchedules
            );
        }
        catch (PDOException $e) {
            throw new Exception('Database error: ' . $e->getMessage());
        }
    }
}

?>
