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
/** @var bool $editPermissions */

if (!isset($posts) || !is_array($posts))
    throw new Exception('BlogPost array data ($posts) not provided for BlogView component');
if (!isset($pagination) || get_class($pagination) !== Pagination::class)
    throw new Exception('Pagination data ($pagination) not provided for BlogView component');
$editPermissions ??= false;

Component::addAttributes([
    'base-route' => CURRENT_PAGE_ROUTE,
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
        <article data-id="<?= $post->id ?>" <?= $post->isPinned ? ' class="article-pinned"' : null ?>>
            <article-header>
                <h2>
                    <a href="/<?= PATH_BLOG_PREFIX . $post->permalink ?>"
                        class="title"
                        >
                        <?= $post->title ?>
                    </a>
                </h2>
                <article-byline>
                    <svg width="1em" height="1em" class="article-pinned-icon">
                        <title>Pinned</title>
                        <use xlink:href="#svg-pinned" href="#svg-pinned"></use>
                    </svg>
                    <svg width="1em" height="1em" class="article-hidden-icon">
                        <title>Hidden</title>
                        <use xlink:href="#svg-hidden" href="#svg-hidden"></use>
                    </svg>
                    <?php Component::include('created-modified-dates', [
                        'createdOn' => $post->publishedOn,
                        'modifiedOn' => $post->modifiedOn
                    ]) ?>
                </article-byline>
                <article-toolbar
                    <?= !$editPermissions ? 'hidden' : null ?>
                    >
                    <button post-action="delete"
                        data-id="<?= $post->id ?>"
                        data-prompt="Permanently delete this post?"
                        class="link-svg"
                        title="Delete post"
                        >
                        <svg width="1.5em" height="1.5em">
                            <use xlink:href="#svg-delete" href="#svg-delete"></use>
                        </svg>
                    </button>
                    <a post-edit
                        href="/blog/edit/<?= $post->id ?>"
                        class="link-svg"
                        title="Edit post"
                        >
                        <svg width="1.5em" height="1.5em">
                            <use xlink:href="#svg-edit" href="#svg-edit"></use>
                        </svg>
                    </a>
                    <button post-action="hide"
                        data-id="<?= $post->id ?>"
                        class="link-svg"
                        title="Hide post"
                        >
                        <svg width="1.5em" height="1.5em">
                            <use xlink:href="#svg-visible" href="#svg-visible" class="unhovered"></use>
                            <use xlink:href="#svg-hidden" href="#svg-hidden" class="hovered"></use>
                        </svg>
                    </button>
                    <button post-action="pin"
                        data-id="<?= $post->id ?>"
                        class="link-svg action-pin"
                        title="Pin post"
                        >
                        <svg width="1.5em" height="1.5em">
                            <use xlink:href="#svg-unpinned" href="#svg-unpinned"class="unhovered"></use>
                            <use xlink:href="#svg-pinned" href="#svg-pinned" class="hovered"></use>
                        </svg>
                    </button>
                    <button post-action="unpin"
                        data-id="<?= $post->id ?>"
                        class="link-svg action-unpin"
                        title="Unpin post"
                        >
                        <svg width="1.5em" height="1.5em">
                            <use xlink:href="#svg-pinned" href="#svg-pinned" class="unhovered"></use>
                            <use xlink:href="#svg-unpinned" href="#svg-unpinned" class="hovered"></use>
                        </svg>
                    </button>
                </article-toolbar>
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
                    <svg width="1em" height="1em" class="article-pinned-icon">
                        <title>Pinned</title>
                        <use xlink:href="#svg-pinned" href="#svg-pinned"></use>
                    </svg>
                <?php Component::include('created-modified-dates', [
                    'createdOn' => new \DateTime(),
                    'modifiedOn' => new \DateTime()
                ]) ?>
            </article-byline>
            <article-toolbar hidden>
                <button post-action="delete"
                    data-prompt="Permanently delete this post?"
                    class="link-svg"
                    title="Delete post"
                    >
                    <svg width="1.5em" height="1.5em">
                        <use xlink:href="#svg-delete" href="#svg-delete"></use>
                    </svg>
                </button>
                <a post-edit
                    href="/blog/edit/"
                    class="link-svg"
                    title="Edit post"
                    >
                    <svg width="1.5em" height="1.5em">
                        <use xlink:href="#svg-edit" href="#svg-edit"></use>
                    </svg>
                </a>
                <button post-action="hide"
                    class="link-svg"
                    title="Hide post"
                    >
                    <svg width="1.5em" height="1.5em">
                        <use xlink:href="#svg-visible" href="#svg-visible" class="unhovered"></use>
                        <use xlink:href="#svg-hidden" href="#svg-hidden" class="hovered"></use>
                    </svg>
                </button>
                <button post-action="pin"
                    class="link-svg action-pin"
                    title="Pin post"
                    >
                    <svg width="1.5em" height="1.5em">
                        <use xlink:href="#svg-unpinned" href="#svg-unpinned"class="unhovered"></use>
                        <use xlink:href="#svg-pinned" href="#svg-pinned" class="hovered"></use>
                    </svg>
                </button>
                <button post-action="unpin"
                    class="link-svg action-unpin"
                    title="Unpin post"
                    >
                    <svg width="1.5em" height="1.5em">
                        <use xlink:href="#svg-pinned" href="#svg-pinned" class="unhovered"></use>
                        <use xlink:href="#svg-unpinned" href="#svg-unpinned" class="hovered"></use>
                    </svg>
                </button>
            </article-toolbar>
        </article-header>
        <article-content class="content">
            Content
        </article-content>
    </article>
</template>

<?php Component::include('pagination', [
    'attributes' => [ 'id' => 'blog__pagination' ],
    'data' => $pagination
]) ?>