<?php declare(strict_types=1);

use App\Components\Blog\BlogPostShortComponent;
use App\Components\Blog\BlogViewComponent;
use App\Components\PageSelectorComponent;
use App\Components\PageStatsComponent;
use App\Utils\CSSRenderer;

/** @var BlogViewComponent $data */
/** @var string $baseClass */
/** @var string $baseId */

?>

<blog-view-component>
    <div text-right>
        <?= new PageStatsComponent('posts', count($data->posts), $data->pagination) ?>
    </div>
    <blog-posts class="<?= "{$baseClass}__posts" ?>">
        <?php foreach ($data->posts as $post): ?>
            <?= new BlogPostShortComponent($post, $data->hasEditPermissions) ?>
        <?php endforeach ?>
    </blog-posts>

    <template>
        <?= new BlogPostShortComponent(false) ?>
    </template>

    <?= new PageSelectorComponent($data->pagination) ?>
</blog-view-component>

<?php CSSRenderer::add($baseClass, <<<CSS
    .{$baseClass}__posts {
        display: block flex;
        flex-direction: column;
        gap: var(--size-l);
        align-items: center;
        margin-block: var(--size-l);
    }
CSS) ?>