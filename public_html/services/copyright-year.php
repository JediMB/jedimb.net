<?php

require_once 'services/page.service.php';

use Services\PageService;

function setCopyrightYearByFile(string $filename) {
    $page = PageService::getInstance();
    $presetYear = $page->year;
    $page->year =
        $presetYear === ( $fileYear = date('Y', filectime($filename)) )
        || $presetYear === ''
            ? $fileYear
            : $presetYear . '–' . $fileYear;
}

function printCopyrightYear() {
    $page = PageService::getInstance();
    echo '© ' . $page->year . ' ' . SITE_AUTHOR;
}

?>