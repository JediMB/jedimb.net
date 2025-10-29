<?php declare(strict_types=1);

require_once 'services/session.service.php';
require_once 'utilities/component.utility.php';

use Enums\UserPermission;
use Services\SessionService;
use Utilities\Component;

$sessionService = SessionService::getInstance(); /** @var SessionService $sessionService */
$sessionService->enforcePermissions([ UserPermission::Configuration ]);


$title = PAGE_ADMIN_TITLE;

?>

<?php Component::include('site-configuration') ?>