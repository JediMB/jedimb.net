<?php declare(strict_types=1);

namespace Utilities;

require_once 'models/component-options.model.php';

use Exception;
use Models\ComponentOptions;


class Component {
    private static array $components = [];
    private static array $optionsStack = [];

    static function include(string $component, array $variables = [], bool $returnResult = false) {
        if (!empty(static::$components[$component]['renderOnce']))
            throw new Exception('Trying to render a renderOnce component more than once.');

        if ( !($realPath = static::findPath($component)) ) {
            echo "Can't find component: $component.";
            return;
        }

        static::$optionsStack[] = new ComponentOptions();

        extract($variables);

        ob_start();
        include $realPath;
        $output = ob_get_clean();

        /** @var ComponentOptions $options */
        $options = array_pop(static::$optionsStack);

        if ($options->renderOnce)
            static::$components[$component]['renderOnce'] = true;

        if ($options->componentTag) {
            $componentTag = basename($realPath, '.php') . "-component";

            $attr = $options->hidden ? ' style="display: none;"' : null;

            if (!empty($attributes)) {
                foreach (array_reverse($attributes, true) as $attrName => $attrValue) {
                    $attr = " $attrName=\"$attrValue\"" . $attr;
                }
            }


            $output = "<$componentTag" . $attr . ">$output</$componentTag>";
        }

        $includeType = 'css';
        if ($options->includeCSS && empty(static::$components[$component][$includeType])) {
            static::$components[$component][$includeType] = true;

            if ( ($cssPath = realpath(rtrim($realPath, 'php') . $includeType)) ) {
                $cssContents = file_get_contents($cssPath);
                $output = "<style type=\"text/css\">$cssContents</style>" . $output;
            }
        }

        $includeType = 'module.js';
        if ($options->includeJSModule && empty(static::$components[$component][$includeType])) {
            static::$components[$component][$includeType] = true;

            if ( ($jsPath = realpath(rtrim($realPath, 'php') . $includeType)) ) {
                $jsPath = str_replace(
                    getcwd() . DIRECTORY_SEPARATOR . PATH_COMPONENTS_DIR,
                    DIRECTORY_SEPARATOR . PATH_COMPONENT_MODULE_DIR_ALIAS,
                    $jsPath
                );
                $output = <<<HTML
                    <script type="module" src="{$jsPath}"></script>
                    $output
                HTML;
            }
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

    static function noContainer() {
        static::$optionsStack[count(static::$optionsStack) - 1]->componentTag = false;
    }

    static function hide() {
        static::$optionsStack[count(static::$optionsStack) - 1]->hidden = true;
    }

    static function renderOnce() {
        static::$optionsStack[count(static::$optionsStack) - 1]->renderOnce = true;
    }

    static function renderCSS() {
        static::$optionsStack[count(static::$optionsStack) - 1]->includeCSS = true;
    }

    static function addJSModule() {
        static::$optionsStack[count(static::$optionsStack) - 1]->includeJSModule = true;
    }

    static function queueJS(string $componentPath, string $type = 'text/javascript') {
        $fileType = 'js';
        $componentKey = static::relativeComponentPath($componentPath);

        if (isset(static::$components[$componentKey][$fileType]))
            return;

        if ( ($filePath = realpath(rtrim($componentPath, 'php') . $fileType)) ) {
            $content = file_get_contents($filePath);
            static::$components[$componentKey][$fileType] = [
                'content' => $content,
                'type' => $type
            ];
        }
        else
            static::$components[$componentKey][$fileType] = false;
    }

    static function renderQueuedJS() {
        $fileType = 'js';

        foreach (static::$components as $component) {
            if (!empty($component[$fileType]))
                echo <<<HTML
                    <script type="{$component[$fileType]['type']}">
                        {$component[$fileType]['content']}
                    </script>
                HTML;
        }
    }

    private static function relativeComponentPath(string $realPath) {
        return ltrim(str_replace(realpath('components/'), '', $realPath), '/');
    }
}

?>