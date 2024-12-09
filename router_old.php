<?php

    chdir(__DIR__);
    $requestParts = explode('?', $_SERVER["REQUEST_URI"], 2);
    $filePath = realpath(ltrim($requestParts[0], '/'));
    
    if ($filePath && is_dir($filePath)){
        // attempt to find an index file
        foreach (['index.php', 'index.html'] as $indexFile){
            if ($realPath = realpath($filePath . DIRECTORY_SEPARATOR . $indexFile)){
                break;
            }
        }
        $filePath = $realPath;
    }
    
    if ($filePath && is_file($filePath)) {
        // 1. check that file is not outside of this directory for security
        // 2. check for circular reference to router.php
        // 3. don't serve dotfiles
        if (strpos($filePath, __DIR__ . DIRECTORY_SEPARATOR) === 0 &&
            $filePath != __FILE__ &&
            substr(basename($filePath), 0, 1) != '.'
        ) {
            if (strtolower(substr($filePath, -4)) == '.php') {
                // php file; serve through interpreter
                include $filePath;
            } else {
                // asset file; serve from filesystem
                return false;
            }
        } else {
            // disallowed file
            header("HTTP/1.1 404 Not Found");
            echo "404 Not Found";
        }
    } else {
        // rewrite to our index file
        echo '(' . $filePath . ')';
        include __DIR__ . DIRECTORY_SEPARATOR . 'index.php';
    }

?>