<?php declare(strict_types=1) ?>

<?php
    include './utilities/attributes.php';
    include './components/menu-data.php';

    $menu = menuData();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JediMB.net</title>
    
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
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ullamcorper nisl a nisl dictum laoreet. Morbi aliquet facilisis neque. Etiam accumsan erat ex. Nam auctor ipsum nunc, id tristique risus blandit quis. Mauris sed nulla tempus, suscipit enim mattis, dapibus quam. Nunc nulla lectus, aliquam non bibendum non, auctor ut magna. Vestibulum ex ligula, aliquet iaculis commodo at, mattis vitae tortor.</p>
        <p>Maecenas in iaculis felis, quis viverra metus. Sed vulputate, tellus eget convallis elementum, ipsum augue sagittis nisl, et sodales lectus urna non erat. Donec vehicula pulvinar turpis, eu rutrum sapien hendrerit vel. Sed felis tortor, commodo eget rutrum eu, commodo varius magna. Cras accumsan, velit sed elementum dignissim, ipsum neque eleifend sapien, non ornare orci dolor eget felis. Duis ut pretium libero, a pharetra justo. Nam at sapien quis ante feugiat facilisis a tristique augue. Vivamus hendrerit diam sapien, eu vehicula turpis tempus ac. Morbi in dapibus mauris. Quisque sapien arcu, eleifend et massa at, interdum dapibus turpis. Cras tellus nulla, varius id purus eu, vehicula molestie ipsum. Donec nec iaculis nunc, placerat porta justo. Fusce a odio vitae justo varius dictum. Curabitur a sollicitudin metus, sit amet varius nulla.</p>
        <p>Nulla facilisi. Praesent fermentum porttitor urna, nec euismod orci imperdiet eget. Nam odio nunc, accumsan vitae leo et, condimentum eleifend lorem. Aenean varius ante et auctor mollis. Quisque ultricies turpis scelerisque lorem condimentum volutpat. Sed vel massa ornare, egestas nulla nec, sollicitudin massa. Cras quis aliquet nisi.</p>
        <p>Suspendisse cursus, dolor ut volutpat consequat, neque justo iaculis quam, vitae gravida ex dui non erat. Morbi rhoncus ligula lectus, et egestas ex efficitur ac. Aliquam elementum odio sit amet maximus posuere. Vivamus quis blandit tortor. Quisque ipsum turpis, consequat at fermentum eget, tempus eu risus. Integer luctus leo at lacinia fermentum. Nullam viverra velit et felis congue, non pharetra diam fermentum. Vestibulum fermentum imperdiet orci in rutrum. Donec quis dignissim diam. Praesent ex purus, pretium in erat sit amet, semper euismod felis. Donec elementum porttitor est, ac faucibus dui pharetra a. Nullam rhoncus egestas ligula, eu blandit magna dictum in. Maecenas congue ex eu tellus feugiat vehicula. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.</p>
        <p>Nulla sed erat laoreet, porta neque nec, faucibus erat. Proin sed dolor odio. Maecenas blandit convallis arcu vulputate malesuada. Etiam nulla ligula, tempor sit amet pretium ut, ornare a ante. Duis lorem magna, dictum nec finibus quis, luctus sed lorem. Cras gravida ut mauris ac semper. Suspendisse in ipsum fermentum, elementum nibh sed, egestas lectus. Aliquam erat volutpat. Curabitur a turpis luctus, interdum massa tincidunt, bibendum tortor. Sed bibendum scelerisque urna, sed faucibus dolor fringilla in. Curabitur at tempus felis. </p>
    </main>
</body>
</html>