<?php
    
    $realPath = realpath($cssPath);

    $cssPath = "/$cssPath";

    if ($realPath)
        $cssPath = "$cssPath?rev=" . date('ymdHi', filectime($realPath));
?>

<link href="<?= $cssPath ?>" rel="stylesheet" />