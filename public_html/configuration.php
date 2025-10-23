<?php declare(strict_types=1);

define('CONFIGURABLE_CONSTANTS', [
    'SITE_TITLE',
    'SITE_TAGLINE',
    'SITE_AUTHOR',
    'META_DESCRIPTION',
    'META_KEYWORDS'
]);

define('PATH_HOMEPAGE', 'pages/blog.php');
define('PATH_API_DIR', 'api');
define('PATH_COMPONENT_MODULE_DIR_ALIAS', 'js/components');
define('PATH_COMPONENTS_DIR', 'components');
define('PATH_REALPAGES_DIR', 'pages');
define('PATH_ERROR403', 'errors/403.php');
define('PATH_ERROR404', 'errors/404.php');
define('PATH_CSS_DEFAULT', 'css/style.css');

define('SPECIAL_PATHS', [
    'login' => PATH_REALPAGES_DIR . '/account/login.php'
]);

define('SITE_TITLE', 'JediMB.net');
define('SITE_TAGLINE', 'Cool tagline goes here. In theory.');
define('SITE_AUTHOR', 'JediMB');
define('SITE_CREATEDYEAR', '2025');
define('SITE_VIEW', 'default.php');

define('COOKIE_USER_KEY', 'userId');
define('COOKIE_TOKEN_KEY', 'token');
define('COOKIE_VALIDATOR_KEY', 'validator');
define('COOKIE_EXPIRATION', '1 year');

define('SESSION_STATUS_KEY', 'account_loggedin');
define('SESSION_TOKEN_KEY', 'account_token');
define('SESSION_USER_KEY', 'account_user');

define('INPUT_LENGTH', [
    'username' => ['min' => 5, 'max' => 50],
    'password' => ['min' => 10, 'max' => 100]
]);

define('REGEX_BLOG_PATH', '/^blog(\/[0-9]{4}\/[0-9]{2}\/[0-9]{2}\/[-a-z0-9]*)$/');
define('REGEX_MASTOLINK', '/^http[s]?:\/\/([-.a-z0-9]+)\/@([-.a-z0-9]+)\/([0-9]+)$/');

define('REGEX_INPUT', [
    'username' => '/^(?!\s)[\w@.!?\-\' à-æÀ-Æè-ïÈ-Ïò-öÒ-Öø-ýØ-Ýÿ]+(?<!\s)$/',
    'password' => '/^(?=.*[a-z])(?=.*[A-Z])[\w@.!#$&?*+\-\$£€à-æÀ-Æè-ïÈ-Ïò-öÒ-Öø-ýØ-Ýÿ]+$/',
    'config-text' => '/^(?!\s)[\w@.!?\-\' à-æÀ-Æè-ïÈ-Ïò-öÒ-Öø-ýØ-Ýÿ]+(?<!\s)$/',
    'config-items' => '/^(?!\s)[a-z0-9 \-à-æè-ïò-öø-ýÿ]+$/'
]);

define('META_DESCRIPTION', "JediMB's indie website");
define('META_KEYWORDS', 'indie, programming, games, blog, webdev');

define('TEXT_INVALID_REQUEST', 'Invalid request method');
define('TEXT_NOT_LOGGED_IN', 'User not logged in');
define('TEXT_INSUFFICIENT_PERMISSIONS', 'Insufficient user permissions');
define('TEXT_USERNAME', 'username');
define('TEXT_PASSWORD', 'password');
define('TEXT_INPUT_MISSING', ' required');
define('TEXT_INPUT_TOOSHORT', ' too short');
define('TEXT_INPUT_TOOLONG', ' too long');
define('TEXT_INPUT_MISMATCH', ' format invalid');
define('TEXT_USERNAME_LENGTH', INPUT_LENGTH['username']['min'] . '–' . INPUT_LENGTH['username']['max'] . ' characters.');
define('TEXT_PASSWORD_LENGTH', INPUT_LENGTH['password']['min'] . '–' . INPUT_LENGTH['password']['max'] . ' characters.');
define('TEXT_USERNAME_CHARS', 'A-Z, ÅÄÖÆØ, accented vowels, numbers, apostrophes, spaces between words, and @.!?-.');
define('TEXT_PASSWORD_CHARS', 'Uppercase and lowercase characters required. A-Z, ÅÄÖÆØ, accented vowels, numbers, and @.!#$&?*+-$£€.');
define('TEXT_INCORRECT_LOGIN', 'Incorrect username or password');
define('TEXT_CONFIG_CHARS', 'A-Z, ÅÄÖÆØ, accented vowels, numbers, apostrophes, spaces between words, and @.!?-.');

define('PAGE_ADMIN_TITLE', 'Administration');
define('PAGE_ADMIN_SECTION_SITE', 'Site settings');
define('PAGE_ADMIN_USEDEFAULT', 'Use default');

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