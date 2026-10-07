<?php declare(strict_types=1);

chdir(__DIR__);

require_once '../config/configuration.php';

if (!file_exists('../config/secrets.php')) {
    echo 'ERROR: Please create a secrets.php file.';
    exit;
}
require_once '../config/secrets.php';

require_once '../functions/pathFromClass.php';
spl_autoload_register(fn($class) => require pathFromClass($class));

use App\Services\RoutingService;
use App\Services\SessionService;

$sessionService = SessionService::getInstance();
$routingService = RoutingService::getInstance();

if (!$sessionService->isLoggedIn())
    $sessionService->loginFromCookie();

return $routingService->handle();