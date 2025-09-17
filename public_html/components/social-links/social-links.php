<?php

require_once 'services/social-link.service.php';

use Services\SocialLinkService;

function socialLinks() {
    $socials = SocialLinkService::getInstance()->getSocialLinks();
    if (count($socials) === 0) return;

    $unsuffixedComponentPath = rtrim(__FILE__, 'php');
    $cssPath = realpath($unsuffixedComponentPath . 'css');
    $jsPath = realpath($unsuffixedComponentPath . 'js')
        ? substr($unsuffixedComponentPath, strlen(getcwd())) . 'js'
        : false;

    echo $cssPath ? '<style type="text/css">' . file_get_contents($cssPath) . '</style>' : null;
    echo $jsPath ? '<script src="'. $jsPath . '" defer></script>' : null;

    echo '<svg class="hidden" xmlns="http://www.w3.org/2000/svg">';
    foreach($socials as $social) {
        /** @var SocialLink $social */
        try {
            $symbol = <<<HTML
                <symbol
                    id="svg-social-link-{$social->id}"
                    width="2rem"
                    height="2rem"
                    viewBox="{$social->svgViewBox}"
                    fill="inherit">
            HTML;

            $content = $social->svgContent;

            echo $symbol . $content . '</symbol>';
        }
        catch (Exception) {
            continue;
        }
    }
    echo '</svg>';

    foreach($socials as $social) {
        /** @var SocialLink $social */
        try {
            echo <<<HTML
                <a href="{$social->url}" title="{$social->description}" target="_blank" class="social-link"
                    aria-label="Social link to {$social->description}">
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