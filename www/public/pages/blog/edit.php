<?php declare(strict_types=1);

namespace Pages\Blog;

use Exception;
use App\Enums\UserPermission;
use App\Models\App\Page;
use App\Services\BlogPostService;
use App\Services\SessionService;
use App\Utils\Component;

/** @var Page $page */

SessionService::getInstance()->enforcePermissions([ UserPermission::Editing ]);

?>

<h2>Edit post</h2>

<?php if (!$page->pageNumber): ?>
    <div>No post specified.</div>
    <?php return ?>
<?php endif ?>

<?php $post = BlogPostService::getInstance()->getBlogPost($page->pageNumber) ?>

<?php if ($post): ?>
    <?php Component::include('blog/blog-editor', [ 'post' => $post ]) ?>
<?php else: ?>
    <div>Blog post (id: <?= $page->pageNumber ?>) not found.</div>
<?php endif ?>