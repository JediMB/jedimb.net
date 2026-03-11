<?php declare(strict_types=1);

namespace Pages;

require_once 'services/blog-post.service.php';
require_once 'utilities/component.utility.php';

use Enums\UserPermission;
use Services\BlogPostService;
use Services\SessionService;
use Utilities\Component;

/** @var string $baseRoute */

$sessionService = SessionService::getInstance();
$blogPostService = BlogPostService::getInstance();

$page ??= 1;
$result = $blogPostService->getPublishedBlogPosts($page);

$posts = $result['blogPosts'];
$pagination = $result['pagination'];

?>

<?php if ($sessionService->hasPermissions([ UserPermission::Publishing ])): ?>
    <?php Component::include('blog-head') ?>
<?php endif ?>

<?php Component::include('blog-view', [
    'posts' => $posts,
    'pagination' => $pagination,
    'baseRoute' => $baseRoute
]) ?>