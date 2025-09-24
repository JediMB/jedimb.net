<?php declare(strict_types=1);

require_once 'services/navigation.service.php';
require_once 'utilities/menu-link.utility.php';

use Models\MenuItem;
use Services\NavigationService;
use Utilities\MenuLink;

function mainMenu() {
    $unsuffixedComponentPath = rtrim(__FILE__, 'php');
    $cssPath = realpath($unsuffixedComponentPath . 'css');
    $jsPath = realpath($unsuffixedComponentPath . 'js')
        ? substr($unsuffixedComponentPath, strlen(getcwd())) . 'js'
        : false;

    echo $cssPath ? '<style type="text/css">' . file_get_contents($cssPath) . '</style>' : null;
    echo $jsPath ? '<script src="'. $jsPath . '" defer></script>' : null;

    echo <<<HTML
        <nav id="menu">
            <ul class="flex gap-2 flex-wrap justify-end">
    HTML;

    foreach (NavigationService::getInstance()->menu as $id => $item) {
        /** @var MenuItem $item */
        $onClick = null;
        $onKeyDown = null;

        if (count($item->children) > 0) {
            $jsFunction = "toggleSubMenu($id, this)";
            $onClick = MenuLink::onClick($jsFunction);
            $onKeyDown = MenuLink::onReturnKey($jsFunction);
        }
        else {
            $onClick = MenuLink::onClick($item->path, true);
        }

        echo <<<HTML
            <li>
                <a id="menu-button-{$id}" tabindex="0" class="btn btn-menu" $onClick $onKeyDown>
                    {$item->title}
                </a>
            </li>
        HTML;
    }

    echo <<<HTML
            </ul>
        </nav>
    HTML;
}

function subMenu() {
    echo <<<HTML
        <nav id="sub-menu" class="p-4">
    HTML;

    foreach (NavigationService::getInstance()->menu as $id => $item) {
        /** @var MenuItem $item */

        if (count($item->children) < 1)
            continue;

        echo <<<HTML
            <ul id="submenu-$id" class="list-cards hidden"> <!-- hidden -->
        HTML;

        foreach ($item->children as $subId => $subItem) {
            /** @var MenuItem $subItem */
            $animationDelay = ($subId * 200) . 'ms';
            $onClick = MenuLink::onClick($subItem->path, true);

            echo <<<HTML
                <li class="card" style="--animation-delay: $animationDelay;">
                    <a tabindex="0" class="card-inner" $onClick>
                        <div class="card-front">{$subItem->title}</div>
            HTML;
            
            // if (isset($submenuItem['description'])) {

            //     echo <<<HTML
            //         <div class="card-back">{$submenuItem['description']}</div>
            //     HTML;
            // }

            echo <<<HTML
                    </a>
                </li>
            HTML;
        }
        
        echo "</ul>";
    }

    echo <<<HTML
        </nav>
    HTML;
}

?>