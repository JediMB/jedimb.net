<?php declare(strict_types=1);

define('DB_ID', 0);
define('DB_SOURCES', [
    0 => [
        'dsn' => '[type]:host=[url];port=[port];dbname=[database];',
        'schema' => '[schema]',
        'user' => '[username]',
        'pass' => '[password]'
    ]
]);
define('DB_SOURCE', DB_SOURCES[DB_ID]);

define('MASTODON_HOST', '[instance url]');
define('MASTODON_USER', '[username]');
define('MASTODON_TOKEN', '[application token]');

?>