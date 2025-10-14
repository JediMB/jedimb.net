<?php declare(strict_types=1);

require_once 'services/session.service.php';

use Enums\UserPermission;
use Services\SessionService;

$sessionService = SessionService::getInstance(); /** @var SessionService $sessionService */
$sessionService->enforcePermissions([ UserPermission::Configuration ]);


$title = 'Administration';

?>