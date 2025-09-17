<?php

function getRealPath(string $path, bool &$isForbidden) : string|false {
    /*  Try to find a matching file in the following order:
    1) Non-PHP perfect match
    2) File with php extension in the pages directory
    3) Directory with index.php in the pages directory
    */
    $isForbidden = false;

    if ( ( strtolower(substr($path, -4)) !== '.php' )
        && ($realPath = realpath($path))
        && is_dir($realPath) === false ) {

        if (isUnsafe($realPath))
            $isForbidden = true;

        return $realPath;
    }

    foreach (
        [
            '.php',
            DIRECTORY_SEPARATOR . 'index.php',
        ]
        as $pathSuffix
        ) {

        if ( ( $realPath = realpath(PATH_REALPAGES_DIR . DIRECTORY_SEPARATOR . $path . $pathSuffix) ) === false )
            continue;

        if ( is_dir($realPath) ) {
            // Trying to access a directory without an index file
            $isForbidden = true;
            continue;
        }
        
        $isForbidden = false;
        break;
    }

    if (isUnsafe($realPath))
        $isForbidden = true;

    return $realPath;
}

// If it's an api call, handle separately
function handleApiRequests(string $path) {
    if (strpos($path, 'api/') === 0) {
        header('Content-Type: application/json');

        $requestComponents = explode(DIRECTORY_SEPARATOR, $path, 10);
        
        $apiPath = $requestComponents[0];
        for ($i = 1; $i < count($requestComponents); $i++) {
            $apiPath = $apiPath . DIRECTORY_SEPARATOR . $requestComponents[$i];

            // If a matching api file is found, serve it as a json string
            if (($filePath = realpath($apiPath . '.php'))) {
                $GLOBALS['api_params'] = array_slice($requestComponents, $i + 1);
                include $filePath;
                exit;
            }
        }

        echo json_encode(['message' => 'Invalid URI']);
        exit;
    }
    
}

// If it's trying to access a blog entry, serve a match
function handleBlogRequests(string $path) {
    $matches = [];
    if (preg_match(REGEX_BLOG_PATH, $path, $matches)) {
        $GLOBALS['permalink'] = $matches[1];
        servePHP('blog/post.php');
    }
}

function handleVirtualPages(string $requestPath) {
    $config = Configuration::getInstance();
    /** @var Configuration $config */

    foreach ($config->pageRoutes as $id => $route) {
        if ($route === $requestPath) {
            $config->pageId = $id;
            servePHP(PATH_VIRTUALPAGE, false);
        }
    }
}

function isUnsafe(string $realPath) : bool {
    return strpos($realPath, getcwd() . DIRECTORY_SEPARATOR) !== 0
        || substr(basename($realPath), 0, 1) === '.'; 
}

function servePHP(string $path, string|false $header = false) {
    if ($header)
        header($header);

    $config = Configuration::getInstance();
    /** @var Configuration $config */

    require_once 'services/copyright-year.php';

    ob_start();
    include $path;
    $config->pageContent = ob_get_clean();
    require_once $config->pageTemplate;
    exit;
}

?>