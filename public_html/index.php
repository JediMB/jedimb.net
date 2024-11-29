<?php declare(strict_types=1) ?>

<?php
    include './utilities/attributes.php';
    include './components/menu-data.php';
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
        <script defer>
            function openSubMenu(id) {
                if (isNaN(id)) return;

                //window.alert(id);

            }
        </script>

        <div class="bg-gradient-to-br px-16 py-8 rounded-b-2xl" style="--tw-gradient-stops: #111 0 15%, #333;">
            <nav id="menu">
                <ul class="flex gap-2 justify-end">
                    <?php
                        if ($menu = menuData())
                            for ($menuId = 0; $menuId < count($menu); $menuId++) {
                                $menuItem = $menu[$menuId];

                                if (property_exists($menuItem, "title") == false)
                                    continue;

                                $url = property_exists($menuItem, "url") ? $menuItem->url : null;
                                
                                $mouseOverJS = property_exists($menuItem, "submenu") && is_array($menuItem->submenu)
                                    ? 'openSubMenu(' . $menuId . ')'
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
                    foreach ($menu as $menuItem) {
                        if (property_exists($menuItem, "submenu") == false || is_array($menuItem->submenu) == false)
                            continue;

                        $submenu = $menuItem->submenu;

                        echo '<ul class="flex gap-2 justify-center flex-wrap list-cards">';

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