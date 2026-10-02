<?php declare(strict_types=1);

namespace App\Utils;

class Asset {
    static function addRevisionQuery(string $assetPath) : string {
        $realPath = realpath($assetPath);

        if (!$realPath)
            return "/$assetPath?assetNotFound";

        return "/$assetPath?rev=" . date("YmdHi", filectime($realPath));
    }
}