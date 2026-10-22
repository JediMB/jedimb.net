<?php declare(strict_types=1);

namespace App\Utils;

use Error;

class PrintText {
    public static function toLog(string $value, string $filename = 'temp.log', bool $appendMode = true) {
        if (!preg_match('/^\w[\w\.]*$/', $filename))
            throw new Error("Disallowed filename requested: $filename");

        $filepath = PATH_LOG_DIR . DIRECTORY_SEPARATOR . ($filename ?: 'temp.log');

        if (!realpath(PATH_LOG_DIR))
            mkdir(PATH_LOG_DIR, 0777, true);

        $stream = fopen($filepath, $appendMode ? 'a' : 'w')
            ?: throw new Error("Log file could not be acquired or created: $filepath");
        
        fwrite($stream, date('Y-m-d H:i:s') . "    $value\n");
        fclose($stream);
    }
}