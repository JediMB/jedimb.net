<?php declare(strict_types=1);

namespace Pages\Blog;

use Exception;
use Enums\UserPermission;
use Services\BlogPostService;
use Services\SessionService;
use Utils\Component;

/** @var int|null $page */

if (!isset($page))
    throw new Exception('Page number data ($page) unset in Blog Edit page');

SessionService::getInstance()->enforcePermissions([ UserPermission::Editing ]);

?>

<h2>Edit post</h2>

<?php if (!$page): ?>
    <div>No post specified.</div>
    <?php return ?>
<?php endif ?>

<?php $post = BlogPostService::getInstance()->getBlogPost($page) ?>

<?php if ($post): ?>
    <?php Component::include('blog/blog-editor', [ 'post' => $post ]) ?>
<?php else: ?>
    <div>Blog post (id: <?= $page ?>) not found.</div>
<?php endif ?>