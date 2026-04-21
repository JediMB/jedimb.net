<?php declare(strict_types=1);

namespace Components;

use Exception;

if (!isset($pageDate) && !isset($pagePath))
    throw new Exception('Copyright component requires pageDate or pagePath variable');
if (!isset($siteAuthor))
    throw new Exception('Copyright component requires siteAuthor variable');

$siteYear = trim(SITE_CREATEDYEAR);

if (isset($pageDate))
    $year = $pageDate->format('Y');
else
    $year = date('Y', filectime($pagePath));

if ($year !== $siteYear)
    $year = $siteYear . '&ndash;' . $year;

?>

© <?= $year ?> <?= $siteAuthor ?>