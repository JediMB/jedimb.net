<?php declare(strict_types=1);

namespace Utilities;

class Component {
    private static array $components;

    static function renderCSS(string $componentFile) {
        $fileType = 'css';

        if (isset(static::$components[$componentFile][$fileType]))
            return;

        if ( ($filePath = realpath(rtrim($componentFile, 'php') . $fileType)) ) {
            $fileContents = file_get_contents($filePath);
            echo '<style type="text/css">' . $fileContents . '</style>';
        }
        
        static::$components[$componentFile][$fileType] = !!$filePath;
    }

    static function queueJS(string $componentFile) {
        $fileType = 'js';

        if (isset(static::$components[$componentFile][$fileType]))
            return;

        if ( ($filePath = realpath(rtrim($componentFile, 'php') . $fileType)) )
            static::$components[$componentFile][$fileType] = file_get_contents($filePath);
        else
            static::$components[$componentFile][$fileType] = false;
    }

    static function renderQueuedJS() {
        $fileType = 'js';

        foreach (static::$components as $component) {
            if (isset($component[$fileType]) && $component[$fileType])
                echo <<<HTML
                    <script>
                        $component[$fileType]
                    </script>
                HTML;
        }
    }
}

?>