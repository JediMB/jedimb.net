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
    </content-container>
    
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
</body>
</html>