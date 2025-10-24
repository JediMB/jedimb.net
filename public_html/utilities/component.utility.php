<?php declare(strict_types=1);

namespace Utilities;

use Exception;

class Component {
    private static array $components = [];

    static function include(string $component, array $variables = [], bool $returnResult = false) {
        if (!empty(static::$components[$component]['renderOnce']))
            throw new Exception('Trying to render a renderOnce component more than once.');

        if ( !($realPath = static::findPath($component)) )
            echo "Can't find component: $component.";

        extract($variables);
        $noContainer ??= false;

        ob_start();
        include $realPath;
        $output = ob_get_clean();

        if (!$noContainer) {
            $componentTag = basename($realPath, '.php') . "-component";
            $output = "<$componentTag>$output</$componentTag>";
        }

        if ($returnResult)
            return $output;

        echo $output;
    }

    private static function findPath($component) : string|false {
        if ( ($path = realpath("components/$component.php")) )
            return $path;

        if ( ($path = realpath("components/$component/$component.php")) )
            return $path;

        if ( !($filenamePos = strripos($component, '/')) )
            return false;
        
        $filename = substr($component, $filenamePos);
        if ( ($path = realpath('components/' . $component . $filename . '.php')) )
            return $path;

        return false;
    }

    static function renderOnce(string $componentPath) {
        $componentKey = static::relativeComponentPath($componentPath);

        if (!empty(static::$components[$componentKey]['renderOnce']))
            throw new Exception('Trying to set a renderOnce component to renderOnce twice.');
        
        static::$components[$componentKey]['renderOnce'] = true;
    }

    static function renderCSS(string $componentPath) {
        $fileType = 'css';
        $componentKey = static::relativeComponentPath($componentPath);

        if (isset(static::$components[$componentKey][$fileType]))
            return;

        if ( ($filePath = realpath(rtrim($componentPath, 'php') . $fileType)) ) {
            $fileContents = file_get_contents($filePath);
            echo '<style type="text/css">' . $fileContents . '</style>';
        }
        
        static::$components[$componentKey][$fileType] = !!$filePath;
    }

    static function addJSModule(string $componentPath) {
        $fileType = 'module.js';
        $componentKey = static::relativeComponentPath($componentPath);

        if (isset(static::$components[$componentKey][$fileType]))
            return;

        if ( ($filePath = realpath(rtrim($componentPath, 'php') . $fileType)) ) {
            $filePath = str_replace(
                getcwd() . DIRECTORY_SEPARATOR . PATH_COMPONENTS_DIR,
                DIRECTORY_SEPARATOR . PATH_COMPONENT_MODULE_DIR_ALIAS,
                $filePath
            );
            echo <<<HTML
                <script type="module" src="{$filePath}"></script>
            HTML;
        }
        
        static::$components[$componentKey][$fileType] = !!$filePath;
    }

    static function queueJS(string $componentPath) {
        $fileType = 'js';
        $componentKey = static::relativeComponentPath($componentPath);

        if (isset(static::$components[$componentKey][$fileType]))
            return;

        if ( ($filePath = realpath(rtrim($componentPath, 'php') . $fileType)) )
            static::$components[$componentKey][$fileType] = file_get_contents($filePath);
        else
            static::$components[$componentKey][$fileType] = false;
    }

    static function renderQueuedJS() {
        $fileType = 'js';

        foreach (static::$components as $component) {
            if (isset($component[$fileType]) && $component[$fileType])
                echo <<<HTML
                    <script type="module">
                        $component[$fileType]
                    </script>
                HTML;
        }
    }

    private static function relativeComponentPath(string $realPath) {
        return ltrim(str_replace(realpath('components/'), '', $realPath), '/');
    }
}

?>