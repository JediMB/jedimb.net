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