<?php

    chdir(__DIR__);
    
    require_once 'configuration.php';
    require_once 'includes/services/page.service.php';
    require_once 'includes/services/copyright-year.php';
    require_once 'includes/router/serve-php.php';

    use Services\PageService;

    $config = Configuration::getInstance();
    /** @var Configuration $config */

    // Remove slashes and dots from start and query string from end of path, force lowercase
    $requestPath = strtolower(parse_url(ltrim($_SERVER['REQUEST_URI'], '/.'), PHP_URL_PATH));
    
    require_once 'includes/router/api.php';
    handleApiRequests($requestPath);

    // Serve Error 404 if user agent is known bot
    $httpUserAgent = strtolower($_SERVER['HTTP_USER_AGENT']);
    foreach(INVALID_USER_AGENTS as $botAgent)
        if (strpos($httpUserAgent, $botAgent) !== false)
            servePHP(PATH_ERROR404, 'HTTP/1.1 404 Not Found');

    $config->buildRoutes(PageService::getInstance()->getPagePaths());
    /*
        foreach on $config->getRoutes and deliver a page with getPage if there's a match
    */
    
    require_once 'includes/router/blog.php';
    handleBlogRequests($requestPath);

    if ($requestPath === '')
        $requestPath = SITE_HOME;

    $isForbidden = false;
    require_once 'includes/router/path-matching.php';
    $realPath = handlePathMatching($requestPath, $isForbidden);

    if ($isForbidden)
        servePHP(PATH_ERROR403, 'HTTP/1.1 403 Forbidden');

    // Check if trying to access a PHP file
    $isPHP = ( strtolower(substr($realPath, -4)) === '.php' );

    require_once 'includes/router/report-404.php';
    if (countsAsNotFound($requestPath, $realPath, $isPHP))
        servePHP(PATH_ERROR404, 'HTTP/1.1 404 Not Found');
    
    if ($isPHP)
        servePHP($realPath);

    // Serve asset file from filesystem
    return false;

?>