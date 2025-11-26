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