<?php

/*
    Report as 404 Not Found if...
    - realpath() reported false in handlePathMatching
    - the requested path is index or index.php in the root
    - the real path does not start with the root directory
    - the real path starts with a period
    - the requested path is a PHP file in the includes/ directory
*/
function countsAsNotFound(string $requestPath, string $realPath, bool $isPHP) : bool {
    return $realPath === false
        || $requestPath === 'index'
        || $requestPath === 'index.php'
        || strpos($realPath, getcwd() . DIRECTORY_SEPARATOR) !== 0
        || substr(basename($realPath), 0, 1) === '.'
        || ( $isPHP && strpos($requestPath, 'includes/') === 0 );
}

?>