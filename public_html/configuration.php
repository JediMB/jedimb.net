<?php declare(strict_types=1);

define('CONFIG_PATH', '.configuration.json');

define('PATH_HOMEPAGE', 'pages/blog.php');
define('PATH_API_DIR', 'api');
define('PATH_REALPAGES_DIR', 'pages');
define('PATH_ERROR403', 'errors/403.php');
define('PATH_ERROR404', 'errors/404.php');
define('PATH_CSS_DEFAULT', 'css/style.css');

define('SPECIAL_PATHS', [
    'login' => 'account/login.php'
]);

define('SITE_TITLE', 'JediMB.net');
define('SITE_AUTHOR', 'JediMB');
define('SITE_CREATEDYEAR', '2025');
define('SITE_VIEW', 'default.php');

define('REGEX_BLOG_PATH', '/^blog(\/[0-9]{4}\/[0-9]{2}\/[0-9]{2}\/[-a-z0-9]*)$/');
define('REGEX_MASTOLINK', '/^http[s]?:\/\/([-.a-z0-9]+)\/@([-.a-z0-9]+)\/([0-9]+)$/');

define('META_DESCRIPTION', "JediMB's indie website");
define('META_KEYWORDS', 'indie, programming, games, blog, webdev');

define('DB_OPTIONS', [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
define('DB_DATETIME_FORMAT', 'Y-m-d H:i:se');

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
        'submenu' => [
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

?>