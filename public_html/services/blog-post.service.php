<?php declare(strict_types=1);

namespace Services;

require_once 'services/table-modified.service.php';
require_once 'services/base/singleton.php';
require_once 'services/db/blog-post.db.service.php';

use Enums\PublishedStatus;
use Models\DB\BlogPost;
use Services\TableModifiedService;
use Services\Base\Singleton;
use Services\DB\BlogPostDBService;

class BlogPostService extends Singleton {
    private BlogPostDBService $blogPostDbService;
    private TableModifiedService $tableModifiedService;

    protected function __construct() {
        $this->blogPostDbService = BlogPostDBService::getInstance();
        $this->tableModifiedService = TableModifiedService::getInstance();
    }

    function getBlogPost(int $id) : BlogPost|false {
        return $this->blogPostDbService->getBlogPost($id, PublishedStatus::Any);
    }

    /** @return BlogPost[] */
    function getPublishedBlogPosts() : array {
        return $this->blogPostDbService->getBlogPosts(PublishedStatus::Published);
    }

    function getPublishedBlogPost(int|string $identifier) : BlogPost|false {
        return $this->blogPostDbService->getBlogPost($identifier, PublishedStatus::Published);
    }
}

?>
