<?php declare(strict_types=1);

namespace Pages\Blog;

require_once 'services/blog-post.service.php';
require_once 'services/session.service.php';
require_once 'utilities/component.utility.php';

use Exception;
use Enums\UserPermission;
use Services\BlogPostService;
use Services\SessionService;
use Utilities\Component;

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

<?php if (!$post): ?>
    <div>Blog post (id: <?= $page ?>) not found.</div>
    <?php return; ?>
<?php endif ?>

<?php Component::include('blog/blog-editor', [
    'formId' => 'blog__edit__form',
    'post' => $post
]) ?>
