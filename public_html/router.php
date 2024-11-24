<?php

    chdir(__DIR__);

    // Remove directory separator and query string from path
    $requestPath = ltrim(
        explode('?', $_SERVER['REQUEST_URI'], 2)[0],
        '/');
    
    // If it's a root request, serve root/index.php
    if ($requestPath === '') {
        include __DIR__ . DIRECTORY_SEPARATOR . 'index.php';
        return;
    }
    
    /*  Try to find a matching file in the following order:
        1) Perfect match
        2) File with php extension
        3) File with html extension
        4) Directory with index.php
        5) Directory with index.html
    */
    foreach (['', '.php', '.html', DIRECTORY_SEPARATOR . 'index.php', DIRECTORY_SEPARATOR . 'index.html'] as $pathSuffix) {
        if ( ( $filePath = realpath($requestPath . $pathSuffix) )
            && is_dir($filePath) == false ) // Should support for error 403 Forbidden be implemented?
                break;
    }

    // If trying to access a disallowed file, serve error 404
    if ( $requestPath == 'index'
        || strpos($filePath, __DIR__ . DIRECTORY_SEPARATOR) !== 0 
        || $filePath == __FILE__
        || substr(basename($filePath), 0, 1) == '.') {
            header('HTTP/1.1 404 Not Found');
            echo '404 Not Found';
            exit;
    }

    // If PHP file, serve through interpreter
    if (strtolower(substr($filePath, -4)) == '.php') {
        include $filePath;
        exit;
    }

    // Serve asset file from filesystem
    return false;

?>