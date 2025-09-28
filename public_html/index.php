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

use Models\MenuItem;
use Services\NavigationService;

// Force lowercase
$requestPath = strtolower(
    // Remove query string from end
    parse_url(
        // Remove slashes and dots from start
        ltrim($_SERVER['REQUEST_URI'], '/.'),
        PHP_URL_PATH
    )
);

session_start();

handleBots();

if ($requestPath === 'account/auth') {
    include 'account/auth.php';
    exit;
}

handleApiRequests($requestPath);

$navService = NavigationService::getInstance();
$navService->menu[] = new MenuItem('About me', '/about');

if ($requestPath === '')
    servePHP([
        'pagePath' => PATH_HOMEPAGE,
        'links' => true
    ]);

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
        'pagePath' => PATH_ERROR404
    ]);

if ($isForbidden)
    servePHP([
        'header' => 'HTTP/1.1 403 Forbidden',
        'pagePath' => PATH_ERROR403
    ]);

if (isPHP($realPath))
    servePHP([ 'pagePath' => $realPath ]);

// Serve asset file from filesystem
return false;

?>