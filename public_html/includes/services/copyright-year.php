<?php

function setCopyrightYearByFile(string $filename) {
    $GLOBALS['page_year'] =
        $GLOBALS['page_year'] === ( $year = date('Y', filectime($filename)) )
        || $GLOBALS['page_year'] === ''
            ? $year
            : $GLOBALS['page_year'] . '–' . $year;
}

function printCopyrightYear() {
    echo '© ' . $GLOBALS['page_year'] . ' ' . SITE_AUTHOR;
}

?>