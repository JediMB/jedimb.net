<?php
    function mainMenu(array $menu) {
        echo <<<HTML
            <script src="/components/navigation-menu.js" defer></script>
            
            <nav id="menu">
                <ul class="flex gap-2 flex-wrap justify-end">
        HTML;

        if ($menu)
            for ($menuId = 0; $menuId < count($menu); $menuId++) {
                $menuItem = $menu[$menuId];

                if (isset($menuItem->title) == false)
                    continue;

                if (isset($menuItem->submenu) && is_array($menuItem->submenu))
                    $onClick = onClick('toggleSubMenu(' . $menuId . ', this)');

                else if (isset($menuItem->url))
                    $onClick = onClick($menuItem->url, true);

                else $onClick = null;

                echo <<<HTML
                    <li>
                        <a id="menu-button-$menuId" class="btn btn-menu" $onClick>
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

                    echo <<<HTML
                        <li class="card" style="--animation-delay: $animationDelay;">
                            <div class="card-inner">
                                <div class="card-front">{$submenuItem->title}</div>
                    HTML;
                    
                    if (isset($submenuItem->description)) {

                        echo <<<HTML
                            <div class="card-back">{$submenuItem->description}</div>
                        HTML;
                    }
                    echo <<<HTML
                            </div>
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