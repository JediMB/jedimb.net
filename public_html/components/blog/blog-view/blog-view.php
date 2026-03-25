<?php declare(strict_types=1);

namespace Components\Blog;

require_once 'models/pagination.model.php';
require_once 'models/db/blog-post.db.model.php';
require_once 'utilities/component.utility.php';

use Exception;
use Models\Pagination;
use Models\DB\BlogPost;
use Utilities\Component;

/** @var Pagination $pagination */
/** @var BlogPost[] $posts */
/** @var string $baseRoute */
/** @var bool $editPermissions */

if (!isset($posts) || !is_array($posts))
    throw new Exception('BlogPost array data ($posts) not provided for BlogView component');
if (!isset($pagination) || get_class($pagination) !== Pagination::class)
    throw new Exception('Pagination data ($pagination) not provided for BlogView component');
if (!isset($baseRoute) || !is_string($baseRoute))
    throw new Exception('Base path string data ($basePath) not provided for BlogView component');
$editPermissions ??= false;

Component::addAttributes([
    'base-route' => $baseRoute,
    'data-pagination' => $pagination
]);

Component::renderCSS();
Component::addJSModule();
Component::renderOnce();

?>

<div text-right>
    Showing posts
    <span id="blog__items-start"><?= $pagination->offset + 1 ?></span>&ndash;<span id="blog__items-end"><?= $pagination->offset + count($posts) ?></span>
    (of <span id="blog__items-total"><?= $pagination->itemCount ?></span>)
</div>
<blog-posts>
    <?php foreach ($posts as $key => $post): ?>
        <article>
            <article-header>
                <h2>
                    <a href="/<?= PATH_BLOG_PREFIX . $post->permalink ?>"
                        class="title"
                        >
                        <?= $post->title ?>
                    </a>
                </h2>
                <article-byline>
                    <?php Component::include('created-modified-dates', [
                        'createdOn' => $post->publishedOn,
                        'modifiedOn' => $post->modifiedOn
                    ]) ?>
                </article-byline>
                <?php if ($editPermissions): ?>
                    <article-toolbar>
                        <a href="/blog/edit/<?= $post->id ?>"
                            class="btn-hover-light"
                            title="Edit post"
                            >
                            <svg width="1.5em" height="1.5em">
                                <use xlink:href="#svg-edit" href="#svg-edit"></use>
                            </svg>
                        </a>
                    </article-toolbar>
                <?php endif ?>
            </article-header>
            <article-content class="content">
                <?= $post->contentShort ?>
            </article-content>
        </article>
    <?php endforeach ?>
</blog-posts>

<template blog-post-template>
    <article>
        <article-header>
            <h2>
                <a href="/<?= PATH_BLOG_PREFIX ?>"
                    class="title"
                    >
                    Title
                </a>
            </h2>
            <article-byline>
                <?php Component::include('created-modified-dates', [
                    'createdOn' => new \DateTime(),
                    'modifiedOn' => new \DateTime()
                ]) ?>
            </article-byline>
        </article-header>
        <article-content class="content">
            Content
        </article-content>
    </article>
</template>

<?php

$currentPage = $pagination->page;
$totalPages = $pagination->pageCount;
$pageNumbers = [ $currentPage => $currentPage ];
$pageCount = 1;
$pageSteps = 1;

while ($pageCount < 5 && $pageSteps < 5) {
    $prev = max($currentPage - $pageSteps, 1);
    $pageNumbers[$prev] = $prev;

    $next = min($currentPage + $pageSteps, $totalPages);
    $pageNumbers[$next] = $next;

    if ( ($newCount = count($pageNumbers)) === $pageCount )
        break;

    $pageCount = $newCount;
    $pageSteps++;
}

ksort($pageNumbers);

$nextPage = min($totalPages, $currentPage + 1);

?>

<nav id="blog__pagination">
    <ul class="nav-pagination">
        <li>
            <a href="<?= $baseRoute ?>/1"
                onclick="return false;"
                id="blog__pagination-first"
                title="First page"
                target-page="1"
                <?= $currentPage < 3 ? 'disabled' : null ?>
                >
                <svg width="1em" height="1em">
                    <use xlink:href="#svg-first" href="#svg-first"></use>
                </svg>
            </a>
        </li>
        <li>
            <a href="<?= $baseRoute ?>/<?= max(1, $currentPage - 1) ?>"
                onclick="return false;"
                id="blog__pagination-previous"
                title="Previous page"
                target-page="<?= max(1, $currentPage - 1) ?>"
                <?= $currentPage === 1 ? 'disabled' : null ?>
                >
                <svg width="1em" height="1em">
                    <use xlink:href="#svg-left" href="#svg-left"></use>
                </svg>
            </a>
        </li>
        <li>
            <ul id="blog__pagination-pages" class="nav-pagination">
                <?php foreach ($pageNumbers as $pageNumber): ?>
                    <li>
                        <a href="<?= $baseRoute ?>/<?= $pageNumber ?>"
                            onclick="return false;"
                            title="Page <?= $pageNumber ?>"
                            target-page="<?= $pageNumber ?>"
                            <?= $pageNumber === $currentPage ? 'class="active"' : null ?>
                            >
                            <?= $pageNumber ?>
                        </a>
                    </li>
                <?php endforeach ?>
            </ul>
        </li>
        <li>
            <a href="<?= $baseRoute ?>/<?= $nextPage ?>"
                onclick="return false;"
                id="blog__pagination-next"
                title="Next page"
                target-page="<?= $nextPage ?>"
                <?= $currentPage === $totalPages ? 'disabled' : null ?>
                >
                <svg width="1em" height="1em">
                    <use xlink:href="#svg-right" href="#svg-right"></use>
                </svg>
            </a>
        </li>
        <li>
            <a href="<?= $baseRoute ?>/<?= $totalPages ?>"
                onclick="return false;"
                id="blog__pagination-last"
                title="Last page"
                target-page="<?= $totalPages ?>"
                <?= $currentPage > $totalPages - 2 ? 'disabled' : null ?>
                >
                <svg width="1em" height="1em">
                    <use xlink:href="#svg-last" href="#svg-last"></use>
                </svg>
            </a>
        </li>
    </ul>
</nav>