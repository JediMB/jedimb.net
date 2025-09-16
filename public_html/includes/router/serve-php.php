<?php

function servePHP(string $path, string|false $header = false) {
    if ($header)
        header($header);

    $config = Configuration::getInstance();
    /** @var Configuration $config */

    require_once 'includes/services/copyright-year.php';

    ob_start();
    include $path;
    $config->pageContent = ob_get_clean();
    require_once $config->pageTemplate;
    exit;
}

?>