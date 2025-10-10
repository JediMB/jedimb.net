<?php declare(strict_types=1);

namespace Services\DB;

require_once 'enums/published-status.enum.php';
require_once 'models/db/blog-post.db.model.php';
require_once 'services/base/singleton.php';
require_once 'services/db/database.service.php';

use PDO;
use PDOException;
use Enums\DBFetch;
use Enums\PublishedStatus;
use Exception;
use Models\DB\BlogPost;
use Services\Base\Singleton;

class BlogPostDBService extends Singleton {
    private DatabaseService $dbService;

    protected function __construct() {
        $this->dbService = DatabaseService::getInstance();
    }

    // TODO: expand functionality to cover 'unpublished' and 'any'
    public function getBlogPosts(PublishedStatus $publishedStatus = PublishedStatus::Published) {
        try {
            $posts = $this->dbService->selectView('blog_posts_published', DBFetch::All);

            return array_map(function($post) {
                return new BlogPost($post);
            }, $posts);
        }
        catch (PDOException $e) {
            throw new Exception('Database error: ' . $e->getMessage());
        }
    }

    public function getBlogPost(string $permalink): BlogPost|false {
        try {
            $post = DatabaseService::getInstance()->selectFunction(
                'read_blog_post', [
                    1 => [ 'value' => $permalink, 'type' => PDO::PARAM_STR ]
                ]
            );

            if ($post)
                return new BlogPost($post);
        }
        catch (PDOException $e) {
            throw new Exception('Database error: ' . $e->getMessage());
        }

        return false;
    }
}

?>