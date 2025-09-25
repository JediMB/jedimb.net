<?php declare(strict_types=1);

    if (!isset($modifiedOn) && !isset($pagePath))
        throw new Exception('Copyright component requires modified date or page path');

    $siteYear = trim(SITE_CREATEDYEAR);

    if (isset($modifiedOn))
        $year = $modifiedOn->format('Y');
    else
        $year = date('Y', filectime($pagePath));

    if ($year !== $siteYear)
        $year = $siteYear . '–' . $year;
?>

© <?= $year ?> <?= SITE_AUTHOR ?>