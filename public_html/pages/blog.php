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

$posts = $result['posts'];
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

<!--
<script type="module">
    import blogPostApiService from "/js/services/api/blog-post-api.service.js";

    const output = document.querySelector('main');
    const template = output.querySelector('[blog-post-template]');

    const response = await blogPostApiService.getBlogPosts();

    if (response.success)
        renderBlogPosts(response.value);
    else
        renderErrors(response.errors);

    
    function renderBlogPosts(data) {
        if (!data || data.length < 1) {
            renderErrors(['No blog posts found']);
            return;
        }

        data.forEach(post => {
            const cloneNode = template.content.cloneNode(true);
            cloneNode.querySelector('article > h2').innerHTML = `<a href="/blog${post.permalink}">` + post.title + '</a>';
            const byline = cloneNode.querySelector('article-byline');
            byline.querySelector('date-created').textContent = post.createdOn.toLocaleString();
            
            if (post.modifiedOn)
                byline.querySelector('date-modified').innerHTML = '&ndash; Last modified ' + post.modifiedOn.toLocaleString();
            else
                byline.querySelector('date-modified').remove();

            cloneNode.querySelector('article-content').innerHTML = post.contentShort;

            output.appendChild(cloneNode);
        });
    }

    function renderErrors(errors) {
        errors?.forEach(error => {
            const errorNode = document.createElement('div');
            errorNode.classList.add('error');
            errorNode.textContent = error;

            output.appendChild(errorNode);
        });
    }
</script>
-->