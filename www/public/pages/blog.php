<?php declare(strict_types=1);

namespace Pages;

use App\Enums\UserPermission;
use App\Models\App\Page;
use App\Services\BlogPostService;
use App\Services\SessionService;
use App\Utils\Component;

/** @var Page $page */

$sessionService = SessionService::getInstance();
$blogPostService = BlogPostService::getInstance();

$result = $blogPostService->getPublicBlogPosts($page->pageNumber);

$posts = $result['blogPosts'];
$pagination = $result['pagination'];

$editPermissions = $sessionService->hasPermissions([ UserPermission::Editing ]);

?>

<?php if ($sessionService->hasPermissions([ UserPermission::Publishing ])): ?>
    <?php Component::include('blog/blog-head') ?>
<?php endif ?>

<?php Component::include('blog/blog-view', [
    'posts' => $posts,
    'pagination' => $pagination,
    'editPermissions' => $editPermissions
]) ?>