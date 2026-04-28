<?php declare(strict_types=1);

namespace Components\Admin;

require_once 'services/blog-post.service.php';
require_once 'utilities/component.utility.php';

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