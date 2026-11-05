<?php declare(strict_types=1);

use App\Components\Admin\BlogPostComponent;
use App\Utils\CSSRenderer;
use App\Utils\DateTime;

/** @var BlogPostComponent $data */
/** @var string $baseClass */
/** @var string $baseId */

$post = $data->post;

?>

<blog-post-component data-id="<?= $post?->id ?>" class="display-contents">
    <published-status>
        <?php if (!$post?->publishedOn): ?>
            <button post-action="publish"
                data-prompt="Publish this post?"
                class="link-svg"
                title="Publish post"
                >
                <svg is-loading width="1.5em" height="1.5em">
                    <use xlink:href="#svg-loading" href="#svg-loading"></use>
                </svg>
                <svg has-loaded width="1.5em" height="1.5em">
                    <use xlink:href="#svg-publish" href="#svg-publish"></use>
                </svg>
            </button>
        <?php endif ?>
        <?php if (!$post || $post->publishedOn): ?>
            <svg width="1.5em" height="1.5em">
                <title>Published on <?= DateTime::toString($post?->publishedOn) ?></title>
                <use xlink:href="#svg-check" href="#svg-check"></use>
            </svg>
        <?php endif ?>
    </published-status>

    <text-data>
            <div>
                <a href="/blog/edit/<?= $post?->id ?>"
                    class="<?= "{$baseClass}__link link-svg" ?>"
                    title="Edit post"
                    >
                    <?= $post?->title ?>
                    <svg width="1em" height="1em">
                        <use xlink:href="#svg-edit" href="#svg-edit"></use>
                    </svg>
                </a>
            </div>
            <div class="<?= "{$baseClass}__description" ?>">
                <?= $post?->description ?>
            </div>
    </text-data>

    <toggle-buttons class="<?= "{$baseClass}__buttons" ?>">
        <?php if (!$post?->isHidden): ?>
            <div>
                <button post-action="hide"
                    class="link-svg"
                    title="Hide post"
                    >
                    <svg is-loading width="1.5em" height="1.5em">
                        <use xlink:href="#svg-loading" href="#svg-loading"></use>
                    </svg>
                    <svg has-loaded width="1.5em" height="1.5em">
                        <use xlink:href="#svg-visible" href="#svg-visible" class="unhovered"></use>
                        <use xlink:href="#svg-hidden" href="#svg-hidden" class="hovered"></use>
                    </svg>
                </button>
            </div>
        <?php endif ?>
        <?php if (!$post || $post->isHidden): ?>
            <div>
                <button post-action="unhide"
                    class="link-svg active"
                    title="Unhide post"
                    >
                    <svg is-loading width="1.5em" height="1.5em">
                        <use xlink:href="#svg-loading" href="#svg-loading"></use>
                    </svg>
                    <svg has-loaded width="1.5em" height="1.5em">
                        <use xlink:href="#svg-hidden" href="#svg-hidden" class="unhovered"></use>
                        <use xlink:href="#svg-visible" href="#svg-visible" class="hovered"></use>
                    </svg>
                </button>
            </div>
        <?php endif ?>
        <?php if (!$post?->isPinned): ?>
            <div>
                <button post-action="pin"
                    class="link-svg"
                    title="Pin post"
                    >
                    <svg is-loading width="1.5em" height="1.5em">
                        <use xlink:href="#svg-loading" href="#svg-loading"></use>
                    </svg>
                    <svg has-loaded width="1.5em" height="1.5em">
                        <use xlink:href="#svg-unpinned" href="#svg-unpinned" class="unhovered"></use>
                        <use xlink:href="#svg-pinned" href="#svg-pinned" class="hovered"></use>
                    </svg>
                </button>
            </div>
        <?php endif ?>
        <?php if (!$post || $post->isPinned): ?>
            <div>
                <button post-action="unpin"
                    class="link-svg active"
                    title="Unpin post"
                    >
                    <svg is-loading width="1.5em" height="1.5em">
                        <use xlink:href="#svg-loading" href="#svg-loading"></use>
                    </svg>
                    <svg has-loaded width="1.5em" height="1.5em">
                        <use xlink:href="#svg-pinned" href="#svg-pinned" class="unhovered"></use>
                        <use xlink:href="#svg-unpinned" href="#svg-unpinned" class="hovered"></use>
                    </svg>
                </button>
            </div>
        <?php endif ?>
        <div>
            <button post-action="delete"
                data-prompt="Permanently delete this post?"
                class="link-svg"
                title="Delete post"
                >
                <svg is-loading width="1.5em" height="1.5em">
                    <use xlink:href="#svg-loading" href="#svg-loading"></use>
                </svg>
                <svg has-loaded width="1.5em" height="1.5em">
                    <use xlink:href="#svg-delete" href="#svg-delete"></use>
                </svg>
            </button>
        </div>
    </toggle-buttons>
</blog-post-component>

<?php CSSRenderer::add($baseClass, <<<CSS
    .{$baseClass}__link {
        display: inline flex;
        flex-direction: row;
        gap: 0.75ch;
        align-items: center;
    }

    .{$baseClass}__buttons {
        display: inline flex;
        flex-direction: row;
        gap: var(--size-s);
    }
CSS) ?>