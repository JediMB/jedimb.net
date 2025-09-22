<?php

chdir(__DIR__);

require_once 'configuration.php';
require_once 'secrets.php';
require_once 'routing.php';
require_once 'enums/page-type.enum.php';
require_once 'services/navigation.service.php';

use Enums\PageType;
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

handleBots();

handleApiRequests($requestPath);

NavigationService::getInstance();

if ($requestPath === '')
    servePHP(realpath(SITE_HOME));

handleVirtualPages($requestPath);

handleBlogRequests($requestPath);

$isForbidden = false;
$realPath = getRealPath($requestPath, $isForbidden);

if (!$realPath)
    servePHP(PATH_ERROR404, [ 'header' => 'HTTP/1.1 404 Not Found' ]);

if ($isForbidden)
    servePHP(PATH_ERROR403, [ 'header' => 'HTTP/1.1 403 Forbidden' ]);

if (isPHP($realPath))
    servePHP($realPath);

// Serve asset file from filesystem
return false;

?>