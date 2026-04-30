<?php declare(strict_types=1);

namespace Services\DB;

require_once 'enums/content.enum.php';
require_once 'enums/published.enum.php';
require_once 'enums/visibility.enum.php';
require_once 'models/db/blog-post.db.model.php';
require_once 'models/dto/blog-post.dto.model.php';
require_once 'services/base/base.db.service.php';

use PDO;
use PDOException;
use Enums\Content;
use Enums\Published;
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
                    6 => [ 'value' => $blogPostDTO->contentRest, 'type' => PDO::PARAM_STR ],
                    7 => [ 'value' => $blogPostDTO->isPinned, 'type' => PDO::PARAM_BOOL ]
                ]
            );

            return new BlogPost($result);
        }
        catch (PDOException $e) {
            throw new Exception('Database error: ' . $e->getMessage());
        }
    }

    public function deleteBlogPost(int $id) : BlogPost|false {
        try {
            $post = $this->dbService->deleteById('blog_post', $id);

            if (!$post)
                return false;

            return new BlogPost($post);
        }
        catch (PDOException $e) {
            throw new Exception('Database error: ' . $e->getMessage());
        }
    }

    /**
     * @param int|string $identifier Blog post id (integer) or permalink (string)
     * @param Published $published 
     * @return BlogPost|false
     */
    public function getBlogPost(int|string $identifier, Published $published = Published::Published, Visibility $visibility = Visibility::Visible): BlogPost|false {
        try {
            $columnValues = [];
            $nullChecks = [];

            if (is_int($identifier))
                $columnValues['id'] = $identifier;
            else
                $columnValues['permalink'] = $identifier;

            if ($visibility !== Visibility::Any)
                $columnValues['is_hidden'] = $visibility === Visibility::Hidden;

            if ($published !== Published::Any)
                $nullChecks['published_on'] = $published === Published::Unpublished;

            $post = $this->dbService->selectByColumnValues('blog_post', $columnValues, $nullChecks);

            if (!$post)
                return false;

            return new BlogPost($post);
        }
        catch (PDOException $e) {
            throw new Exception('Database error: ' . $e->getMessage());
        }
    }

    /** @return BlogPost[] */
    public function getBlogPosts(int $limit, int $offset, Published $published = Published::Published, Visibility $visibility = Visibility::Visible, Content $content = Content::Short) : array {
        try {
            switch ($content) {
                case Content::All:
                    $view = 'blog_posts';
                    break;

                case Content::Short:
                    $view = 'blog_posts__content_short';
                    break;

                case Content::None:
                    $view = 'blog_posts__content_none';
                    break;
            }

            $columnValues = [];
            $nullChecks = [];

            if ($visibility !== Visibility::Any)
                $columnValues['is_hidden'] = $visibility === Visibility::Hidden;

            if ($published !== Published::Any)
                $nullChecks['published_on'] = $published === Published::Unpublished;

            $posts = $this->dbService->selectView($view, $columnValues, $nullChecks, limit: $limit, offset: $offset);
            
            return array_map(function($post) {
                return new BlogPost($post);
            }, $posts);
        }
        catch (PDOException $e) {
            throw new Exception('Database error: ' . $e->getMessage());
        }
    }

    public function getCount(Published $published = Published::Published, Visibility $visibility = Visibility::Visible) : int {
        try {
            $columnValues = [];
            $nullChecks = [];

            if ($columnValues !== Visibility::Any)
                $columnValues['is_hidden'] = $visibility === Visibility::Hidden;

            if ($published !== Published::Any)
                $nullChecks['published_on'] = $published === Published::Unpublished;

            return $this->dbService->selectCount('blog_post', $columnValues, $nullChecks);
        }
        catch (PDOException $e) {
            throw new Exception('Database error: ' . $e->getMessage());
        }
    }

    public function publishDraft(int $draftId) : BlogPost|false {
        try {
            $result = $this->dbService->selectFunction('publish_blog_post_draft', [
                1 => [ 'value' => $draftId, 'type' => PDO::PARAM_INT ]
            ]);

            if (!$result)
                return false;

            return new BlogPost($result);
        }
        catch (PDOException $e) {
            throw new Exception('Database error: ' . $e->getMessage());
        }
    }

    public function toggleHidden(int $id, bool $status) : bool {
        try {
            $result = $this->dbService->selectFunction('update_blog_post__is_hidden', [
                1 => [ 'value' => $id, 'type' => PDO::PARAM_INT ],
                2 => [ 'value' => $status, 'type' => PDO::PARAM_BOOL ]
            ])[0];

            if (!is_int($result))
                throw new Exception('Database error: unexpected return type!');

            if ($result > 1)
                throw new Exception('Warning: more than one post affected!');

            return !!$result;

        }
        catch (PDOException $e) {
            throw new Exception('Database error: ' . $e->getMessage());
        }
    }

    public function togglePinned(int $id, bool $status) : bool {
        try {
            $result = $this->dbService->selectFunction('update_blog_post__is_pinned', [
                1 => [ 'value' => $id, 'type' => PDO::PARAM_INT ],
                2 => [ 'value' => $status, 'type' => PDO::PARAM_BOOL ]
            ])[0];

            if (!is_int($result))
                throw new Exception("Database error: unexpected return type!");

            if ($result > 1)
                throw new Exception('Warning: more than one post affected!');

            return !!$result;

        }
        catch (PDOException $e) {
            throw new Exception('Database error: ' . $e->getMessage());
        }
    }

    public function updateBlogPost(BlogPost $updatedBlogPost) : BlogPost|false {
        try {
            $result = $this->dbService->selectFunction(
                'update_blog_post', [
                    1 => [ 'value' => $updatedBlogPost->id, 'type' => PDO::PARAM_INT ],
                    2 => [ 'value' => $updatedBlogPost->userId, 'type' => PDO::PARAM_INT ],
                    3 => [ 'value' => $updatedBlogPost->permalink, 'type' => PDO::PARAM_STR ],
                    4 => [ 'value' => $updatedBlogPost->title, 'type' => PDO::PARAM_STR ],
                    5 => [ 'value' => $updatedBlogPost->description, 'type' => PDO::PARAM_STR ],
                    6 => [ 'value' => $updatedBlogPost->contentShort, 'type' => PDO::PARAM_STR ],
                    7 => [ 'value' => $updatedBlogPost->contentRest, 'type' => PDO::PARAM_STR ],
                    8 => [ 'value' => $updatedBlogPost->mastolink, 'type' => PDO::PARAM_STR ],
                    9 => [ 'value' => $updatedBlogPost->isHidden, 'type' => PDO::PARAM_BOOL ],
                    10 => [ 'value' => $updatedBlogPost->isPinned, 'type' => PDO::PARAM_BOOL]
                ]
            );

            if (!$result)
                return false;

            return new BlogPost($result);
        }
        catch (PDOException $e) {
            throw new Exception('Database error: ' . $e->getMessage());
        }
    }
}

?>