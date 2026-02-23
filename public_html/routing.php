<?php

require_once 'enums/page-type.enum.php';
require_once 'services/blog-post.service.php';
require_once 'services/db/page.db.service.php';

use Enums\PageType;
use Services\NavigationService;
use Services\BlogPostService;
use Services\DB\PageDBService;

function getRealPath(string $path, bool &$isForbidden) : string|false {
    /*  Try to find a matching file in the following order:
    1) Non-PHP perfect match
    2) File with php extension in the pages directory
    3) Directory with index.php in the pages directory
    */
    $isForbidden = false;

    if ( isPHP($path) === false
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
    if (strpos($path, PATH_API_DIR . '/') !== 0)
        return;

    $apiPath = PATH_API_DIR;
    $pathComponents = explode('/', $path, 10);
    $pathComponents = array_splice($pathComponents, 1);

    header('Content-Type: application/json');
    
    foreach ($pathComponents as $index => $component) {
        $apiPath = "$apiPath/$component";
        
        if ( ($filePath = realpath("$apiPath.php")) ) {
            $GLOBALS['api_params'] = array_slice($pathComponents, $index + 1);

            if ( !($result = include $filePath) ) {
                header('HTTP/1.1 500 Internal Server Error');
                echo json_encode([ 'success' => false, 'errors' => [ 'No data from API' ] ]);
                exit;
            }

            if (isset($result['header'])) {
                header($result['header']);
                unset($result['header']);
            }

            echo json_encode($result);
            exit;
        }
    }

    header('HTTP/1.1 404 Not Found');
    echo json_encode([ 'success' => false, 'errors' => [ 'Invalid API address' ] ]);
    exit;
}

// If it's trying to access a blog entry, serve a match
function handleBlogRequests(string $path) {
    $matches = [];
    if (preg_match(REGEX_BLOG_PATH, $path, $matches)) {
        $service = BlogPostService::getInstance(); /** @var BlogPostService $service */
        
        $blogPost = $service->getPublishedBlogPost($matches[1]);

        if (!$blogPost)
            servePHP([
                'header' => 'HTTP/1.1 404 Not Found',
                'pagePath' => PATH_ERROR404
            ]);

        servePHP([
            'pageType' => PageType::BlogPost,
            'title' => $blogPost->title,
            'content' => $blogPost->contentShort . $blogPost->contentRest,
            'createdOn' => $blogPost->publishedOn,
            'modifiedOn' => $blogPost->modifiedOn,
            'mastolink' => $blogPost->mastolink
        ]);
    }
}

// Serve Error 404 if user agent is known bot
function handleBots() {
    $httpUserAgent = strtolower($_SERVER['HTTP_USER_AGENT']);
    foreach(INVALID_USER_AGENTS as $botAgent)
        if (strpos($httpUserAgent, $botAgent) !== false)
            servePHP([
                'header' => 'HTTP/1.1 404 Not Found',
                'pagePath' => PATH_ERROR404
            ]);
}

function handleComponentModules(string $path) {
    if (strpos($path, PATH_COMPONENT_MODULE_DIR_ALIAS . '/') !== 0)
        return;

    if (substr($path, -10) !== '.module.js')
        return;

    if ( ($realPath = realpath(str_replace(PATH_COMPONENT_MODULE_DIR_ALIAS, PATH_COMPONENTS_DIR, $path))) ) {
        header('Content-Type: text/javascript; charset=utf-8');
        echo file_get_contents($realPath);
        exit;
    }
    
    header('HTTP/1.1 404 Not Found');
    exit;
}

function handleVirtualPages(string $requestPath) {
    $nav = NavigationService::getInstance(); /** @var NavigationService $nav */

    foreach ($nav->virtualPageRoutes as $id => $route) {
        if (ltrim($route, '/') === $requestPath) {
            $service = PageDBService::getInstance(); /** @var PageDBService $service */

            $page = $service->getPage($id);

            servePHP([
                'pageType' => PageType::Virtual,
                'title' => $page->title,
                'content' => $page->contentShort . $page->contentRest,
                'createdOn' => $page->createdOn,
                'modifiedOn' => $page->modifiedOn
            ]);
        }
    }
}

function isPHP(string $path) : bool {
    return !!preg_match('/.+\.php$/', $path);
}

function isUnsafe(string $realPath) : bool {
    return strpos($realPath, getcwd() . DIRECTORY_SEPARATOR) !== 0
        || substr(basename($realPath), 0, 1) === '.'; 
}

function servePHP(array $variables = [ 'header' => false ]) {
    extract($variables);

    if (!isset($pageType))
        $pageType = PageType::PHP;
    
    if (!empty($header))
        header($header);

    if (empty($template))
        $template = SITE_VIEW;

    if ($pageType === PageType::PHP && isset($pagePath)) {
        ob_start();
        include $pagePath;
        $content = ob_get_clean(); // Used in template/view
    }

    require_once realpath("views/$template");
    exit;
}

?>