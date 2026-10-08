<?php declare(strict_types=1);

namespace App\Services;

use App\Abstract\Singleton;
use App\Database\PageDbService;
use App\Enums\PageType;
use App\Models\App\MenuItem;
use App\Models\App\Page;
use App\Services\BlogPostScheduleService;
use App\Services\BlogPostService;
use App\Services\NavigationService;

class RoutingService extends Singleton {
    private string $requestPath;
    private int $pageNumber = 0;
    private bool $isForbidden = false;

    protected function __construct() {
        $this->requestPath = strtolower(
            // Remove any standard query string
            parse_url(
                // Trim dots and slashes
                trim($_SERVER['REQUEST_URI'], '/.'),
                PHP_URL_PATH
            )
        );

        $this->rejectBots();
    }

    private function getAssettMatch() : string|false {
        if ($this->isPHP($this->requestPath))
            return false;

        if (!($realPath = realpath($this->requestPath)))
            return false;

        if (is_dir($realPath))
            return false;

        if ($this->isUnsafe($realPath))
            $this->isForbidden = true;

        return $realPath;
    }

    private function getPHPMatch() : string|false {
        $realPath = false;

        foreach ([
            '.php',
            DIRECTORY_SEPARATOR . 'index.php'
        ] as $pathSuffix) {
            $realPath = realpath(PATH_REALPAGES_DIR . "/{$this->requestPath}$pathSuffix");
            
            if (!$realPath)
                continue;

            if (is_dir($realPath)) {
                $this->isForbidden = true;
                continue;
            }

            $this->isForbidden = false;
            break;
        }

        if (!$realPath)
            return false;

        if ($this->isUnsafe($realPath))
            $this->isForbidden = true;

        return $realPath;
    }

    public function handle() : false {
        $this->handleApiRequests();
        
        // Temporary: add custom menu items before any pages are rendered
        // This data should live in the database instead
        NavigationService::getInstance()->menu[] = new MenuItem('About me', '/about');
        $this->separatePageNumber();

        $this->handleHome();

        // Hardcoded special paths, like the admin page
        foreach (SPECIAL_PATHS as $request => $path) {
            if ($this->requestPath !== $request)
                continue;

            $this->servePHP(
                new Page(PageType::PHP, $this->requestPath, realPath: $path)
            );
        }

        $this->handleVirtualPages();
        $this->handleBlogRequests();
        
        if ($this->getAssettMatch()) {
            if ($this->isForbidden)
                $this->servePHP(new Page(PageType::Forbidden, $this->requestPath));

            return false;
        }

        $realPath = $this->getPHPMatch();

        if (!$realPath)
            $this->servePHP(new Page(PageType::NotFound, $this->requestPath));

        if ($this->isForbidden)
            $this->servePHP(new Page(PageType::Forbidden, $this->requestPath));

        $this->servePHP(new Page(PageType::PHP, $this->requestPath, $this->pageNumber, $realPath));
        
        return false;
    }

    // If it's an api call, handle separately
    private function handleApiRequests() {
        if (strpos($this->requestPath, PATH_API_DIR . '/') !== 0)
            return;

        $apiPath = PATH_API_DIR;
        $pathComponents = explode('/', $this->requestPath, 10);
        $pathComponents = array_splice($pathComponents, 1);

        foreach ($pathComponents as $index => $component) {
            $apiPath = "$apiPath/$component";
            
            if ( ($filePath = realpath("$apiPath.php")) ) {
                $GLOBALS['api_params'] = array_slice($pathComponents, $index + 1);
                $this->serveApiData($filePath);
            }
        }

        header('Content-Type: application/json');
        header('HTTP/1.1 404 Not Found');
        echo json_encode([ 'success' => false, 'errors' => [ 'Invalid API address' ] ]);
        exit;
    }

    // If it's trying to access a blog entry, serve a match
    private function handleBlogRequests() {
        $path = $this->requestPath;
        $matches = [];

        if (!preg_match(REGEX_BLOG_PATH, $path, $matches))
            return;

        $service = BlogPostService::getInstance(); /** @var BlogPostService $service */
        
        $blogPost = $service->getPublicBlogPost($matches[1]);

        if ($blogPost) {
            $page = new Page(PageType::BlogPost, $path, $this->pageNumber);
            $page->title = $blogPost->title;
            $page->content = $blogPost->contentShort . $blogPost->contentRest;
            $page->createdOn = $blogPost->createdOn;
            $page->modifiedOn = $blogPost->modifiedOn;
        }
        else {
            $page = new Page(PageType::NotFound, $path);
        }

        $this->servePHP($page);
    }

    private function handleHome() {
        if (!empty($this->requestPath))
            return;

        $page = new Page(PageType::PHP, '', $this->pageNumber, PATH_HOMEPAGE);
        
        $this->servePHP($page);
    }

    private function handleVirtualPages() {
        $nav = NavigationService::getInstance(); /** @var NavigationService $nav */

        foreach ($nav->virtualPageRoutes as $id => $route) {
            if (ltrim($route, '/') === $this->requestPath) {
                $service = PageDbService::getInstance(); /** @var PageDbService $service */

                $virtualPage = $service->getPage($id);

                $page = new Page(PageType::Virtual, $this->requestPath, $this->pageNumber);
                $page->title = $virtualPage->title;
                $page->content = $virtualPage->contentShort . $virtualPage->contentRest;
                $page->createdOn = $virtualPage->createdOn;
                $page->modifiedOn = $virtualPage->modifiedOn;

                $this->servePHP($page);
            }
        }
    }

    private function isPHP(string $path) : bool {
        return !!preg_match('/.+\.php$/', $path);
    }

    /** Path is unsafe if it isn't within the current working directory,
     *  or if the targeted file/directory name begins with a dot
     */
    private function isUnsafe(string $realPath) : bool {
        return !str_starts_with($realPath, getcwd() . DIRECTORY_SEPARATOR)
            || str_starts_with(basename($realPath), '.');
    }

    // Serve Error 404 if user agent is known bot
    private function rejectBots() {
        $httpUserAgent = strtolower($_SERVER['HTTP_USER_AGENT']);

        foreach (INVALID_USER_AGENTS as $botAgent)
            if (strpos($httpUserAgent, $botAgent) !== false)
                $this->servePHP(new Page(
                    PageType::NotFound,
                    $this->requestPath
                ));
    }

    private function separatePageNumber() {
        $matches = [];

        if (!preg_match(REGEX_PATH_WITH_PAGE, $this->requestPath, $matches))
            return;

        $this->requestPath = $matches[1];
        $matches[2] = (int)$matches[2];

        if ($matches[2] < 1)
            return;

        $this->pageNumber = $matches[2];
    }

    private function serveApiData(string $filePath) {
        BlogPostScheduleService::getInstance()->publishPendingScheduledBlogPosts();

        header('Content-Type: application/json');

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

    private function servePHP(Page $page) {
        BlogPostScheduleService::getInstance()->publishPendingScheduledBlogPosts();

        if ($page->header)
            header($page->header);

        if ($page->baseRequest)
            define('CURRENT_PAGE_ROUTE', '/' . trim($page->baseRequest, '/'));
        else
            define('CURRENT_PAGE_ROUTE', '');

        $page->setView(SITE_VIEW);
        
        if ($page->pageType === PageType::PHP && isset($page->realPath)) {
            ob_start();
            include $page->realPath;
            if (($content = ob_get_clean()))
                $page->content = $content;
        }

        require_once $page->viewPath;
        exit;
    }
}