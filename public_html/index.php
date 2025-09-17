<?php

    chdir(__DIR__);
    
    require_once 'configuration.php';
    require_once 'routing.php';
    require_once 'includes/services/page.service.php';
    use Services\PageService;

    // Remove slashes and dots from start and query string from end of path, force lowercase
    $requestPath = strtolower(parse_url(ltrim($_SERVER['REQUEST_URI'], '/.'), PHP_URL_PATH));
    
    // Serve Error 404 if user agent is known bot
    $httpUserAgent = strtolower($_SERVER['HTTP_USER_AGENT']);
    foreach(INVALID_USER_AGENTS as $botAgent)
        if (strpos($httpUserAgent, $botAgent) !== false)
            servePHP(PATH_ERROR404, 'HTTP/1.1 404 Not Found');

    handleApiRequests($requestPath);

    Configuration::getInstance()->buildRoutes(
        PageService::getInstance()->getPagePaths()
    );

    if ($requestPath === '')
        servePHP(realpath(SITE_HOME));
    
    handleVirtualPages($requestPath);
    
    handleBlogRequests($requestPath);

    $isForbidden = false;
    $realPath = getRealPath($requestPath, $isForbidden);

    if (!$realPath)
        servePHP(PATH_ERROR404, 'HTTP/1.1 404 Not Found');

    if ($isForbidden)
        servePHP(PATH_ERROR403, 'HTTP/1.1 403 Forbidden');

    $isPHP = ( strtolower(substr($realPath, -4)) === '.php' );
    if ($isPHP)
        servePHP($realPath);

    // Serve asset file from filesystem
    return false;

?>