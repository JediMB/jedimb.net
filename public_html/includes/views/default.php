<?php declare(strict_types=1) ?>

<?php
    require_once './includes/components/navigation-menu/navigation-menu.php';
    require_once './includes/components/mobile-menu/mobile-menu.php';
    require_once './includes/components/social-links/social-links.php';
    require_once './includes/utilities/attributes.php';

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
    <header class="relative max-[879px]:sticky max-[879px]:top-0 max-[879px]:mb-4">
        <div class="min-[880px]:rounded-b-2xl min-[880px]:px-10
            max-[879px]:px-2 bg-gradient-to-br from-gray-50/95 from-15% to-gray-200/95 pt-2">
            <div class="flex min-[880px]:justify-between max-[879px]:justify-center gap-2">
                <div class="max-[879px]:hidden">
                    <a href="/">
                        <svg xmlns="http://www.w3.org/2000/svg" width="2rem" height="2rem" viewBox="-2 -0.5 100 100" fill="white">
                            <path d="M44.2518 35.9985C46.4431 34.2455 49.5569 34.2455 51.7482 35.9985L84.6025 62.282C86.6291 63.9033 87.3836 66.6438 86.4723 69.0739L77.46 93.1067C76.5818 95.4486 74.3431 97 71.842 97H64C60.6863 97 58 94.3137 58 91V82.0957C58 78.9343 56.3413 76.0048 53.6305 74.3783L53.145 74.087C49.9781 72.1869 46.0219 72.1869 42.855 74.087L42.3695 74.3783C39.6587 76.0048 38 78.9343 38 82.0957V91C38 94.3137 35.3137 97 32 97H24.158C21.6569 97 19.4182 95.4486 18.54 93.1067L9.52772 69.0739C8.61643 66.6438 9.3709 63.9033 11.3975 62.282L44.2518 35.9985Z" fill="inherit"/>
                            <path d="M43.0024 3.99805C45.9242 1.66065 50.0758 1.66065 52.9976 3.99805L93.1866 36.1493C94.9648 37.5719 96 39.7257 96 42.0029V42.0029C96 48.2887 88.7291 51.7832 83.8207 47.8566L52.9976 23.198C50.0758 20.8607 45.9242 20.8606 43.0024 23.198L12.1793 47.8566C7.27094 51.7832 0 48.2887 0 42.0029V42.0029C0 39.7257 1.03517 37.5719 2.81341 36.1493L43.0024 3.99805Z" fill="inherit"/>
                        </svg>
                    </a>
                </div>
                <div class="flex justify-end gap-2">
                    <?php socialLinks($socials) ?>
                </div>
            </div>
            <div class="flex justify-between gap-2 min-[880px]:mt-6">
                <div class="max-[879px]:hidden">
                    <a href="/"><h1><?= $GLOBALS['site_title'] ?></h1></a>
                    <p class="w-fit mt-1 p-1 border-t-2 border-t-hotpink-500/50 italic">Cool tagline goes here. In theory.</p>
                </div>

                <div class="min-[880px]:hidden">
                    <h1><?= $GLOBALS['site_title'] ?></h1>
                </div>

                <div class="min-[880px]:hidden">
                    <?php mobileMenu($menu) ?>
                </div>
                
                <div class="max-[879px]:hidden">
                    <?php mainMenu($menu) ?>
                </div>
            </div>
        </div>
        <div class="max-[879px]:hidden">
            <?php subMenu($menu) ?>
        </div>
    </header>
    
    <div class="min-[880px]:px-2 max-[879px]:px-4">
        <?= $GLOBALS['page_content'] ?>
    </div>

    <footer class="mt-4 px-2 text-center italic">
        <?= printCopyrightYear() ?>
        <br/>
        Made in PHP, HTML, CSS and JavaScript, with Visual Studio Code, Tailwind and PHP Intelephense.
    </footer>
</body>
</html>