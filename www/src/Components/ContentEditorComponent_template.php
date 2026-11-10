<?php declare(strict_types=1);

use App\Components\ContentEditorComponent;
use App\Utils\CSSRenderer;

/** @var ContentEditorComponent $data */
/** @var string $baseClass */
/** @var string $baseId */

?>

<content-editor-component></content-editor-component>

<?php CSSRenderer::add($baseClass, <<<CSS
    content-editor-component {
        display: block;
        width: 100%;
        height: 15em;
        overflow: scroll;

        border-radius: var(--size-xs);
        padding: var(--size-xs) calc(var(--size-xs) * 2);
        background-color: var(--clr-light);
        color: var(--clr-dark);
    }

    content-div {
        display: block;
        min-height: 1em;
        border: 1px dashed red;
    }
CSS) ?>
