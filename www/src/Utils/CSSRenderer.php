<?php declare(strict_types=1);

namespace App\Utils;

class CSSRenderer {
    /** @var string[] $css */
    private static array $css = [];

    static function add(string $component, string $css) : bool {
        if (isset(static::$css[$component]))
            return false;

        static::$css[$component] = $css;

        return true;
    }

    static function get(?string $component = null) : string|false {
        if (empty($component))
            return implode("\n", static::$css);
        
        if (!isset(static::$css[$component]))
            return false;

        return static::$css[$component];
    }

    static function has(string $component) : bool {
        return isset(static::$css[$component]);
    }
}