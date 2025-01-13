<?php

    chdir(__DIR__);
    
    require_once './includes/utilities/configuration.php';
    require_once './includes/utilities/copyright-year.php';

    // Remove slashes and dots from start and query string from end of path
    $requestPath = ltrim($_SERVER['REQUEST_URI'], '/.');

    if (($queryRemoved = strstr($requestPath, '?', true)) !== false)
        $requestPath = $queryRemoved;
    
    // If it's a root request, serve root/home.php
    if ($requestPath === '')
        $requestPath = 'home.php';
    
    /*  Try to find a matching file in the following order:
        1) Perfect match
        2) File with php extension
        3) File with html extension
        4) Directory with index.php
        5) Directory with index.html
    */
    $error403 = false;
    foreach (
        [
            '',
            '.php',
            '.html',
            DIRECTORY_SEPARATOR . 'index.php',
            DIRECTORY_SEPARATOR . 'index.html'
        ]
        as $pathSuffix
        ) {

        if ( ( $filePath = realpath($requestPath . $pathSuffix) ) == false )
            continue;

        if ( is_dir($filePath) ) {
            $error403 = true;
            continue;
        }
        
        $error403 = false;
        break;
    }

    // Check if trying to access a PHP or disallowed file
    $isPHP = (strtolower(substr($filePath, -4)) === '.php');
    $error404 =
        strtolower($requestPath) === 'index'
        || strtolower($requestPath) === 'index.php'
        || strpos($filePath, __DIR__ . DIRECTORY_SEPARATOR) !== 0 
        || $filePath === __FILE__
        || substr(basename($filePath), 0, 1) === '.'
        || ( $isPHP && strpos($requestPath, 'includes/') === 0 );

    // If a PHP document will be served, set site configuration
    if ($isPHP || $error403 || $error404)
        setConfiguration();

    // Serve error 403 if trying to access a directory without an index file to serve
    if ($error403) {
        header('HTTP/1.1 403 Forbidden');

        ob_start();
        include 'includes/errors/403.php';
        $GLOBALS['page_content'] = ob_get_clean();
        require_once $GLOBALS['page_template'];
        exit;
    }

    // Serve error 404 if trying to access a disallowed file
    if ($error404) {
        header('HTTP/1.1 404 Not Found');

        ob_start();
        include 'includes/errors/404.php';
        $GLOBALS['page_content'] = ob_get_clean();
        require_once $GLOBALS['page_template'];
        exit;
    }

    // Serve PHP file through interpreter
    if ($isPHP) {
        ob_start();
        include $filePath;
        $GLOBALS['page_content'] = ob_get_clean();
        require_once $GLOBALS['page_template'];
        exit;
    }

    // Serve asset file from filesystem
    return false;

?>