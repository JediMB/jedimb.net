<?php declare(strict_types=1);

define('PATH_HOMEPAGE', 'pages/blog.php');
define('PATH_API_DIR', 'api');
define('PATH_REALPAGES_DIR', 'pages');
define('PATH_ERROR403', 'errors/403.php');
define('PATH_ERROR404', 'errors/404.php');
define('PATH_CSS_DEFAULT', 'css/style.css');

define('SPECIAL_PATHS', [
    'login' => PATH_REALPAGES_DIR . '/account/login.php'
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
define('SESSION_TOKEN_KEY', 'account_token');
define('SESSION_USER_KEY', 'account_id');

define('INPUT_LENGTH', [
    'username' => ['min' => 5, 'max' => 50],
    'password' => ['min' => 12, 'max' => 100] 
]);

define('REGEX_BLOG_PATH', '/^blog(\/[0-9]{4}\/[0-9]{2}\/[0-9]{2}\/[-a-z0-9]*)$/');
define('REGEX_MASTOLINK', '/^http[s]?:\/\/([-.a-z0-9]+)\/@([-.a-z0-9]+)\/([0-9]+)$/');

define('REGEX_INPUT', [
    'username' => '/^(?!\s)[\w@.!?\-\' à-æÀ-Æè-ïÈ-Ïò-öÒ-Öø-ýØ-Ýÿ]+(?<!\s)$/',
    'password' => '/^(?=.*[a-z])(?=.*[A-Z])[\w@.!#$&?*+\-\$£€à-æÀ-Æè-ïÈ-Ïò-öÒ-Öø-ýØ-Ýÿ]+$/'
]);

define('META_DESCRIPTION', "JediMB's indie website");
define('META_KEYWORDS', 'indie, programming, games, blog, webdev');

define('TEXT_INVALID_REQUEST', 'Invalid request method');
define('TEXT_USERNAME_LENGTH', INPUT_LENGTH['username']['min'] . '–' . INPUT_LENGTH['username']['max'] . ' characters.');
define('TEXT_PASSWORD_LENGTH', INPUT_LENGTH['password']['min'] . '–' . INPUT_LENGTH['password']['max'] . ' characters.');
define('TEXT_USERNAME_CHARS', 'A-Z, ÅÄÖÆØ, accented vowels, numbers, apostrophes, spaces between words, and @.!?-.');
define('TEXT_PASSWORD_CHARS', 'A-Z, ÅÄÖÆØ, accented vowels, numbers, and @.!#$&?*+-$£€. Uppercase and lowercase characters required.');
define('TEXT_USERNAME_MISSING', 'Username required');
define('TEXT_PASSWORD_MISSING', 'Password required');
define('TEXT_INPUT_TOOSHORT', 'Too short');
define('TEXT_INPUT_TOOLONG', 'Too long');
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