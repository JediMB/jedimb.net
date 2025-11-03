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

    <title><?= empty($title) ? $site_title : "$title – ". $site_title ?></title>
    
    <?php Component::include('css-revision-link', [ 'cssPath' => PATH_CSS_DEFAULT ]) ?>

    <link rel="icon" type="image/x-icon" href="/favicon.svg" />
    
    <script type="text/javascript" src="/js/purify.min.js"></script>
    <?php if ($pageType === PageType::BlogPost): ?>
        <script type="text/javascript" defer src="/js/local-time.js"></script>
    <?php endif ?>

    <meta name="cookie-user-key" content="<?= COOKIE_USER_KEY ?>">
    <meta name="cookie-token-key" content="<?= COOKIE_TOKEN_KEY ?>">
    <meta name="cookie-validator-key" content="<?= COOKIE_VALIDATOR_KEY ?>">
    <meta>
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
</body>
</html>