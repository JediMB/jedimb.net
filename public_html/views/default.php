<?php declare(strict_types=1);

namespace Views;

require_once 'services/configuration.service.php';
require_once 'utilities/component.utility.php';

use Enums\PageType;
use Services\ConfigurationService;
use Utilities\Component;

$config = ConfigurationService::getInstance(); /** @var ConfigurationService $config */
extract($config->getUserConstants([
    'SITE_TITLE', 'SITE_TAGLINE', 'SITE_AUTHOR',
    'META_DESCRIPTION', 'META_KEYWORDS'
]));

$links = !empty($links);

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <meta name="author" content="<?= $site_author ?>">
    <meta name="description" content="<?= $meta_description ?>">
    <meta name="keywords" content="<?= $meta_keywords ?>">
    
    <meta name="constants" content="<?= htmlspecialchars(json_encode(META_CONSTANTS)) ?>">

    <title><?= empty($title) ? $site_title : "$title &ndash; ". $site_title ?></title>
    
    <?php Component::include('css-revision-link', [ 'cssPath' => PATH_CSS_DEFAULT ]) ?>

    <link rel="icon" type="image/x-icon" href="/favicon.svg" />
    
    <script type="text/javascript" src="/js/purify.min.js"></script>
    <script type="module" src="/js/default.js"></script>
</head>
<body>
    <header>
        <header-container>
            <account-container>
                <?php Component::include('account-menu') ?>
            </account-container>
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
                    <?php Component::include('social-links') ?>
                </social-container>
            </header-links>
            <menu-container>
                <desktop-title>
                    <h1><a href="/"><?= $site_title ?></a></h1>
                    <!-- <img src="images/logo.svg"> -->
                    <div class="tagline"><?= $site_tagline ?></div>
                </desktop-title>

                <mobile-title>
                    <h1><?= $site_title ?></h1>
                </mobile-title>

                <mobile-menu>
                    <?php Component::include('mobile-menu') ?>
                </mobile-menu>
                
                <desktop-menu>
                    <?php Component::include('main-menu') ?>
                </desktop-menu>
            </menu-container>
        </header-container>
        <sub-menu>
            <?php Component::include('sub-menu') ?>
        </sub-menu>
    </header>
    
    <content-container class="mb-3 <?= $links ? 'grid-cols-sidebar-right' : null ?>">
        <main>
            <?php if (!empty($title)): ?>
                <h2><?= $title ?></h2>
            <?php endif ?>
            <?php if ($pageType === PageType::BlogPost): ?>
                <div><?php Component::include('created-modified-dates', [
                    'createdOn' => $createdOn,
                    'modifiedOn' => $modifiedOn
                ]) ?></div>
            <?php endif ?>
            <div><?= $content ?></div>
        </main>
        <?php if ($links): ?>
            <aside class="links max-md:bg-hotpink-950 max-md:p-2 max-md:rounded-lg">
                <?php Component::include('button-links') ?>
            </aside>
        <?php endif ?>
    </content-container>

    <?php if ($pageType === PageType::BlogPost && isset($mastolink)): ?>
        <?php Component::include('mastodon-comments', [ 'mastolink' => $mastolink ]) ?>
    <?php endif ?>

    <footer>
        <?php if ($pageType === PageType::PHP): ?>
            <?php Component::include('copyright', [ 'pagePath' => $pagePath, 'siteAuthor' => $site_author ]) ?>
        <?php else: ?>
            <?php Component::include('copyright', [ 'pageDate' => $modifiedOn ?: $createdOn, 'siteAuthor' => $site_author ]) ?>
        <?php endif ?>
        <br/>
        Made in PHP, HTML, CSS and JavaScript, with Visual Studio Code and PHP Intelephense.
    </footer>

    <?php Component::renderQueuedJS() ?>
</body>
<svg hidden xmlns="http://www.w3.org/2000/svg">
    <symbol id="svg-loading" viewBox="0 0 496 496" fill="currentColor">
        <path style="opacity: 1;" d="M295.2,147.1c-2.4,4.8-7.2,6.4-11.2,4.8l0,0c-4-1.6-6.4-6.4-4.8-11.2l52-126.4c1.6-4,6.4-6.4,11.2-4.8l0,0c4,1.6,6.4,6.4,4.8,11.2L295.2,147.1z"/>
        <path style="opacity: 0.94;" d="M326.4,172.7c-3.2,3.2-8.8,3.2-12,0l0,0c-3.2-3.2-3.2-8.8,0-12l96.8-96.8c3.2-3.2,8.8-3.2,12,0l0,0c3.2,3.2,3.2,8.8,0,12L326.4,172.7z"/>
        <path style="opacity: 0.88;" d="M345.6,207.1c-4,1.6-8.8,0-11.2-4.8l0,0c-1.6-4,0-9.6,4.8-11.2l126.4-52.8c4-1.6,9.6,0,11.2,4.8l0,0c1.6,4,0,9.6-4.8,11.2L345.6,207.1z"/>
        <path style="opacity: 0.82;" d="M496,239.9c0,4.8-3.2,8-8,8H352c-4.8,0-8-3.2-8-8l0,0c0-4.8,3.2-8,8-8h136C492.8,231.9,496,235.1,496,239.9L496,239.9z"/>
        <path style="opacity: 0.76;" d="M340,285.5c-4-1.6-6.4-6.4-4.8-11.2l0,0c1.6-4,6.4-6.4,11.2-4.8l126.4,52c4,1.6,6.4,6.4,4.8,11.2l0,0c-1.6,4-6.4,6.4-11.2,4.8L340,285.5z"/>
        <path style="opacity: 0.7;" d="M314.4,317.5c-3.2-3.2-3.2-8.8,0-12l0,0c3.2-3.2,8.8-3.2,12,0l96.8,96.8c3.2,3.2,3.2,8.8,0,12l0,0c-3.2,3.2-8.8,3.2-12,0L314.4,317.5z"/>
        <path style="opacity: 0.64;" d="M280,336.7c-1.6-4,0-8.8,4.8-11.2l0,0c4-1.6,9.6,0,11.2,4.8l52.8,126.4c1.6,4,0,9.6-4.8,11.2l0,0c-4,1.6-9.6,0-11.2-4.8L280,336.7z"/>
        <path style="opacity: 0.58;" d="M256,478.3c0,4.8-3.2,8.8-8,8.8l0,0c-4.8,0-8-4-8-8.8V341.5c0-4.8,3.2-8.8,8-8.8l0,0c4.8,0,8,4,8,8.8V478.3z"/>
        <path style="opacity: 0.52;" d="M164.8,463.9c-1.6,4-6.4,6.4-11.2,4.8l0,0c-4-1.6-6.4-6.4-4.8-11.2l52-126.4c1.6-4,6.4-6.4,11.2-4.8l0,0c4,1.6,6.4,6.4,4.8,11.2L164.8,463.9z"/>
        <path style="opacity: 0.46;" d="M84.8,414.3c-3.2,3.2-8.8,3.2-12,0l0,0c-3.2-3.2-3.2-8.8,0-12l96.8-96.8c3.2-3.2,8.8-3.2,12,0l0,0c3.2,3.2,3.2,8.8,0,12L84.8,414.3z"/>
        <path style="opacity: 0.4;" d="M30.4,339.1c-4,1.6-9.6,0-11.2-4.8l0,0c-1.6-4,0-9.6,4.8-11.2l126.4-52.8c4-1.6,8.8,0,11.2,4.8l0,0c1.6,4,0,9.6-4.8,11.2L30.4,339.1z"/>
        <path style="opacity: 0.34;" d="M152,239.9c0,4.8-3.2,8-8,8H8c-4.8,0-8-3.2-8-8l0,0c0-4.8,3.2-8,8-8h136C148.8,231.9,152,235.1,152,239.9L152,239.9z"/>
        <path style="opacity: 0.28;" d="M23.2,155.1c-4-1.6-6.4-6.4-4.8-11.2l0,0c1.6-4,6.4-6.4,11.2-4.8L156,191.9c4,1.6,6.4,6.4,4.8,11.2l0,0c-1.6,4-6.4,6.4-11.2,4.8L23.2,155.1z"/>
        <path style="opacity: 0.22;" d="M72.8,75.1c-3.2-3.2-3.2-8,0-11.2l0,0c3.2-3.2,8.8-3.2,12,0l96.8,96.8c3.2,3.2,3.2,8.8,0,12l0,0c-3.2,3.2-8.8,3.2-12,0L72.8,75.1z"/>
        <path style="opacity: 0.16;" d="M148,20.7c-1.6-4,0-9.6,4.8-11.2l0,0c4-1.6,9.6,0,11.2,4.8l52,126.4c1.6,4,0,9.6-4.8,11.2l0,0c-4,1.6-9.6,0-11.2-4.8L148,20.7z"/>
    </symbol>
</svg>
</html>