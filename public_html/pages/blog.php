<?php declare(strict_types=1);

namespace Pages;

require_once 'services/blog-post.service.php';
require_once 'utilities/component.utility.php';

use Enums\UserPermission;
use Services\BlogPostService;
use Services\SessionService;
use Utilities\Component;

$sessionService = SessionService::getInstance();
$blogPostService = BlogPostService::getInstance();

$page ??= 1;
$result = $blogPostService->getPublishedBlogPosts($page);

$pagination = $result['pagination'];
$posts = $result['posts'];

?>

<?php if ($sessionService->hasPermissions([ UserPermission::Publishing ])): ?>
    <?php Component::include('blog-head') ?>
<?php endif ?>

<!--
    TODO:
    Implement pagination
-->

<div text-right>
    Showing posts <?= $pagination->offset + 1 ?>&ndash;<?= $pagination->offset + count($posts) ?> (of <?= $pagination->itemCount ?>)
</div>
<blog-posts>
    <?php foreach ($posts as $post): ?>
        <article class="flex flex-col">
            <h2><a href="/<?= PATH_BLOG_PREFIX . $post->permalink ?>"><?= $post->title ?></a></h2>
            <article-byline>
                <?php Component::include('created-modified-dates', [
                    'createdOn' => $post->publishedOn,
                    'modifiedOn' => $post->modifiedOn
                ]) ?>
            </article-byline>
            <article-content><?= $post->contentShort ?></article-content>
        </article>
    <?php endforeach ?>
</blog-posts>
<nav>
    <!-- TODO: Accessibility-friendly descriptions of navigation items -->
    <ul class="nav-pagination">
        <li>
            <a href="<?= $baseRoute ?>/1"
                title="First page"
                >
                <svg width="1em" height="1em">
                    <use xlink:href="#svg-left-double" href="#svg-left-double"></use>
                </svg>
            </a>
        </li>
        <li>
            <a href="<?= $baseRoute ?>/<?= max(1, $pagination->page - 1) ?>"
                title="Previous page"
                >
                <svg width="1em" height="1em">
                    <use xlink:href="#svg-left" href="#svg-left"></use>
                </svg>
            </a>
        </li>
        <li>
            1
        </li>
        <li>
            <a href="<?= $baseRoute ?>/<?= min($pagination->pageCount, $pagination->page + 1) ?>"
                title="Next page"
                >
                <svg width="1em" height="1em">
                    <use xlink:href="#svg-right" href="#svg-right"></use>
                </svg>
            </a>
        </li>
        <li>
            <a href="<?= $baseRoute ?>/<?= $pagination->pageCount ?>"
                title="Last page"
                >
                <svg width="1em" height="1em">
                    <use xlink:href="#svg-right-double" href="#svg-right-double"></use>
                </svg>
            </a>
        </li>
    </ul>
</nav>

<template blog-post-template>
    <article class="flex flex-col">
        <h2><a href="/<?= PATH_BLOG_PREFIX ?>">Title</a></h2>
        <article-byline>
            <?php Component::include('created-modified-dates', [
                'createdOn' => new \DateTime(),
                'modifiedOn' => new \DateTime()
            ]) ?>
        </article-byline>
        <article-content>Content</article-content>
    </article>
</template>

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