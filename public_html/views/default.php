<?php declare(strict_types=1) ?>

<?php
    require_once './components/navigation-menu.php';
    require_once './utilities/attributes.php';

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
        <div class="grid grid-cols-2 bg-gradient-to-br px-16 py-8 rounded-b-2xl" style="--tw-gradient-stops: #111 0 15%, #333;">
            <div>
                <h1>Under Construction</h1>
                <p>No responsive/mobile view yet</p>
            </div>
            
            <?php mainMenu($menu) ?>
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