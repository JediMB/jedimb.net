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

<ul>
    <?php foreach ($posts as $post): ?>
        <li style="display: block grid; grid-template-columns: 1fr auto auto auto; gap: var(--size-s); margin-block: var(--size-m);">
            <div>
                <div>
                    <a style="display: inline flex; flex-direction: row; gap: 0.75ch; align-items: center;"
                        href="/blog/edit/<?= $post->id ?>"
                        class="link-svg"
                        title="Edit post"
                        >
                        <?= $post->title ?>
                        <svg width="1em" height="1em">
                            <use xlink:href="#svg-edit" href="#svg-edit"></use>
                        </svg>
                    </a>
                </div>
                <div><?= $post->description ?></div>
            </div>
            <div>
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
            </div>
            <div>
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
            </div>
            <div>
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
            </div>
        </li>
    <?php endforeach  ?>
</ul>