<?php declare(strict_types=1);

namespace Components;

use Exception;

if (!isset($cssPath))
    throw new Exception('CSS Revision Link component requires cssPath variable');

$realPath = realpath($cssPath);

$cssPath = "/$cssPath";

if ($realPath)
    $cssPath = "$cssPath?rev=" . date('ymdHi', filectime($realPath));

?>

<link href="<?= $cssPath ?>" rel="stylesheet" />