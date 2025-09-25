<?php declare(strict_types=1);

namespace Utilities;

class MenuLink {
    static function onClick(?string $value, bool $isUrl = false, bool $useHref = true) {
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

    static function onReturnKey(?string $value, bool $isUrl = false) {
        $prefix = ' onkeydown="';
        $suffix = ';" ';

        if (!$value)
            return $prefix . 'return false' . $suffix;

        $prefix = $prefix . 'if(event?.key === \'Enter\') ';   

        if ($isUrl == false)
            return $prefix . $value . $suffix;

        return $prefix . "window.location = '" . $value . "'" . $suffix;
    }
}

?>