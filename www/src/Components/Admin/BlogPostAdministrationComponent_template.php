<?php declare(strict_types=1);

use App\Components\Admin\BlogPostAdministrationComponent;
use App\Components\Admin\BlogPostComponent;
use App\Components\PageSelectorComponent;
use App\Components\PageStatsComponent;
use App\Enums\Published;
use App\Enums\Visibility;
use App\Utils\CSSRenderer;

/** @var BlogPostAdministrationComponent $data */
/** @var string $baseClass */
/** @var string $baseId */

$publishedId = "{$baseId}__status-published";
$visibilityId = "{$baseId}__status-visibility";

?>

<blog-post-administration-component id="<?= $baseId ?>">
    <h3 class="h3">Blog posts</h3>

    <div class="flex-row justify-between">
        <form id="<?= "{$baseId}__status-form" ?>">
            <label for="<?= $publishedId ?>">
                Published status:
                <select name="published" id="<?= $publishedId ?>">
                    <option value="<?= Published::Any->value ?>">
                        Either
                    </option>
                    <option value="<?= Published::Published->value ?>">
                        Published
                    </option>
                    <option value="<?= Published::Unpublished->value ?>">
                        Unpublished
                    </option>
                </select>
            </label>
            <label for="<?= $visibilityId ?>">
                Visibility:
                <select name="visibility" id="<?= $visibilityId ?>">
                    <option value="<?= Visibility::Any->value ?>">
                        Either
                    </option>
                    <option value="<?= Visibility::Visible->value ?>">
                        Visible
                    </option>
                    <option value="<?= Visibility::Hidden->value ?>">
                        Hidden
                    </option>
                </select>
            </label>
        </form>

        <?= new PageStatsComponent('posts', count($data->posts), $data->pagination) ?>
    </div>

    <ul id="<?= "{$baseId}__list" ?>"
        class="<?= "{$baseClass}__list" ?>"
        >
        <?php foreach ($data->posts as $post): ?>
            <li class="display-contents">
                <?= new BlogPostComponent($post) ?>
            </li>
        <?php endforeach ?>
    </ul>

    <template id="<?= "{$baseId}__template" ?>">
        <?= new BlogPostComponent(false) ?>
    </template>

    <?= new PageSelectorComponent($data->pagination) ?>
</blog-post-administration-component>

<?php CSSRenderer::add($baseClass, <<<CSS
    .{$baseClass}__list {
        display: block grid;
        grid-template-columns: 1.5em 1fr auto;
        grid-auto-rows: 1fr;
        gap: var(--size-m);
        margin-block: var(--size-l);
        align-items: center;
    }
CSS) ?>