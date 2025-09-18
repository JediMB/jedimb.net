<?php

require_once 'services/navigation.service.php';

use Services\NavigationService;

function setCopyrightYearByFile(string $filename) {
    $config = NavigationService::getInstance();
    $config->pageYear =
        $config->pageYear === ( $year = date('Y', filectime($filename)) )
        || $config->pageYear === ''
            ? $year
            : $$config->pageYear . '–' . $year;
}

function printCopyrightYear() {
    $config = NavigationService::getInstance();
    echo '© ' . $config->pageYear . ' ' . SITE_AUTHOR;
}

?>