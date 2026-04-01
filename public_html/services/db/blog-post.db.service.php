<?php declare(strict_types=1);

namespace Services\DB;

require_once 'enums/published-status.enum.php';
require_once 'enums/visibility.enum.php';
require_once 'models/db/blog-post.db.model.php';
require_once 'models/dto/blog-post.dto.model.php';
require_once 'services/base/base.db.service.php';

use PDO;
use PDOException;
use Enums\PublishedStatus;
use Enums\Visibility;
use Exception;
use Models\DB\BlogPost;
use Models\DTO\BlogPost as BlogPostDTO;
use Services\Base\BaseDBService;

class BlogPostDBService extends BaseDBService {
    protected function __construct() {
        parent::__construct();
    }

    public function createBlogPost(BlogPostDTO $blogPostDTO, int $userId, bool $publish) : BlogPost {
        try {
            $functionName = $publish
                ? 'create_published_blog_post'
                : 'create_unpublished_blog_post';

            $result = $this->dbService->selectFunction(
                $functionName, [
                    1 => [ 'value' => $userId, 'type' => PDO::PARAM_INT ],
                    2 => [ 'value' => $blogPostDTO->permalink, 'type' => PDO::PARAM_STR ],
                    3 => [ 'value' => $blogPostDTO->title, 'type' => PDO::PARAM_STR ],
                    4 => [ 'value' => $blogPostDTO->description, 'type' => PDO::PARAM_STR ],
                    5 => [ 'value' => $blogPostDTO->contentShort, 'type' => PDO::PARAM_STR ],
                    6 => [ 'value' => $blogPostDTO->contentRest, 'type' => PDO::PARAM_STR ]
                ]
            );

            return new BlogPost($result);
        }
        catch (PDOException $e) {
            throw new Exception('Database error: ' . $e->getMessage());
        }
    }

    public function updateBlogPost(BlogPost $updatedBlogPost, bool $isPublished) : BlogPost {
        try {
            $functionName = $isPublished
                ? 'update_published_blog_post'
                : 'update_unpublished_blog_post';

            $result = $this->dbService->selectFunction(
                $functionName, [
                    1 => [ 'value' => $updatedBlogPost->id, 'type' => PDO::PARAM_INT ],
                    2 => [ 'value' => $updatedBlogPost->userId, 'type' => PDO::PARAM_INT ],
                    3 => [ 'value' => $updatedBlogPost->permalink, 'type' => PDO::PARAM_STR ],
                    4 => [ 'value' => $updatedBlogPost->title, 'type' => PDO::PARAM_STR ],
                    5 => [ 'value' => $updatedBlogPost->description, 'type' => PDO::PARAM_STR ],
                    6 => [ 'value' => $updatedBlogPost->contentShort, 'type' => PDO::PARAM_STR ],
                    7 => [ 'value' => $updatedBlogPost->contentRest, 'type' => PDO::PARAM_STR ],
                    8 => [ 'value' => $updatedBlogPost->isHidden, 'type' => PDO::PARAM_BOOL ],
                    9 => [ 'value' => $updatedBlogPost->isPinned, 'type' => PDO::PARAM_BOOL]
                ]
            );

            return new BlogPost($result);
        }
        catch (PDOException $e) {
            throw new Exception('Database error: ' . $e->getMessage());
        }
    }

    /** @return BlogPost[] */
    public function getBlogPosts(int $limit, int $offset, PublishedStatus $publishedStatus = PublishedStatus::Published, Visibility $visibility = Visibility::Visible) : array {
        try {
            $columnValues = [];
            $nullChecks = [];

            if ($visibility !== Visibility::Any)
                $columnValues = [ 'is_hidden' => $visibility === Visibility::Hidden ];

            if ($publishedStatus !== PublishedStatus::Any)
                $nullChecks = [ 'published_on' => $publishedStatus === PublishedStatus::Unpublished ];

            $posts = $this->dbService->selectView('blog_posts_short', $columnValues, $nullChecks, limit: $limit, offset: $offset);
            
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
    public function getBlogPost(int|string $identifier, PublishedStatus $publishedStatus = PublishedStatus::Published, Visibility $visibility = Visibility::Visible): BlogPost|false {
        try {
            if (is_int($identifier))
                $columnValues = [ 'id' => $identifier ];
            else
                $columnValues = [ 'permalink' => $identifier ];

            if ($visibility !== Visibility::Any)
                $columnValues += [ 'is_hidden' => $visibility === Visibility::Hidden ];

            if ($publishedStatus === PublishedStatus::Any)
                $nullChecks = [];
            else
                $nullChecks = [ 'published_on' => $publishedStatus === PublishedStatus::Unpublished ];

            $post = $this->dbService->selectByColumnValues('blog_post', $columnValues, $nullChecks);

            if (!$post)
                return false;

            return new BlogPost($post);
        }
        catch (PDOException $e) {
            throw new Exception('Database error: ' . $e->getMessage());
        }
    }

    public function getCount(PublishedStatus $publishedStatus = PublishedStatus::Published) : int {
        try {
            if ($publishedStatus === PublishedStatus::Published)
                $nullChecks = [ 'published_on' => false];
            else if ($publishedStatus === PublishedStatus::Unpublished)
                $nullChecks = [ 'is_published' => true ];
            else
                $nullChecks = [];

            return $this->dbService->selectCount('blog_post', [], $nullChecks);
        }
        catch (PDOException $e) {
            throw new Exception('Database error: ' . $e->getMessage());
        }
    }
}

?>