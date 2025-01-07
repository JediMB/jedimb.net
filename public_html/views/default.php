<?php declare(strict_types=1) ?>

<?php
    require_once './components/navigation-menu/navigation-menu.php';
    require_once './utilities/attributes.php';

    $socials = isset($GLOBALS['configuration']->socials) && is_array($GLOBALS['configuration']->socials)
        ? $GLOBALS['configuration']->socials
        : null;

    $menu = isset($GLOBALS['configuration']->menu) && is_array($GLOBALS['configuration']->menu)
        ? $GLOBALS['configuration']->menu
        : null;
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
        <div class="bg-gradient-to-br from-gray-50/95 from-15% to-gray-200/95 px-16 rounded-b-2xl">
            <div class="flex justify-end">
                <?php
                    foreach($socials as $social) {
                        echo <<<HTML
                            <a href="{$social->url}" title="{$social->title}" target="_blank" style="
                                width: 48px;
                                height: 48px;
                                -webkit-mask: url('/images/social-media/{$social->icon}') no-repeat 50% 50%;
                                mask: url('/images/social-media/{$social->icon}') no-repeat 50% 50%;
                                mask-size: 32px;
                                background-color: white;">&nbsp;</a>
                        HTML;
                    }
                ?>
            </div>
            <div class="grid grid-cols-2 py-8">
                <div>
                    <h1>Under Construction</h1>
                    <p>No responsive/mobile view yet</p>
                </div>
                
                <?php mainMenu($menu) ?>
            </div>
        </div>
        <?php subMenu($menu) ?>
    </header>

    <main>
        <?= $GLOBALS['page_content'] ?>
    </main>

    <footer>

    </footer>
</body>
</html>