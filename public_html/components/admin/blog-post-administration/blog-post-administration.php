<?php declare(strict_types=1);

namespace Components\Admin;

require_once 'enums/blog-post-status.enum.php';
require_once 'services/blog-post.service.php';
require_once 'utilities/component.utility.php';

use Enums\BlogPostStatus;
use Services\BlogPostService;
use Utilities\Component;

$blogPostService = BlogPostService::getInstance();
$data = $blogPostService->getBlogPostsAdminData(1, 10);
$posts = $data['blogPosts'];
$pagination = $data['pagination'];

Component::renderOnce();
Component::renderCSS();
Component::addJSModule();

?>

<h3 class="h3">Posts</h3>

<section>
    <h4>Published status:</h4>
    <label>
        <input type="checkbox"
            name="published-status"
            value="<?= BlogPostStatus::Published->value ?>">
        Published
    </label>
    <label>
        <input type="checkbox"
            name="published-status"
            value="<?= BlogPostStatus::Unpublished->value ?>">
        Unpublished
    </label>
</section>

<section>
    <h4>Visibility:</h4>
    <label>
        <input type="checkbox"
            name="visibility"
            value="<?= BlogPostStatus::Visible->value ?>">
        Published
    </label>
    <label>
        <input type="checkbox"
            name="visibility"
            value="<?= BlogPostStatus::Hidden->value ?>">
        Unpublished
    </label>
</section>

<div text-right>
    Showing posts
    <span id="blog__items-start"><?= $pagination->offset + 1 ?></span>&ndash;<span id="blog__items-end"><?= $pagination->offset + count($posts) ?></span>
    (of <span id="blog__items-total"><?= $pagination->itemCount ?></span>)
</div>

<ul id="admin__blog-post__list">
    <?php foreach ($posts as $post): ?>
        <?php Component::include('admin/blog-post', [ 'post' => $post ]) ?>
    <?php endforeach  ?>
</ul>

<template id="admin__blog-post__template">
    <?php Component::include('admin/blog-post', [ 'template' => true ]) ?>
</template>

<?php Component::include('pagination', [
    'attributes' => [ 'id' => 'admin__blog-post__pagination'],
    'data' => $pagination
]);