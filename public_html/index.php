<?php

    chdir(__DIR__);
    
    require_once './utilities/configuration.php';
    
    $GLOBALS['page_title'] = 'JediMB.net';
    $GLOBALS['page_template'] = realpath('views/default.php');
    $GLOBALS['page_content'] = 'Page content';

    // Remove directory separator and query string from path
    $requestPath = ltrim($_SERVER['REQUEST_URI'], '/');

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

        if ( is_dir($filePath) )
            $error403 = true;
        else {
            $error403 = false;
            break;
        }
    }

    // Serve error 403 if trying to access a directory without an index file to serve
    if ( isset($error403) && $error403 ) {
        header('HTTP/1.1 403 Forbidden');
        $GLOBALS['configuration'] ??= configData();

        ob_start();
        include 'error/403.php';
        $GLOBALS['page_content'] = ob_get_clean();
        require_once $GLOBALS['page_template'];
        exit;
    }

    // If trying to access a disallowed file, serve error 404
    if ( $requestPath == 'index' || $requestPath == 'index.php'
        || strpos($filePath, __DIR__ . DIRECTORY_SEPARATOR) !== 0 
        || $filePath == __FILE__
        || substr(basename($filePath), 0, 1) == '.'
        ) {
            header('HTTP/1.1 404 Not Found');
            $GLOBALS['configuration'] ??= configData();

            ob_start();
            include 'error/404.php';
            $GLOBALS['page_content'] = ob_get_clean();
            require_once $GLOBALS['page_template'];
            exit;
    }

    // If PHP file, serve through interpreter
    if (strtolower(substr($filePath, -4)) == '.php') {
        $GLOBALS['configuration'] ??= configData();

        ob_start();
        include $filePath;
        $GLOBALS['page_content'] = ob_get_clean();
        require_once $GLOBALS['page_template'];
        exit;
    }

    // Serve asset file from filesystem
    return false;

?>