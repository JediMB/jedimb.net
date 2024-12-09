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

                                if (property_exists($menuItem, "title") == false)
                                    continue;

                                $url = property_exists($menuItem, "url") ? $menuItem->url : null;
                                
                                $mouseOverJS = property_exists($menuItem, "submenu") && is_array($menuItem->submenu)
                                    ? 'openSubMenu(' . $menuId . ', this)'
                                    : null;

                                echo '<li>';
                                echo '<a id="menu-button-' . $menuId .'" class="btn btn-menu"' . onClick($url, true) . onMouseOver($mouseOverJS) . '>'
                                        . $menuItem->title
                                    . '</a>';
                                echo '</li>';
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

                        if (property_exists($menuItem, "submenu") == false || is_array($menuItem->submenu) == false)
                            continue;

                        $submenu = $menuItem->submenu;

                        echo '<ul id="submenu-' . $menuId . '" class="list-cards hidden">';

                        for ($i = 0; $i < count($submenu); $i++) {
                            if (property_exists($submenu[$i], "title") == false)
                                continue;

                            echo '<li style="--animation-delay: '. $i * 200 . 'ms;">';
                            echo $submenu[$i]->title;
                            echo '</li>';
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