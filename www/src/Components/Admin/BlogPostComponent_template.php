<?php declare(strict_types=1);

use App\Components\Admin\BlogPostComponent;
use App\Utils\CSSRenderer;

/** @var BlogPostComponent $data */
/** @var string $baseClass */
/** @var string $baseId */

?>

<blog-post-component class="display-contents">
    
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