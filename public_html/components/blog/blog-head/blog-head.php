<?php declare(strict_types=1);

namespace Components\Blog;

require_once 'utilities/component.utility.php';

use Enums\UserPermission;
use Services\SessionService;
use Utilities\Component;

$sessionService = SessionService::getInstance(); /** @var SessionService $sessionService */
$sessionService->enforcePermissions([UserPermission::Publishing]);

$formId = 'blog-head__form';

Component::renderOnce();
Component::renderCSS();
Component::addJSModule();

?>

<button id="blog-head__btn-add"
    type="button"
    class="btn-primary"
    aria-pressed="false"
    aria-controls="blog-head__content"
    title="Loading..."
    data-title-open="Add a new post"
    data-title-close="Hide post form"
    data-href-open="#svg-add"
    data-href-close="#svg-hide"
    disabled
    >
    <svg is-loading width="2em" height="2em">
        <use xlink:href="#svg-loading" href="#svg-loading"></use>
    </svg>
    <svg has-loaded width="2em" height="2em">
        <use id="blog-head__btn-add__use" xlink:href="#svg-add" href="#svg-add"></use>
    </svg>
</button>

<blog-head-content id="blog-head__content" hidden>
    <?php Component::include('blog/blog-editor', [
        'attributes' => [ 'id' => 'blog-head__editor' ],
        'formId' => $formId
    ]) ?>

    <blog-head-options>
        <label>
            <input id="blog-head__toggle-pinned"
                type="checkbox"
                form="<?= $formId ?>"
                name="isPinned">
            Pinned
        </label>
        <blog-head-scheduling>
            <input hidden
                id="blog-head__scheduled-date"
                type="date"
                form="<?= $formId ?>"
                name="scheduledDate">
            <input hidden
                id="blog-head__scheduled-time"
                type="time"
                form="<?= $formId ?>"
                name="scheduledTime"
                step="60">
            <label>
                <input id="blog-head__toggle-schedule"
                    type="checkbox"
                    form="<?= $formId ?>"
                    name="isScheduled">
                Schedule
            </label>
        </blog-head-scheduling>
    </blog-head-options>

    <blog-head-buttons>
        <button id="blog-head__btn-cancel"
            class="btn-warn btn-hover-heavy">
                Cancel
        </button>
        <blog-head-buttons-save>
            <button id="blog-head__btn-publish"
                type="submit"
                form="<?= $formId ?>"
                class="btn-primary"
                data-content-publish="Publish"
                data-content-schedule="Schedule"
                disabled>
                    Publish
            </button>
            <button id="blog-head__btn-draft"
                class="btn-secondary"
                disabled>
                    Save draft
            </button>
        </blog-head-buttons-save>
    </blog-head-buttons>
</blog-head-content>