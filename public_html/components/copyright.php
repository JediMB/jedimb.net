<?php declare(strict_types=1);

    if (!isset($pageDate) && !isset($pagePath))
        throw new Exception('Copyright component requires pageDate or pagePath variable');

    $siteYear = trim(SITE_CREATEDYEAR);

    if (isset($pageDate))
        $year = $pageDate->format('Y');
    else
        $year = date('Y', filectime($pagePath));

    if ($year !== $siteYear)
        $year = $siteYear . '–' . $year;
?>

© <?= $year ?> <?= SITE_AUTHOR ?>