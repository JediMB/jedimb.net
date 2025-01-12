<?php declare(strict_types=1) ?>

<?php
    require_once './components/navigation-menu/navigation-menu.php';
    require_once './components/social-links/social-links.php';
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
        <div class="bg-gradient-to-br from-gray-50/95 from-15% to-gray-200/95 px-16 pt-2 rounded-b-2xl">
            <div class="flex justify-end gap-2">
                <?php socialLinks($socials) ?>
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
        <!--
            Check for:
                anthropic-ai
                Claude-Web
                Applebot-Extended
                Bytespider
                CCBot
                ChatGPT-User
                cohere-ai
                Diffbot
                FacebookBot
                GoogleOther
                Google-Extended
                GPTBot
                ImagesiftBot
                PerplexityBot
                OmigiliBot
                Omigili
         -->
        <p><?= $_SERVER['HTTP_USER_AGENT'] ?></p>
        <br />
        <?= $GLOBALS['page_content'] ?>
    </main>

    <footer>

    </footer>
</body>
</html>