<?php declare(strict_types=1);

use App\Components\ContentEditorComponent;
use App\Utils\CSSRenderer;

/** @var ContentEditorComponent $data */
/** @var string $baseClass */
/** @var string $baseId */

?>

<content-editor-component
    data-remove-container-prompt="Are you sure you want to remove this container and all its contents?"
    data-remove-container-yes="Yes"
    data-remove-container-no="No"
    data-remove-container-keep-contents="Keep contents"
    data-divider-text="Preview ends"
    data-heading-base-level="2"
    data-valid-element-types="<?= str_replace('"', "'", json_encode(INPUT_ALLOWED_TAGS)) ?>">
</content-editor-component>
<div></div>
<div></div>

<?php CSSRenderer::add($baseClass, <<<CSS
    content-editor-component {
        display: block flex;
        flex-direction: column;
        gap: var(--size-s);
        width: 100%;
        height: 15em;
        overflow: scroll;

        border-radius: var(--size-xs);
        padding: var(--size-xs) calc(var(--size-xs) * 2);
        background-color: var(--clr-light);
        color: var(--clr-dark);
    }

    content-container {
        display: block flex;
        flex-direction: column;
        gap: var(--size-s);
        flex-shrink: 0;
        box-sizing: content-box;
        min-height: 1em;
        min-width: 1em;
        padding: 1em;

        & :is(h2, h3, h4, h5, h6):not([contenteditable]) {
            cursor: pointer;
        }

        & > content-toolbar { flex-direction: row; }
        
        &[content-direction="row"] {
            flex-direction: row;

            & > content-toolbar { flex-direction: column; }
        }
    }

    content-invalid-heading {
        display: block;
        text-decoration: line-through;

        &::before {
            margin-right: 1em;
            color: var(--clr-warn-dark);
            content: '❌';
            text-decoration: none;
        }
    }

    content-text {
        box-sizing: content-box;
        min-height: 1em;
        min-width: 1em;
        padding: 1em;
    }

    content-editor-component {
        & content-container {
            border: 1px dashed red;

            &:has(> content-toolbar) {
                background-color: var(--clr-accent);

                & content-container {
                    background-color: var(--clr-accent-dark);
                }
            }
        }
    }
CSS) ?>
