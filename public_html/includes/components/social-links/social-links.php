<?php

function socialLinks(?array $socials) {
    if (!$socials) return;

    $unsuffixedComponentPath = rtrim(__FILE__, 'php');
    $cssPath = realpath($unsuffixedComponentPath . 'css');
    $jsPath = realpath($unsuffixedComponentPath . 'js')
        ? substr($unsuffixedComponentPath, strlen(getcwd())) . 'js'
        : false;

    echo $cssPath ? '<style type="text/css">' . file_get_contents($cssPath) . '</style>' : null;
    echo $jsPath ? '<script src="'. $jsPath . '" defer></script>' : null;

    echo '<svg class="hidden" xmlns="http://www.w3.org/2000/svg">';
    foreach($socials as $social) {
        try {
            $symbol = <<<HTML
                <symbol
                    id="svg-social-link-{$social->id}"
                    width="2rem"
                    height="2rem"
                    viewBox="{$social->svg->viewBox}"
                    fill="inherit">
            HTML;

            $content = $social->svg->content;

            echo $symbol . $content . '</symbol>';
        }
        catch (Exception) {
            continue;
        }
    }
    echo '</svg>';

    foreach($socials as $social) {
        try {
            echo <<<HTML
                <a href="{$social->url}" title="{$social->title}" target="_blank" class="social-link"
                    aria-label="Social link to {$social->title}">
                    <svg width="2rem" height="2rem">
                        <use xlink:href="#svg-social-link-{$social->id}" href="#svg-social-link-{$social->id}"></use>
                    </svg>
                </a>
            HTML;
        }
        catch (Exception) {
            continue;
        }
    }
}

?>