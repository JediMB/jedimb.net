<?php declare(strict_types=1);

use App\Components\Blog\BlogFormComponent;
use App\Components\Blog\BlogHeadComponent;
use App\Utils\CSSRenderer;

/** @var BlogHeadComponent $data */
/** @var string $baseClass */
/** @var string $baseId */

$formId = "{$baseId}__form";

?>

<blog-head-component class="flex-col gap-l">
    <button btn-add-post
        type="button"
        class="btn-primary btn-pill"
        aria-pressed="false"
        aria-controls="<?= "{$baseId}__content" ?>"
        title="Loading..."
        data-title-active="Hide post form"
        data-title-inactive="Add a new post"
        >
        <svg width="2em" height="2em">
            <use xlink:href="#svg-hide" href="#svg-hide" class="active-content"></use>
            <use xlink:href="#svg-add" href="#svg-add" class="inactive-content"></use>
        </svg>
    </button>

    <blog-head-content class="flex-col gap-l">
        <?= new BlogFormComponent($formId, false) ?>

        <blog-head-buttons class="flex-row gap-m justify-between">
            <button btn-cancel-post
                class="btn-warn btn-hover-heavy"
                >
                Cancel
            </button>

            <save-time class="flex-row gap-m justify-between">
                <div class="flex-row flex-wrap" hidden>
                    <span>Last saved: </span>
                    <span save-time></span>
                </div>
            </save-time>
            <buttons-save class="equal-columns">
                <button btn-save-post
                    type="button"
                    class="btn-secondary"
                    disabled
                    >
                    <svg is-loading width="1em" height="1em">
                        <use xlink:href="#svg-loading" href="#svg-loading"></use>
                    </svg>
                    <span has-loaded>Save draft</span>
                </button>
                <button btn-publish-post
                    type="submit"
                    form="<?= $formId ?>"
                    class="btn-primary"
                    disabled
                    >
                    <svg is-loading width="1em" height="1em">
                        <use xlink:href="#svg-loading" href="#svg-loading"></use>
                    </svg>
                    <span has-loaded>
                        <span class="active-content">Schedule</span>
                        <span class="inactive-content">Publish</span>
                    </span>
                </button>
            </buttons-save>
        </blog-head-buttons>
    </blog-head-content>
</blog-head-component>

<?php CSSRenderer::add($baseClass, <<<CSS
    blog-head-component {
        margin-bottom: var(--size-l);
    }
CSS) ?>
