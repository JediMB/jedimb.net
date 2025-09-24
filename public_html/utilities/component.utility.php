<?php declare(strict_types=1);

namespace Utilities;

class Component {
    private static array $components;

    static function renderCSS(string $componentFile) {
        $fileType = 'css';

        if (isset(static::$components[$componentFile][$fileType]))
            return;

        static::$components[$componentFile][$fileType] = true;

        if ( ($filePath = realpath(rtrim($componentFile, 'php') . $fileType)) ) {
            $fileContents = file_get_contents($filePath);
            echo '<style type="text/css">' . $fileContents . '</style>';
        }
    }

    static function renderJS(string $componentFile) {
        $fileType = 'js';

        if (isset(static::$components[$componentFile][$fileType]))
            return;

        static::$components[$componentFile][$fileType] = true;

        if ( ($filePath = realpath(rtrim($componentFile, 'php') . $fileType)) ) {
            $fileContents = file_get_contents($filePath);
            echo <<<HTML
                <script>
                    $fileContents
                </script>
            HTML;
        }
    }
}

?>