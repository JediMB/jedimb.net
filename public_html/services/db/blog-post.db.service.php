<?php declare(strict_types=1);

namespace Services\DB;

require_once 'enums/published-status.enum.php';
require_once 'models/db/blog-post.db.model.php';
require_once 'services/base/base.db.service.php';

use PDO;
use PDOException;
use Enums\PublishedStatus;
use Exception;
use Models\DB\BlogPost;
use Services\Base\BaseDBService;

class BlogPostDBService extends BaseDBService {
    protected function __construct() {
        parent::__construct();
    }

    // TODO: expand functionality to cover 'unpublished' and 'any'
    /** @return BlogPost[] */
    public function getBlogPosts(PublishedStatus $publishedStatus = PublishedStatus::Published) : array {
        try {
            $posts = $this->dbService->selectView('blog_posts_published_short', 'published_on');
            
            return array_map(function($post) {
                return new BlogPost($post);
            }, $posts);
        }
        catch (PDOException $e) {
            throw new Exception('Database error: ' . $e->getMessage());
        }
    }

    /**
     * @param int|string $identifier Blog post id (integer) or permalink (string)
     * @param PublishedStatus $publishedStatus 
     * @return BlogPost|false
     */
    public function getBlogPost(int|string $identifier, PublishedStatus $publishedStatus = PublishedStatus::Published): BlogPost|false {
        try {
            if (is_int($identifier))
                $columnValues = [ 'id' => $identifier ];
            else
                $columnValues = [ 'permalink' => $identifier ];

            if ($publishedStatus === PublishedStatus::Published)
                $nullChecks = [ 'published_on' => false ];
            else if ($publishedStatus === PublishedStatus::Unpublished)
                $nullChecks = [ 'is_published' => true ];
            else
                $nullChecks = [];

            $post = $this->dbService->selectByColumnValues('blog_post', $columnValues, $nullChecks);

            if (!$post)
                return false;

            return new BlogPost($post);
        }
        catch (PDOException $e) {
            throw new Exception('Database error: ' . $e->getMessage());
        }
    }
}

?>