<?php declare(strict_types=1);

use App\Components\Blog\BlogPostShortComponent;
use App\Components\ContentTimestampsComponent;
use App\Utils\CSSRenderer;

/** @var BlogPostShortComponent $data */
/** @var string $baseClass */
/** @var string $baseId */

$post = $data->post;

?>

<blog-post-short-component data-id="<?= $post?->id ?>">
    <article class="<?= "{$baseClass}__article" ?> <?= $post?->isPinned ? 'post-pinned' : null ?>">
        <article-header class="<?= "{$baseClass}__article-header" ?>">
            <h2>
                <a post-title
                    href="/<?= PATH_BLOG_PREFIX . $post?->permalink ?>"
                    >
                    <?= $post?->title ?>
                </a>
            </h2>
            <article-byline class="flex-row">
                <svg width="1em" height="1em" icon-pinned>
                    <title>Pinned</title>
                    <use xlink:href="#svg-pinned" href="#svg-pinned"></use>
                </svg>
                <svg width="1em" height="1em" icon-hidden>
                    <title>Hidden</title>
                    <use xlink:href="#svg-hidden" href="#svg-hidden"></use>
                </svg>
                <?php if ($post): ?>
                    <?= new ContentTimestampsComponent($post->publishedOn, $post->modifiedOn) ?>
                <?php else: ?>
                    <?= new ContentTimestampsComponent(date_create(), date_create()) ?>
                <?php endif ?>
            </article-byline>
            <article-toolbar
                class="<?= "{$baseClass}__toolbar" ?>"
                <?= !$data->hasEditPermissions ? 'hidden' : null ?>
                >
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
                    href="/blog/edit/<?= $post?->id ?>"
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
        <article-content class="<?= "{$baseClass}__content" ?>">
            <?= $post?->contentShort ?>
        </article-content>
    </article>
</blog-post-short-component>

<?php CSSRenderer::add($baseClass, <<<CSS
    blog-post-short-component {
        display: block;
        width: 100%;
    }

    .{$baseClass}__article {
        display: block flex;
        flex-direction: column;
        gap: var(--size-m);

        & [icon-hidden],
        & [icon-pinned] {
            display: none;
        }

        &.post-pinned .action-pin,
        &:not(.post-pinned) .action-unpin {
            display: none;
        }

        &.post-hidden [icon-hidden],
        &.post-pinned [icon-pinned] {
            display: inline;
        }

        & article:not(:hover, :focus-within) article-toolbar {
            display: none;
        }
    }

    .{$baseClass}__article-header {
        display: block;
        position: relative;
        padding-right: var(--size-l);
    }

    .{$baseClass}__toolbar {
        position: absolute;
        top: 0;
        right: 0;
        margin-block: var(--size-m);
        display: block flex;
        flex-direction: row;
        gap: var(--size-xs);
    }

    .{$baseClass}__content {
        &>:first-child {
            margin-block-start: 0;
        }

        &>:last-child {
            margin-block-end: 0;
        }
    }
CSS) ?>
