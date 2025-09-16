<?php

function handleVirtualPages(string $requestPath) {
    require_once 'includes/router/serve-php.php';

    $config = Configuration::getInstance();
    /** @var Configuration $config */

    foreach ($config->pageRoutes as $id => $route) {
        if ($route === $requestPath) {
            $config->pageId = $id;
            servePHP(PATH_VIRTUALPAGE, false);
            exit;
        }
    }
}

?>