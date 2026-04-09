<?php declare(strict_types=1);

namespace Services;

require_once 'models/pagination.model.php';
require_once 'models/db/blog-post-schedule.db.model.php';
require_once 'services/blog-post-schedule.service.php';
require_once 'services/configuration.service.php';
require_once 'services/table-modified.service.php';
require_once 'services/base/singleton.php';
require_once 'services/db/blog-post.db.service.php';

use Exception;
use Enums\PublishedStatus;
use Enums\Visibility;
use Models\Pagination;
use Models\DB\BlogPost;
use Models\DB\BlogPostSchedule;
use Models\DTO\BlogPost as BlogPostDTO;
use Services\BlogPostScheduleService;
use Services\ConfigurationService;
use Services\TableModifiedService;
use Services\Base\Singleton;
use Services\DB\BlogPostDBService;

class BlogPostService extends Singleton {
    private BlogPostDBService $blogPostDbService;
    private BlogPostScheduleService $blogPostScheduleService;
    private ConfigurationService $configurationService;
    private TableModifiedService $tableModifiedService;

    protected function __construct() {
        $this->blogPostDbService = BlogPostDBService::getInstance();
        $this->blogPostScheduleService = BlogPostScheduleService::getInstance();
        $this->configurationService = ConfigurationService::getInstance();
        $this->tableModifiedService = TableModifiedService::getInstance();
    }

    function createDraft(BlogPostDTO $draftDTO, int $userId) : BlogPost {
        return $this->blogPostDbService->createBlogPost($draftDTO, $userId, false);
    }

    function getBlogPost(int $id) : BlogPost|false {
        return $this->blogPostDbService->getBlogPost($id, PublishedStatus::Any);
    }

    /** @return (array{'blogPosts': BlogPost[], 'pagination': Pagination}) */
    private function getBlogPosts(int $page, ?int $pageSize, PublishedStatus $publishedStatus, Visibility $visibility) : array {
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
            'blogPosts' => $this->blogPostDbService->getBlogPosts($pageSize, $offset, $publishedStatus, $visibility),
            'pagination' => new Pagination($page, $pageSize, $offset, $postCount, $pageCount)
        ];
    }

    function getCount(PublishedStatus $publishedStatus = PublishedStatus::Published) : int {
        return $this->blogPostDbService->getCount($publishedStatus);
    }

    /** @return (array{'blogPosts': BlogPost[], 'pagination': Pagination}) */
    function getPublicBlogPosts(int $page = 1, ?int $pageSize = null) : array {
        return $this->getBlogPosts($page,$pageSize, PublishedStatus::Published, Visibility::Visible);
    }

    function getPublicBlogPost(int|string $identifier) : BlogPost|false {
        return $this->blogPostDbService->getBlogPost($identifier, PublishedStatus::Published, Visibility::Visible);
    }

    /** @return (array{'blogPost': BlogPost, 'modifiedOn': \DateTime}) */
    function publishBlogPost(BlogPostDTO $blogPostDTO, int $userId) : array {
        $post = $this->blogPostDbService->createBlogPost($blogPostDTO, $userId, true);
        $modifiedOn = $this->tableModifiedService->createOrUpdateTableModifiedDate('blog_post');

        return [
            'blogPost' => $post,
            'modifiedOn' => $modifiedOn
        ];
    }

    function publishDraft(int $draftId) : BlogPost|false {
        return $this->blogPostDbService->publishDraft($draftId);
    }

    function scheduleBlogPost(BlogPostDTO $blogPostDTO, int $userId) : BlogPostSchedule {
        $post = $this->blogPostDbService->createBlogPost($blogPostDTO, $userId, false);

        if (!$post)
            throw new Exception('Failed to create new scheduled blog post');

        $modifiedOn = $this->tableModifiedService->createOrUpdateTableModifiedDate('blog_post');

        $schedule = $this->blogPostScheduleService->createBlogPostSchedule($post->id, $blogPostDTO->scheduledOn);

        if (!$schedule)
            throw new Exception('Failed to schedule newly created blog post');

        return $schedule;
    }

    function updateBlogPost(BlogPostDTO $blogPostDTO) : BlogPost {
        $dbPost = $this->getBlogPost($blogPostDTO->id);

        if (!$dbPost || !$dbPost->publishedOn)
            throw new Exception('Existing blog post not found');

        BlogPostDTO::update($dbPost, $blogPostDTO);

        return $this->blogPostDbService->updateBlogPost($dbPost, true);
    }

    function updateAndPublishDraft(BlogPostDTO $draftDTO, int $userId) : BlogPost|false {
        $updatedDraft = $this->updateDraft($draftDTO, $userId);

        if (!$updatedDraft)
            throw new Exception("Failed to update existing draft with id {$draftDTO->id}");

        return $this->publishDraft($updatedDraft->id);
    }

    function updateAndScheduleDraft(BlogPostDTO $draftDTO, int $userId) : BlogPostSchedule|false {
        $updatedDraft = $this->updateDraft($draftDTO, $userId);

        if (!$updatedDraft)
            throw new Exception("Failed to update existing draft with id {$draftDTO->id}");

        return $this->blogPostScheduleService->createBlogPostSchedule($updatedDraft->id, $draftDTO->scheduledOn);
    }

    function updateDraft(BlogPostDTO $draftDTO, int $userId) : BlogPost|false {
        $dbPost = $this->getBlogPost($draftDTO->id);

        if (!$dbPost || $dbPost->publishedOn)
            throw new Exception("Existing draft with id {$draftDTO->id} not found");
        
        BlogPostDTO::update($dbPost, $draftDTO, $userId);

        return $this->blogPostDbService->updateBlogPost($dbPost, false);
    }
}

?>
