<?php declare(strict_types=1);

chdir(__DIR__);

require_once 'configuration.php';

if (!file_exists('secrets.php')) {
    echo 'ERROR: Please create a secrets.php file.';
    exit;
}
require_once 'secrets.php';

require_once 'routing.php';
require_once 'enums/page-type.enum.php';
require_once 'services/navigation.service.php';
require_once 'services/session.service.php';
require_once 'services/db/user-token.db.service.php';
require_once 'utilities/response.utility.php';

use Models\MenuItem;
use Services\NavigationService;
use Services\SessionService;

// Force lowercase
$requestPath = strtolower(
    // Remove query string from end
    parse_url(
        // Remove slashes and dots from start
        ltrim($_SERVER['REQUEST_URI'], '/.'),
        PHP_URL_PATH
    )
);

$sessionService = SessionService::getInstance();

handleBots();

handleApiRequests($requestPath);

handleComponentModules($requestPath);

if (!$sessionService->isLoggedIn())
    $sessionService->loginFromCookie();

$navService = NavigationService::getInstance();
$navService->menu[] = new MenuItem('About me', '/about');

handleHome($requestPath);

foreach (SPECIAL_PATHS as $request => $path) {
    if ($requestPath === $request)
        servePHP([ 'pagePath' => $path ]);
}

handleVirtualPages($requestPath);

handleBlogRequests($requestPath);

$isForbidden = false;
$realPath = getRealPath($requestPath, $isForbidden);

if (!$realPath)
    servePHP([
        'header' => 'HTTP/1.1 404 Not Found',
        'pagePath' => PATH_ERROR404,
        'baseRoute' => $requestPath
    ]);

if ($isForbidden)
    servePHP([
        'header' => 'HTTP/1.1 403 Forbidden',
        'pagePath' => PATH_ERROR403,
        'baseRoute' => $requestPath
    ]);

if (isPHP($realPath))
    servePHP([
        'pagePath' => $realPath,
        'baseRoute' => $requestPath
    ]);

// Serve asset file from filesystem
return false;

?>