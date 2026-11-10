<?php declare(strict_types=1);

namespace Components\Blog;

use App\Enums\UserPermission;
use App\Services\SessionService;
use App\Utils\Component;

$sessionService = SessionService::getInstance(); /** @var SessionService $sessionService */
$sessionService->enforcePermissions([UserPermission::Publishing]);

$formId = 'blog-head__form';

Component::addAttributes(['class' => 'flex-col gap-l']);
Component::renderOnce();

?>

<button id="blog-head__btn-add"
    type="button"
    class="btn-primary btn-pill"
    aria-pressed="false"
    aria-controls="blog-head__content"
    title="Loading..."
    data-title-open="Add a new post"
    data-title-close="Hide post form"
    data-href-open="#svg-add"
    data-href-close="#svg-hide"
    btn-loading
    disabled
    >
    <svg is-loading width="2em" height="2em">
        <use xlink:href="#svg-loading" href="#svg-loading"></use>
    </svg>
    <svg has-loaded width="2em" height="2em">
        <use id="blog-head__btn-add__use" xlink:href="#svg-add" href="#svg-add"></use>
    </svg>
</button>

<blog-head-content id="blog-head__content"
    class="flex-col gap-l"
    >
    <!--hidden-->
    <?php Component::include('blog/blog-form', [
        'attributes' => [ 'id' => 'blog-head__editor' ],
        'formId' => $formId
    ]) ?>

    <blog-head-buttons class="flex-row gap-m justify-between">
        <button id="blog-head__btn-cancel"
            class="btn-warn btn-hover-heavy">
                Cancel
        </button>

        <div class="flex-row gap-m justify-between">
            <div class="flex-row flex-wrap" hidden>
                <span>Last saved:</span>
                <span save-time></span>
            </div>
            <buttons-save class="equal-columns">
                <button id="blog-head__btn-save"
                    class="btn-secondary"
                    disabled
                    >
                    <svg is-loading width="1em" height="1em">
                        <use xlink:href="#svg-loading" href="#svg-loading"></use>
                    </svg>
                    <span has-loaded>Save draft</span>
                </button>
                <button id="blog-head__btn-publish"
                    type="submit"
                    form="<?= $formId ?>"
                    class="btn-primary"
                    data-content-publish="Publish"
                    data-content-schedule="Schedule"
                    disabled
                    >
                    <svg is-loading width="1em" height="1em">
                        <use xlink:href="#svg-loading" href="#svg-loading"></use>
                    </svg>
                    <span has-loaded>Publish</span>
                </button>
            </buttons-save>
        </div>
    </blog-head-buttons>
</blog-head-content>