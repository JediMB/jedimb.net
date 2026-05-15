<?php declare(strict_types=1);

namespace Components\Admin;

require_once 'utilities/component.utility.php';

use Exception;
use Models\DB\BlogPost;
use Utilities\Component;

/** @var bool $template */
/** @var BlogPost $post */

$template ??= false;

if ($template)
    $post = null;
else if (empty($post) || get_class($post) !== BlogPost::class)
    throw new Exception('Blog Post data ($post) not provided for non-template Admin/Blog-Post component');

Component::noContainer();

?>

<li class="admin__blog-post">
    <div>
        <div>
            <a class="admin__blog-post__link"
                href="/blog/edit/<?= $post?->id ?>"
                class="link-svg"
                title="Edit post"
                >
                <?= $post?->title ?>
                <svg width="1em" height="1em">
                    <use xlink:href="#svg-edit" href="#svg-edit"></use>
                </svg>
            </a>
        </div>
        <div class="admin__blog-post__description">
            <?= $post?->description ?>
        </div>
    </div>
    <div>
        <button post-action="hide"
            data-id="<?= $post?->id ?>"
            class="link-svg"
            title="Hide post"
            >
            <svg width="1.5em" height="1.5em">
                <use xlink:href="#svg-visible" href="#svg-visible" class="unhovered"></use>
                <use xlink:href="#svg-hidden" href="#svg-hidden" class="hovered"></use>
            </svg>
        </button>
    </div>
    <div>
        <button post-action="pin"
            data-id="<?= $post?->id ?>"
            class="link-svg"
            title="Pin post"
            >
            <svg width="1.5em" height="1.5em">
                <use xlink:href="#svg-unpinned" href="#svg-unpinned" class="unhovered"></use>
                <use xlink:href="#svg-pinned" href="#svg-pinned" class="hovered"></use>
            </svg>
        </button>
    </div>
    <div>
        <button post-action="delete"
            data-id="<?= $post?->id ?>"
            data-prompt="Permanently delete this post?"
            class="link-svg"
            title="Delete post"
            >
            <svg width="1.5em" height="1.5em">
                <use xlink:href="#svg-delete" href="#svg-delete"></use>
            </svg>
        </button>
    </div>
</li>