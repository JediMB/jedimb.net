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



<div text-right>
    Showing posts
    <span id="blog__pagination-start"><?= $pagination->offset + 1 ?></span>&ndash;<span id="blog__pagination-end"><?= $pagination->offset + count($posts) ?></span>
    (of <span id="blog__pagination-total"><?= $pagination->itemCount ?></span>)
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
    <ul class="nav-pagination">
        <li>
            <a href="<?= $baseRoute ?>/1"
                id="blog__pagination-first"
                title="First page"
                >
                <svg width="1em" height="1em">
                    <use xlink:href="#svg-left-double" href="#svg-left-double"></use>
                </svg>
            </a>
        </li>
        <li>
            <a href="<?= $baseRoute ?>/<?= max(1, $pagination->page - 1) ?>"
                id="blog__pagination-previous"
                title="Previous page"
                >
                <svg width="1em" height="1em">
                    <use xlink:href="#svg-left" href="#svg-left"></use>
                </svg>
            </a>
        </li>
        <li>
            <?php
            $currentPage = $pagination->page;
            $totalPages = $pagination->pageCount;
            $paginationPages = [ $currentPage => $currentPage ];
            $pageCount = 1;
            $pageSteps = 1;

            while ($pageCount < 5 && $pageSteps < 5) {
                $prev = max($currentPage - $pageSteps, 1);
                $paginationPages[$prev] = $prev;

                $next = min($currentPage + $pageSteps, $totalPages);
                $paginationPages[$next] = $next;

                if ( ($newCount = count($paginationPages)) === $pageCount )
                    break;

                $pageCount = $newCount;
                $pageSteps++;
            }

            ksort($paginationPages);
            ?>
            <ul id="blog__pagination-pages" class="nav-pagination">
                <?php foreach ($paginationPages as $pageNumber): ?>
                    <?php if ($pageNumber === $currentPage): ?>
                        <li><strong><?= $pageNumber ?></strong></li>
                    <?php else: ?>
                        <li>
                            <a href="<?= $baseRoute ?>/<?= $pageNumber ?>"
                                title="Page <?= $pageNumber ?>"
                                >
                                <?= $pageNumber ?>
                            </a>
                        </li>
                    <?php endif ?>
                <?php endforeach ?>
            </ul>
        </li>
        <li>
            <a href="<?= $baseRoute ?>/<?= min($pagination->pageCount, $pagination->page + 1) ?>"
                id="blog__pagination-next"
                title="Next page"
                >
                <svg width="1em" height="1em">
                    <use xlink:href="#svg-right" href="#svg-right"></use>
                </svg>
            </a>
        </li>
        <li>
            <a href="<?= $baseRoute ?>/<?= $pagination->pageCount ?>"
                id="blog__pagination-last"
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