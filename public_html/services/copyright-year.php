<?php

require_once 'configuration.php';

function setCopyrightYearByFile(string $filename) {
    $config = Configuration::getInstance();
    $config->pageYear =
        $config->pageYear === ( $year = date('Y', filectime($filename)) )
        || $config->pageYear === ''
            ? $year
            : $$config->pageYear . '–' . $year;
}

function printCopyrightYear() {
    $config = Configuration::getInstance();
    echo '© ' . $config->pageYear . ' ' . SITE_AUTHOR;
}

?>