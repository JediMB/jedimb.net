<?php

function mobileMenu() {
    $unsuffixedComponentPath = rtrim(__FILE__, 'php');
    $cssPath = realpath($unsuffixedComponentPath . 'css');
    $jsPath = realpath($unsuffixedComponentPath . 'js')
        ? substr($unsuffixedComponentPath, strlen(getcwd())) . 'js'
        : false;

    echo $cssPath ? '<style type="text/css">' . file_get_contents($cssPath) . '</style>' : null;
    echo $jsPath ? '<script src="'. $jsPath . '" defer></script>' : null;

    $onClick = onClick('openMobileMenu(event);');

    echo <<<HTML
        <nav id="mobile-menu">

            <button id="mobile-menu-button" {$onClick}>
                <svg width="4rem" height="4rem" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect id="svg-rect-top-blade" width="80" height="14" x="0" y="11" rx="8" fill="white" style="--animation: first-top-blade;" />
                    <rect id="svg-rect-top-hilt" width="30" height="16" x="70" y="10" rx="2" fill="white" style="--animation: first-top-hilt;" />
                    <rect id="svg-rect-mid-blade" width="80" height="14" x="20" y="43" rx="8" fill="white" style="--animation: first-mid-blade;" />
                    <rect id="svg-rect-mid-hilt" width="30" height="16" x="0" y="42" rx="2" fill="white" style="--animation: first-mid-hilt;" />
                    <rect id="svg-rect-low-blade" width="80" height="14" x="0" y="75" rx="8" fill="white" style="--animation: first-low-blade;" />
                    <rect id="svg-rect-low-hilt" width="30" height="16" x="70" y="74" rx="2" fill="white" style="--animation: first-low-hilt;" />
                    <rect id="svg-rect-frame" width="100" height="100" x="0" y="0" fill="transparent" />
                </svg>
            </button>
            
            <ul id="mobile-menu-contents" class="hidden">
                <li><a href="/">Home</a></li>
    HTML;

    foreach (MENU_MAIN as $key => $menuItem) {
        if (isset($menuItem['title']) === false)
            continue;

        if (isset($menuItem['submenu']) && is_array($menuItem['submenu'])) {

            $submenuMarkup = '';
            foreach($menuItem['submenu'] as $submenuItem) {
                if ((isset($submenuItem['title']) && isset($submenuItem['url'])) === false)
                    continue;
                
                $submenuMarkup = $submenuMarkup . <<<HTML
                    <li>
                        <a href="{$submenuItem['url']}">{$submenuItem['title']}</a>
                    </li>
                HTML;
            }

            if(strlen($submenuMarkup) < 10)
                continue;

            $onReturnKey = onReturnKey('this.click();');
            
            echo <<<HTML
                <li>
                    <input id="mobile-menu-entry-{$key}" type="checkbox" class="hidden">
                    <label for="mobile-menu-entry-{$key}" tabindex="0" $onReturnKey>{$menuItem['title']}</label>
                    <ul>
                        $submenuMarkup
                    </ul>
                </li>
            HTML;
        }
        else if (isset($menuItem['url'])) {
            echo <<<HTML
                <li>
                    <a href="{$menuItem['url']}">{$menuItem['title']}</a>
                </li>
            HTML;
        }
    }

    echo <<<HTML
            </ul>
        </nav>
    HTML;
}

?>