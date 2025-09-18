<?php

define('CONFIG_PATH', '.configuration.json');

define('PATH_VIRTUALPAGE', 'page.php');
define('PATH_REALPAGES_DIR', 'pages');
define('PATH_ERROR403', 'errors/403.php');
define('PATH_ERROR404', 'errors/404.php');

define('SITE_TITLE', 'JediMB.net');
define('SITE_AUTHOR', 'JediMB');
define('SITE_CREATEDYEAR', '2025');
define('SITE_TEMPLATE', 'default.php');
define('SITE_HOME', 'blog/blog.php');

define('REGEX_BLOG_PATH', '/^blog(\/[0-9]{4}\/[0-9]{2}\/[0-9]{2}\/[-a-z0-9]*)$/');
define('REGEX_MASTOLINK', '/^http[s]?:\/\/([-.a-z0-9]+)\/@([-.a-z0-9]+)\/([0-9]+)$/');

define('DB_OPTIONS', [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
define('INVALID_USER_AGENTS', [
        'anthropic-ai',
        'claude-web',
        'applebot-extended',
        'bytespider',
        'ccbot',
        'chatgpt-user',
        'cohere-ai',
        'diffbot',
        'facebookbot',
        'googleother',
        'google-extended',
        'gptbot',
        'imagesiftbot',
        'perplexitybot',
        'omigilibot',
        'omigili',
]);

define('MENU_MAIN', [
    [
        'title' => 'Projects',
        'submenu-hidden' => [
            [
                'title' => 'Project A',
                'url' => '/projects/project-a',
                'description' => 'This is a project.'
            ],
            [
                'title' => 'Project B',
                'url' => '/projects/project-b',
                'description' => 'This is another project a significantly longer description, as you may very well see.'
            ]
        ]
    ],
    [
        'title' => 'About me',
        'url' => '/about'
    ]
]);

require_once 'secrets.php';
require_once 'services/singleton.php';

use Services\Singleton;

class Configuration extends Singleton{
    public string $pageTitle;
    public string $pageTemplate;
    public string $pageYear;
    public string $pageContent;

    public array $pageRoutes;
    public string $pageId;

    protected function __construct() {
        $this->pageTitle = SITE_TITLE;
        $this->pageTemplate  = realpath('views/' . SITE_TEMPLATE);
        $this->pageYear = SITE_CREATEDYEAR;
        $this->pageContent = 'Page content';
    }

    public function buildRoutes(array $pagePaths) {
        $this->pageRoutes = [];
       
        foreach ($pagePaths as $path) {
            /** @var PagePath $path */
            $id = $path->id;
            $fullPath = $path->pathPart;

            while ($path->parentId) {
                $path = $pagePaths[$path->parentId];
                $fullPath = $path->pathPart . DIRECTORY_SEPARATOR . $fullPath;
            }

            $this->pageRoutes[$id] = $fullPath;
        }
    }

    function setPageTitle(string $pageTitle) {
        $this->pageTitle = $pageTitle . ' – ' . SITE_TITLE;
    }
}

?>