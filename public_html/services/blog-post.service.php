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
use Enums\Content;
use Enums\Published;
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

    public function createDraft(BlogPostDTO $draftDTO, int $userId) : BlogPost {
        return $this->blogPostDbService->createBlogPost($draftDTO, $userId, false);
    }

    public function deleteBlogPost(int $id) : BlogPost|false {
        return $this->blogPostDbService->deleteBlogPost($id);
    }

    public function getBlogPost(int $id) : BlogPost|false {
        return $this->blogPostDbService->getBlogPost($id, Published::Any);
    }

    /** @return (array{'blogPosts': BlogPost[], 'pagination': Pagination}) */
    private function getBlogPosts(int $page, ?int $pageSize, Published $published, Visibility $visibility, Content $content) : array {
        if ($page < 1) $page = 1;

        $pageSize ??= $this->configurationService->getUserConstant('PAGINATION_PAGE_SIZE');

        if ($pageSize < 1) $pageSize = 1;

        $postCount = $this->getCount($published, $visibility);
        $pageCount = (int)ceil($postCount / $pageSize);

        $offset = ($page - 1) * $pageSize;
        
        if ($offset > 0 && $offset >= $postCount) {
            $page = $pageCount;
            $offset = ($page - 1) * $pageSize;
        }

        return [
            'blogPosts' => $this->blogPostDbService->getBlogPosts($pageSize, $offset, $published, $visibility, $content),
            'pagination' => new Pagination($page, $pageSize, $offset, $postCount, $pageCount)
        ];
    }

    /** @return (array{'blogPosts': BlogPost[], 'pagination': Pagination}) */
    public function getBlogPostsAdminData(int $page, ?int $pageSize = null, Published $published = Published::Any, Visibility $visibility = Visibility::Any) : array {
        return $this->getBlogPosts($page, $pageSize, $published, $visibility, Content::None);
    }

    public function getCount(Published $published = Published::Published, Visibility $visibility = Visibility::Visible) : int {
        return $this->blogPostDbService->getCount($published, $visibility);
    }

    /** @return (array{'blogPosts': BlogPost[], 'pagination': Pagination}) */
    public function getPublicBlogPosts(int $page = 1, ?int $pageSize = null) : array {
        $result = $this->getBlogPosts($page, $pageSize, Published::Published, Visibility::Visible, Content::Short);

        $blogPosts = $result['blogPosts'];

        $text = TEXT_BLOG_POST_READ_MORE;
        foreach ($blogPosts as $blogPost) {
            $link = '/' . PATH_BLOG_PREFIX . $blogPost->permalink;
            $html = <<<HTML
                <div>
                    <a href="$link#page-break">$text</a>
                </div>
                HTML;
            $blogPost->contentShort = preg_replace(REGEX_PHP['pagebreak-tag'], $html, $blogPost->contentShort, 1);
        }

        return $result;
    }

    public function getPublicBlogPost(int|string $identifier) : BlogPost|false {
        $blogPost = $this->blogPostDbService->getBlogPost($identifier, Published::Published, Visibility::Visible);

        if (!$blogPost)
            return false;

        $blogPost->contentShort = preg_replace(REGEX_PHP['pagebreak-tag'], '<div id="page-break"></div>', $blogPost->contentShort, 1);

        return $blogPost;
    }

    /** @return (array{'blogPost': BlogPost, 'modifiedOn': \DateTime}) */
    public function publishBlogPost(BlogPostDTO $blogPostDTO, int $userId) : array {
        $post = $this->blogPostDbService->createBlogPost($blogPostDTO, $userId, true);
        $modifiedOn = $this->tableModifiedService->createOrUpdateTableModifiedDate('blog_post');

        return [
            'blogPost' => $post,
            'modifiedOn' => $modifiedOn
        ];
    }

    public function publishDraft(int $draftId) : BlogPost|false {
        return $this->blogPostDbService->publishDraft($draftId);
    }

    public function scheduleBlogPost(BlogPostDTO $blogPostDTO, int $userId) : BlogPostSchedule {
        $post = $this->blogPostDbService->createBlogPost($blogPostDTO, $userId, false);

        if (!$post)
            throw new Exception('Failed to create new scheduled blog post');

        $modifiedOn = $this->tableModifiedService->createOrUpdateTableModifiedDate('blog_post');

        $schedule = $this->blogPostScheduleService->createBlogPostSchedule($post->id, $blogPostDTO->scheduledOn);

        if (!$schedule)
            throw new Exception('Failed to schedule newly created blog post');

        return $schedule;
    }

    public function toggleHidden(int $id, bool $status) : bool {
        return $this->blogPostDbService->toggleHidden($id, $status);
    }

    public function togglePinned(int $id, bool $status) : bool {
        return $this->blogPostDbService->togglePinned($id, $status);
    }

    public function updateBlogPost(BlogPostDTO $blogPostDTO) : BlogPost|false {
        $dbPost = $this->getBlogPost($blogPostDTO->id);

        if (!$dbPost || !$dbPost->publishedOn)
            throw new Exception('Existing blog post not found');

        BlogPostDTO::update($dbPost, $blogPostDTO);

        return $this->blogPostDbService->updateBlogPost($dbPost);
    }

    public function updateAndPublishDraft(BlogPostDTO $draftDTO, int $userId) : BlogPost|false {
        $updatedDraft = $this->updateDraft($draftDTO, $userId);

        if (!$updatedDraft)
            throw new Exception("Failed to update existing draft with id {$draftDTO->id}");

        return $this->publishDraft($updatedDraft->id);
    }

    public function updateAndScheduleDraft(BlogPostDTO $draftDTO, int $userId) : BlogPostSchedule|false {
        $updatedDraft = $this->updateDraft($draftDTO, $userId);

        if (!$updatedDraft)
            throw new Exception("Failed to update existing draft with id {$draftDTO->id}");

        $existingSchedule = $this->blogPostScheduleService->getBlogPostSchedule($draftDTO->id);

        if ($existingSchedule)
            return $this->blogPostScheduleService->updateBlogPostSchedule($existingSchedule->id, $draftDTO->scheduledOn);

        return $this->blogPostScheduleService->createBlogPostSchedule($updatedDraft->id, $draftDTO->scheduledOn);
    }

    public function updateDraft(BlogPostDTO $draftDTO, int $userId) : BlogPost|false {
        $dbPost = $this->getBlogPost($draftDTO->id);

        if (!$dbPost || $dbPost->publishedOn)
            throw new Exception("Existing draft with id {$draftDTO->id} not found");
        
        BlogPostDTO::update($dbPost, $draftDTO, $userId);

        return $this->blogPostDbService->updateBlogPost($dbPost);
    }
}

?>
