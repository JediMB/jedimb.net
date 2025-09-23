<?php

    $siteYear = trim(SITE_CREATEDYEAR);

    if (isset($modifiedOn))
        $year = $modifiedOn->format('Y');
    
    else if (isset($pagePath))
        $year = date('Y', filectime($pagePath));
    
    else $year = $siteYear;

    if ($year !== $siteYear)
        $year = $siteYear . '–' . $year;
?>

© <?= $year ?> <?= SITE_AUTHOR ?>