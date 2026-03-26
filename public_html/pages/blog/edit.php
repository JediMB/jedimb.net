<?php declare(strict_types=1);

namespace Pages\Blog;

require_once 'services/blog-post.service.php';

use Models\DB\BlogPost;
use Services\BlogPostService;

/** @var int|null $page */

?>

<h2>Edit post</h2>

<?php if (!$page): ?>
    <div>No post specified.</div>
    <?php return ?>
<?php endif ?>

<?php $post = BlogPostService::getInstance()->getBlogPost($page) ?>

<?php if (!$post): ?>
    <div>Blog post (id: <?= $page ?>) not found.</div>
    <?php return ?>
<?php endif ?>

<div>
    Editing blog post titled <i>"<?= $post->title ?>"</i>
</div>