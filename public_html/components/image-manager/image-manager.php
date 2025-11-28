<?php declare(strict_types=1);

namespace Components;

require_once 'utilities/component.utility.php';

use Enums\UserPermission;
use Services\SessionService;
use Utilities\Component;

$sessionService = SessionService::getInstance(); /** @var SessionService $sessionService */
$sessionService->enforcePermissions([UserPermission::Publishing]);

Component::renderCSS();
Component::addJSModule();

?>

<h2>Image manager</h2>
<image-manager>
    <manager-tabs>
        <ul>
            <li><label><input type="radio" name="image-tabs" checked>Images</label></li>
            <li><label><input type="radio" name="image-tabs">Groups</label></li>
        </ul>
    </manager-tabs>
    <manager-content>
        <manager-list>
            <ul>
                <?php $items = ['Dog with hat', 'Nice bike', 'Two stacks of bricks', 'Mahogany table', 'Funny cat'];
                    foreach ($items as $item): ?>
                    <li><label><input type="radio" name="images"><?= $item ?></label></li>
                <?php endforeach ?>
            </ul>
        </manager-list>
        <manager-properties>
            <div style="text-align: center;">20251127_0835721.jpg</div>
            <div class="image-preview">
                &nbsp;
            </div>
            <div>
                <div>Title: Dog with hat</div>
                <div>Description: The text that goes in the ALT field</div>
                <div>Created on: 2025-11-27 13:45 (UTC+1)</div>
                <div>Modified on: (unmodified)</div>
                <div>Title: Dog with hat</div>
                <div>Description: The text that goes in the ALT field</div>
                <div>Created on: 2025-11-27 13:45 (UTC+1)</div>
                <div>Modified on: (unmodified)</div>
            </div>
        </manager-properties>
    </manager-content>
</image-manager>
<manager-buttons>
    <button>Insert</button>
    <button>Upload</button>
</manager-buttons>