<?php declare(strict_types=1) ?>

<?php

require_once 'components/navigation-menu/navigation-menu.php';
require_once 'components/mobile-menu/mobile-menu.php';
require_once 'components/social-links/social-links.php';
require_once 'services/attributes.php';

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
    <title><?= Configuration::getInstance()->pageTitle ?></title>
    
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <link rel="icon" type="image/x-icon" href="/favicon.svg" />
    <?php
    
    $cssPath = 'css/style.css';
    $realPath = realpath($cssPath);
    $cssPath = '/' . (
        $realPath
        ? $cssPath . '?rev=' . date('ymdHi', filectime($realPath))
        : $cssPath
    );

    echo <<<HTML
        <link href="{$cssPath}" rel="stylesheet" />
    HTML;
    
    ?>
    <script type="text/javascript" src="/js/purify.min.js"></script>
    <script type="module" src="/js/mastodon-comments.js"></script>
</head>
<body>
    <header>
        <header-container>
            <header-links>
                <home-wrapper>
                    <a href="/" aria-label="Home button">
                        <svg xmlns="http://www.w3.org/2000/svg" width="2rem" height="2rem" viewBox="-2 -0.5 100 100" fill="white">
                            <path d="M44.2518 35.9985C46.4431 34.2455 49.5569 34.2455 51.7482 35.9985L84.6025 62.282C86.6291 63.9033 87.3836 66.6438 86.4723 69.0739L77.46 93.1067C76.5818 95.4486 74.3431 97 71.842 97H64C60.6863 97 58 94.3137 58 91V82.0957C58 78.9343 56.3413 76.0048 53.6305 74.3783L53.145 74.087C49.9781 72.1869 46.0219 72.1869 42.855 74.087L42.3695 74.3783C39.6587 76.0048 38 78.9343 38 82.0957V91C38 94.3137 35.3137 97 32 97H24.158C21.6569 97 19.4182 95.4486 18.54 93.1067L9.52772 69.0739C8.61643 66.6438 9.3709 63.9033 11.3975 62.282L44.2518 35.9985Z" fill="inherit"/>
                            <path d="M43.0024 3.99805C45.9242 1.66065 50.0758 1.66065 52.9976 3.99805L93.1866 36.1493C94.9648 37.5719 96 39.7257 96 42.0029V42.0029C96 48.2887 88.7291 51.7832 83.8207 47.8566L52.9976 23.198C50.0758 20.8607 45.9242 20.8606 43.0024 23.198L12.1793 47.8566C7.27094 51.7832 0 48.2887 0 42.0029V42.0029C0 39.7257 1.03517 37.5719 2.81341 36.1493L43.0024 3.99805Z" fill="inherit"/>
                        </svg>
                    </a>
                </home-wrapper>
                <social-container>
                    <?php socialLinks() ?>
                </social-container>
            </header-links>
            <menu-container>
                <desktop-title>
                    <h1><a href="/"><?= SITE_TITLE ?></a></h1>
                    <!-- <img src="images/logo.svg"> -->
                    <div class="tagline">Cool tagline goes here. In theory.</div>
                </desktop-title>

                <mobile-title>
                    <h1><?= SITE_TITLE ?></h1>
                </mobile-title>

                <mobile-menu>
                    <?php mobileMenu($menu) ?>
                </mobile-menu>
                
                <desktop-menu>
                    <?php mainMenu($menu) ?>
                </desktop-menu>
            </menu-container>
        </header-container>
        <sub-menu>
            <?php subMenu($menu) ?>
        </sub-menu>
    </header>
    
    <content-container>
        <?= $config->pageContent ?>
    </content-container>

    <footer>
        <?= printCopyrightYear() ?>
        <br/>
        Made in PHP, HTML, CSS and JavaScript, with Visual Studio Code, Tailwind and PHP Intelephense.
    </footer>
</body>
</html>