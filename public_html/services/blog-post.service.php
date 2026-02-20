<?php declare(strict_types=1);

namespace Services;

require_once 'services/table-modified.service.php';
require_once 'services/base/singleton.php';
require_once 'services/db/blog-post.db.service.php';

use Enums\PublishedStatus;
use Models\DB\BlogPost;
use Models\DTO\BlogPost as BlogPostDTO;
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
