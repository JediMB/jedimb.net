<?php

require_once 'enums/page-type.enum.php';
require_once 'services/blog-post.service.php';
require_once 'services/page.service.php';

use Enums\PageType;
use Services\BlogPostService;
use Services\NavigationService;
use Services\PageService;

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
        $service = BlogPostService::getInstance();
        /** @var BlogPostService $service */

        $blogPost = $service->getBlogPost($matches[1]);

        servePHP([
            'pageType' => PageType::BlogPost,
            'title' => $blogPost->title,
            'content' => $blogPost->content,
            'createdOn' => $blogPost->createdOn,
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

function handleVirtualPages(string $requestPath) {
    $nav = NavigationService::getInstance();
    /** @var NavigationService $nav */

    foreach ($nav->virtualPageRoutes as $id => $route) {
        if (ltrim($route, '/') === $requestPath) {
            $service = PageService::getInstance();
            /** @var PageService $service */

            $page = $service->getPage($id);

            servePHP([
                'pageType' => PageType::Virtual,
                'title' => $page->title,
                'content' => $page->content,
                'createdOn' => $page->createdOn,
                'modifiedOn' => $page->modifiedOn
            ]);
        }
    }
}

function isPHP(string $path) : bool {
    return ( strtolower(substr($path, -4)) === '.php' );
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

    $pageService = PageService::getInstance();
    /** @var PageService $pageService */

    if ($pageType === PageType::PHP && isset($pagePath)) {
        ob_start();
        include $pagePath;
        $content = ob_get_clean(); // Used in template/view
    }

    require_once realpath("views/$template");
    exit;
}

?>