<?php declare(strict_types=1);

namespace Pages;

use App\Enums\UserPermission;
use App\Services\BlogPostService;
use App\Services\SessionService;
use App\Utils\Component;

$sessionService = SessionService::getInstance();
$blogPostService = BlogPostService::getInstance();

$result = $blogPostService->getPublicBlogPosts($page);

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