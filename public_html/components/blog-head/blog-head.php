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

Component::addAttributes([ 'c-id' => "$cId" ]);

?>

<button id="blog-head-btn-add-<?= $cId ?>" type="button" class="btn btn-add">
    <svg id="svg-blog-add" width="2em" height="2em" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>
</button>

<input id="blog-head-title-<?= $cId ?>" type="text" placeholder="Title">
<input id="blog-head-permalink-<?= $cId ?>" type="text" placeholder="Permalink" disabled>

<?php Component::include('text-editor')  ?>

<input id="blog-head-description-<?= $cId ?>" type="text" placeholder="A short description of the contents of this post">
<input id="blog-head-sociallink-<?= $cId ?>" type="url" placeholder="Social media link connected to this post">
<button id="blog-head-btn-cancel-<?= $cId ?>">Cancel</button>
<label><input id="blog-head-toggle-pinned-<?= $cId ?>" type="checkbox">Pinned</label>
<label><input id="blog-head-toggle-schedule-<?= $cId ?>" type="checkbox">Schedule</label>
<input id="blog-head-scheduled-on-<?= $cId ?>" type="date">
<button id="blog-head-btn-publish-<?= $cId ?>" disabled>Publish/Schedule</button>
<button id="blog-head-btn-draft-<?= $cId ?>" disabled>Save draft</button>