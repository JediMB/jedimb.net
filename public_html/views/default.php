<?php declare(strict_types=1) ?>

<?php
    require_once './utilities/attributes.php';
    require_once './components/menu-data.php';

    $menu = menuData();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= $GLOBALS['page_title'] ?></title>
    
    <link rel="icon" type="image/x-icon" href="favicon.png" />
    <link href="/css/style.css" rel="stylesheet" />
</head>
<body>
    <header>
        <div class="grid grid-cols-2 bg-gradient-to-br px-16 py-8 rounded-b-2xl" style="--tw-gradient-stops: #111 0 15%, #333;">
            <h1>Under Construction</h1>
            <nav id="menu">
                <ul class="flex gap-2 flex-wrap justify-end">
                    <?php
                        if ($menu)
                            for ($menuId = 0; $menuId < count($menu); $menuId++) {
                                $menuItem = $menu[$menuId];

                                if (isset($menuItem->title) == false)
                                    continue;

                                if (isset($menuItem->submenu) && is_array($menuItem->submenu))
                                    $onClick = onClick('openSubMenu(' . $menuId . ', this)');

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
                    ?>
                </ul>
            </nav>
        </div>
        <nav id="sub-menu" class="p-4">
            <?php
                if ($menu)
                    for ($menuId = 0; $menuId < count($menu); $menuId++) {
                        $menuItem = $menu[$menuId];

                        if (isset($menuItem->submenu) == false || is_array($menuItem->submenu) == false)
                            continue;

                        $submenu = array_values(array_filter($menuItem->submenu, function ($item) {
                            return isset($item->title);
                        }));

                        echo <<<HTML
                            <ul id="submenu-$menuId" class="list-cards hidden" style="--items-per-row: $itemsPerRow"> <!-- hidden -->
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
            ?>
        </nav>
        
        <script>
            const menuButtons = Array.from(document.querySelectorAll('[id^="menu-button-"]'));
            const subMenus = Array.from(document.querySelectorAll('[id^="submenu-"]'));
            let activeSubmenuId = -1;

            subMenus.forEach(submenu => {
                submenu.addEventListener('animationend', (event) => {
                    const animationName = event.animationName;

                    switch (animationName) {
                        case 'hide-menu':
                            event.target.classList.add('hidden');
                            event.target.classList.remove('hide-menu');

                            const submenuToOpen =  subMenus.find(submenu => submenu.id === `submenu-${activeSubmenuId}`);

                            submenuToOpen.classList.add('show-menu');
                            submenuToOpen.classList.remove('hidden');
                            break;

                        case 'show-menu':
                            event.target.classList.remove('show-menu');
                            break;

                        default:
                            event.stopPropagation();
                            break;
                    }

                });
            });

            function openSubMenu(id, btn) {
                if (isNaN(id) || id === activeSubmenuId) return;

                activeSubmenuId = id;

                menuButtons.forEach(menuBtn => menuBtn.classList.remove('selected'));
                btn.classList.add('selected');

                const submenusToClose = subMenus.filter(
                    submenu => submenu.id !== `submenu-${id}`
                    && submenu.classList.contains('hidden') == false
                    && submenu.classList.contains('hide-menu') == false
                );

                if (submenusToClose.length > 0) {
                    submenusToClose.forEach(submenu => submenu.classList.add('hide-menu'));
                    return;
                }

                const submenuToOpen = subMenus.find(submenu => submenu.id === `submenu-${activeSubmenuId}`);
                submenuToOpen.classList.add('show-menu');
                submenuToOpen.classList.remove('hidden');
            }
        </script>
    </header>
    <main>
        <?= $GLOBALS['page_content'] ?>
    </main>
</body>
</html>