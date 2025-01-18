<?php
    function mainMenu(?array $menu) {
        if (!$menu) return;

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

        for ($menuId = 0; $menuId < count($menu); $menuId++) {
            $menuItem = $menu[$menuId];
            $onClick = null;
            $onKeyDown = null;

            if (isset($menuItem->title) == false)
                continue;

            if (isset($menuItem->submenu) && is_array($menuItem->submenu)) {
                $onClick = onClick('toggleSubMenu(' . $menuId . ', this)');
                $onKeyDown = onReturnKey('toggleSubMenu(' . $menuId . ', this)');
            }

            else if (isset($menuItem->url))
                $onClick = onClick($menuItem->url, true);

            echo <<<HTML
                <li>
                    <a id="menu-button-{$menuId}" tabindex="0" class="btn btn-menu" $onClick $onKeyDown>
                        $menuItem->title
                    </a>
                </li>
            HTML;
        }

        echo <<<HTML
                </ul>
            </nav>
        HTML;
    }

    function subMenu(array $menu) {
        echo <<<HTML
            <nav id="sub-menu" class="p-4">
        HTML;

        if ($menu)
            for ($menuId = 0; $menuId < count($menu); $menuId++) {
                $menuItem = $menu[$menuId];

                if (isset($menuItem->submenu) == false || is_array($menuItem->submenu) == false)
                    continue;

                $submenu = array_values(array_filter($menuItem->submenu, function ($item) {
                    return isset($item->title);
                }));

                echo <<<HTML
                    <ul id="submenu-$menuId" class="list-cards hidden"> <!-- hidden -->
                HTML;

                for ($i = 0; $i < count($submenu); $i++) {
                    $submenuItem = $submenu[$i];

                    $animationDelay = ($i * 200) . 'ms';
                    $onClick = isset($submenuItem->url) ? onClick($submenuItem->url, true) : null;

                    echo <<<HTML
                        <li class="card" style="--animation-delay: $animationDelay;">
                            <a tabindex="0" class="card-inner" $onClick>
                                <div class="card-front">{$submenuItem->title}</div>
                    HTML;
                    
                    if (isset($submenuItem->description)) {

                        echo <<<HTML
                            <div class="card-back">{$submenuItem->description}</div>
                        HTML;
                    }
                    echo <<<HTML
                            </a>
                        </li>
                    HTML;
                }

                echo '</ul>';
            }

        echo <<<HTML
            </nav>
        HTML;
    }
?>