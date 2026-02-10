<?php declare(strict_types=1);

namespace Components;

require_once 'utilities/component.utility.php';

use Enums\UserPermission;
use Services\SessionService;
use Utilities\Component;

$sessionService = SessionService::getInstance(); /** @var SessionService $sessionService */
$sessionService->enforcePermissions([UserPermission::Publishing]);

Component::renderOnce();
Component::renderCSS();
Component::addJSModule();

?>

<button id="blog-head__btn-add" type="button" class="btn btn-add">
    <svg id="svg-blog-add" width="2em" height="2em" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>
</button>

<blog-head-content>
    <blog-head-body>
        <input id="blog-head__title" type="text" placeholder="Title">
        <blog-head-permalink>
            <span>/<?= PATH_BLOG_PREFIX ?>/<span id="blog-head__permadate" data-default="<?= date('Y/m/d') ?>"><?= date('Y/m/d') ?></span>/</span>
            <input id="blog-head__permalink"
                type="text"
                placeholder="Permalink"
                pattern="^[\-a-z0-9]*$"
                required>
        </blog-head-permalink>

        <?php Component::include('text-editor')  ?>

        <input id="blog-head__description" type="text" placeholder="A short description of the contents of this post">
        <input id="blog-head__sociallink" type="url" placeholder="Social media link connected to this post">
    </blog-head-body>
    <blog-head-footer>
        <blog-head-options>
            <label><input id="blog-head__toggle-pinned" type="checkbox">Pinned</label>
            <blog-head-scheduling>
                <input hidden
                    id="blog-head__scheduled-date"
                    type="date"
                    value="<?= date('Y-m-d') ?>">
                <input hidden
                    id="blog-head__scheduled-time"
                    type="time"
                    value="23:59">
                <label><input id="blog-head__toggle-schedule" type="checkbox">Schedule</label>
            </blog-head-scheduling>
        </blog-head-options>
        <blog-head-buttons>
            <button id="blog-head__btn-cancel">Cancel</button>
            <div>
                <button id="blog-head__btn-publish"
                    data-content-publish="Publish"
                    data-content-schedule="Schedule"
                    disabled>
                    Publish
                </button>
                <button id="blog-head__btn-draft" disabled>Save draft</button>
            </div>
        </blog-head-buttons>
    </blog-head-footer>
</blog-head-content>