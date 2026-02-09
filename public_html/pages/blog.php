<?php declare(strict_types=1);

namespace Pages;

require_once 'utilities/component.utility.php';

use Enums\UserPermission;
use Services\SessionService;
use Utilities\Component;


$sessionService = SessionService::getInstance(); /** @var SessionService $sessionService */

?>

<?php if ($sessionService->hasPermissions([ UserPermission::Publishing ])): ?>
    <?php Component::include('blog-head') ?>
<?php endif ?>

<!-- TODO: Implement pagination and include the first page as part of the document -->
<template blog-post-template>
    <article class="flex flex-col">
        <h2><a href="/blog/{id}">Title</a></h2>
        <article-byline>
            <date-created>6h ago</date-created>
            <date-modified class="weak">last modified 4h ago</date-modified>
        </article-byline>
        <article-content>Content</article-content>
    </article>
</template>

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