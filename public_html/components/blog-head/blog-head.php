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
    <svg id="svg-blog-add" width="2em" height="2em" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
        <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/>
    </svg>
</button>

<blog-head-content>
    <blog-head-body>
        <label>
            Title:
            <input id="blog-head__title" full-width type="text" placeholder="Title">
        </label>
        
        <blog-head-permalink>
            <span>/<?= PATH_BLOG_PREFIX ?>/<span id="blog-head__permadate" data-default="<?= date('Y/m/d') ?>"><?= date('Y/m/d') ?></span>/</span>
            <input id="blog-head__permalink"
                type="text"
                placeholder="Permalink"
                pattern="^[\-a-z0-9]*$"
                aria-label="Customizable part of the post's URL (i.e. address)"
                required>
            <button id="blog-head__reset_permalink"
                title="Restore default permalink"
                aria-label="Restore default permalink">
                <svg id="svg-blog-restore-setting" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 -960 960 960" fill="#e3e3e3">
                    <path d="M520-330v-60h160v60H520Zm60 210v-50h-60v-60h60v-50h60v160h-60Zm100-50v-60h160v60H680Zm40-110v-160h60v50h60v60h-60v50h-60Zm111-280h-83q-26-88-99-144t-169-56q-117 0-198.5 81.5T200-480q0 72 32.5 132t87.5 98v-110h80v240H160v-80h94q-62-50-98-122.5T120-480q0-75 28.5-140.5t77-114q48.5-48.5 114-77T480-840q129 0 226.5 79.5T831-560Z"/>
                </svg>
            </button>
        </blog-head-permalink>

        <?php Component::include('text-editor', [
            'attributes' => [ 'id' => 'blog-head__text-editor' ]
        ])  ?>

        <label>
            <div>Description:</div>
            <input id="blog-head__description" full-width
                type="text"
                placeholder="A short description of the contents, for search engine previews, etc."
                minlength="<?= INPUT_LENGTH['page_description']['min'] ?>"
                maxlength="<?= INPUT_LENGTH['page_description']['max'] ?>"
                pattern="<?= REGEX_JS['default-text'] ?>"
                required>
        </label>
        <label>
            Social Link:
            <input id="blog-head__sociallink" full-width type="url" placeholder="Social media link connected to this post">
        </label>
    </blog-head-body>
    <blog-head-footer>
        <blog-head-options>
            <label><input id="blog-head__toggle-pinned" type="checkbox">Pinned</label>
            <blog-head-scheduling>
                <input hidden
                    id="blog-head__scheduled-date"
                    type="date">
                <input hidden
                    id="blog-head__scheduled-time"
                    type="time">
                <label>
                    <input id="blog-head__toggle-schedule" type="checkbox">
                    Schedule
                </label>
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