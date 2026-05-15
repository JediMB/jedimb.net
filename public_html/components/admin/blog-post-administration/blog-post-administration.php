<?php declare(strict_types=1);

namespace Components\Admin;

require_once 'enums/published.enum.php';
require_once 'services/blog-post.service.php';
require_once 'utilities/component.utility.php';

use Enums\Published;
use Enums\Visibility;
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

<div class="admin__blog-post__status-row">
    <form id="admin__blog-post__status-form">
        <label>
            Published status:
            <select name="published">
                <option value="<?= Published::Any->value ?>">Either</option>
                <option value="<?= Published::Published->value ?>">Published</option>
                <option value="<?= Published::Unpublished->value ?>">Unpublished</option>
            </select>
        </label>
        <label>
            Visibility:
            <select name="visibility">
                <option value="<?= Visibility::Any->value ?>">Either</option>
                <option value="<?= Visibility::Visible->value ?>">Visible</option>
                <option value="<?= Visibility::Hidden->value ?>">Hidden</option>
            </select>
        </label>
    </form>

    <div>
        Showing posts
        <span id="admin__blog-post__items-start"><?= $pagination->offset + 1 ?></span>&ndash;<span id="admin__blog-post__items-end"><?= $pagination->offset + count($posts) ?></span>
        (of <span id="admin__blog-post__items-total"><?= $pagination->itemCount ?></span>)
    </div>
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