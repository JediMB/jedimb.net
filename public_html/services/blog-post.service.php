<?php declare(strict_types=1);

namespace Services;

require_once 'models/pagination.model.php';
require_once 'services/configuration.service.php';
require_once 'services/table-modified.service.php';
require_once 'services/base/singleton.php';
require_once 'services/db/blog-post.db.service.php';

use Enums\PublishedStatus;
use Models\Pagination;
use Models\DB\BlogPost;
use Models\DTO\BlogPost as BlogPostDTO;
use Services\ConfigurationService;
use Services\TableModifiedService;
use Services\Base\Singleton;
use Services\DB\BlogPostDBService;

class BlogPostService extends Singleton {
    private BlogPostDBService $blogPostDbService;
    private ConfigurationService $configurationService;
    private TableModifiedService $tableModifiedService;

    protected function __construct() {
        $this->blogPostDbService = BlogPostDBService::getInstance();
        $this->configurationService = ConfigurationService::getInstance();
        $this->tableModifiedService = TableModifiedService::getInstance();
    }

    function getBlogPost(int $id) : BlogPost|false {
        return $this->blogPostDbService->getBlogPost($id, PublishedStatus::Any);
    }

    /** @return (array{'pagination': Pagination, 'posts': BlogPost[]}) */
    private function getBlogPosts(int $page, ?int $pageSize, PublishedStatus $publishedStatus) : array {
        if ($page < 1) $page = 1;

        $pageSize ??= $this->configurationService->getUserConstant('PAGINATION_PAGE_SIZE');

        if ($pageSize < 1) $pageSize = 1;

        $postCount = $this->getCount($publishedStatus);
        $pageCount = (int)ceil($postCount / $pageSize);

        $offset = ($page - 1) * $pageSize;
        
        if ($offset > 0 && $offset >= $postCount) {
            $page = $pageCount;
            $offset = ($page - 1) * $pageSize;
        }

        return [
            'pagination' => new Pagination($page, $pageSize, $offset, $postCount, $pageCount),
            'posts' => $this->blogPostDbService->getBlogPosts($pageSize, $offset, $publishedStatus)
        ];
    }

    function getCount(PublishedStatus $publishedStatus = PublishedStatus::Published) : int {
        return $this->blogPostDbService->getCount($publishedStatus);
    }

    /** @return (array{'pagination': Pagination, 'posts': BlogPost[]}) */
    function getPublishedBlogPosts(int $page = 1, ?int $pageSize = null) : array {
        return $this->getBlogPosts($page,$pageSize, PublishedStatus::Published);        
    }

    function getPublishedBlogPost(int|string $identifier) : BlogPost|false {
        return $this->blogPostDbService->getBlogPost($identifier, PublishedStatus::Published);
    }

    /** @return (array{'blogPost': BlogPost, 'modifiedOn': \DateTime}) */
    function publishBlogPost(BlogPostDTO $blogPostDTO) : array {
        $post = $this->blogPostDbService->createBlogPost($blogPostDTO, 1, true);
        $modifiedOn = $this->tableModifiedService->createOrUpdateTableModifiedDate('blog_post');

        return [
            'blogPost' => $post,
            'modifiedOn' => $modifiedOn
        ];
    }

    /** @return (array{'blogPost': BlogPost, 'modifiedOn': \DateTime}) */
    function scheduleBlogPost(BlogPostDTO $blogPostDTO) : array {
        $post = $this->blogPostDbService->createBlogPost($blogPostDTO, 1, false);
        $modifiedOn = $this->tableModifiedService->createOrUpdateTableModifiedDate('blog_post');
        // TODO: Call the create_blog_post_schedule DB function with the $post id

        return [
            'blogPost' => $post,
            'modifiedOn' => $modifiedOn
        ];
    }
}

?>
