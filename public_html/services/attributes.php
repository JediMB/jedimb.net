<?php

function onClick(?string $value, bool $isUrl = false, bool $useHref = true) {
    $prefix = ' onclick="';
    $suffix = ';" ';

    if (!$value)
        return $prefix . 'return false' . $suffix;

    if ($isUrl == false)
        return $prefix . $value . $suffix;

    if ($useHref)
        return ' href="' . $value . '" ';

    return $prefix . "window.location = '" . $value . "'" . $suffix;
}

function onReturnKey(?string $value, bool $isUrl = false) {
    $prefix = ' onkeydown="';
    $suffix = ';" ';

    if (!$value)
        return $prefix . 'return false' . $suffix;

    $prefix = $prefix . 'if(event?.key === \'Enter\') ';   

    if ($isUrl == false)
        return $prefix . $value . $suffix;

    return $prefix . "window.location = '" . $value . "'" . $suffix;
}

function onMouseOver(?string $value) {
    if (!$value) return null;

    return ' onmouseover="' . $value . ';" ';
}

?>