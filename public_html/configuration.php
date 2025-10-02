<?php declare(strict_types=1);

define('PATH_HOMEPAGE', 'pages/blog.php');
define('PATH_API_DIR', 'api');
define('PATH_REALPAGES_DIR', 'pages');
define('PATH_ERROR403', 'errors/403.php');
define('PATH_ERROR404', 'errors/404.php');
define('PATH_CSS_DEFAULT', 'css/style.css');

define('SPECIAL_PATHS', [
    'login' => 'account/login.php',
    'logout' => 'account/logout.php'
]);

define('SITE_TITLE', 'JediMB.net');
define('SITE_AUTHOR', 'JediMB');
define('SITE_CREATEDYEAR', '2025');
define('SITE_VIEW', 'default.php');

define('COOKIE_USER_KEY', 'userId');
define('COOKIE_TOKEN_KEY', 'token');
define('COOKIE_VALIDATOR_KEY', 'validator');
define('COOKIE_EXPIRATION', '1 year');

define('SESSION_STATUS_KEY', 'account_loggedin');
define('SESSION_USERNAME_KEY', 'account_name');
define('SESSION_USERID_KEY', 'account_id');

define('REGEX_BLOG_PATH', '/^blog(\/[0-9]{4}\/[0-9]{2}\/[0-9]{2}\/[-a-z0-9]*)$/');
define('REGEX_MASTOLINK', '/^http[s]?:\/\/([-.a-z0-9]+)\/@([-.a-z0-9]+)\/([0-9]+)$/');

define('META_DESCRIPTION', "JediMB's indie website");
define('META_KEYWORDS', 'indie, programming, games, blog, webdev');

define('TEXT_INVALID_REQUEST', 'Invalid request method');
define('TEXT_USERNAME_MISSING', 'Username required');
define('TEXT_PASSWORD_MISSING', 'Password required');
define('TEXT_INCORRECT_LOGIN', 'Incorrect username or password');

define('DB_OPTIONS', [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
define('DB_DATETIME_FORMAT', 'Y-m-d H:i:s.u e');
define('DB_DATETIME_FORMAT_FALLBACK', 'Y-m-d H:i:s e');

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