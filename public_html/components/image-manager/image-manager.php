<?php declare(strict_types=1);

namespace Components;

require_once 'utilities/component.utility.php';

use Enums\UserPermission;
use Services\SessionService;
use Utilities\Component;

$sessionService = SessionService::getInstance(); /** @var SessionService $sessionService */
$sessionService->enforcePermissions([UserPermission::Publishing]);

Component::renderCSS();
Component::queueJS(__FILE__);

?>

<div>
    Image manager
</div>
<image-manager>
    <ul>
        <li><button>Images</button></li>
        <li><button>Groups</button></li>
    </ul>
    <images-container>
        <manager-panel>
            <ul>
                <li style="background-color: white; color: black;">Dog with hat</li>
                <li>Nice bike</li>
                <li>Two stacks of bricks</li>
                <li>Mahogany table</li>
                <li>Funny cat</li>
            </ul>
            <div>
                <button>Insert</button>
                <button>Upload</button>
            </div>
        </manager-panel>
        <manager-panel>
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
        </manager-panel>
    </images-container>
    <groups-container hidden>

    </groups-container>
</image-manager>