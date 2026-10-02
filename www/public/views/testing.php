<?php declare(strict_types=1);

namespace Views;

use App\Components\ContentTimestampsComponent;
use App\Enums\PageType;
use App\Services\ConfigurationService;
use App\Utils\Asset;
use App\Utils\Component;

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
    
    <link href="<?= Asset::addRevisionQuery(PATH_CSS_DEFAULT) ?>" rel="stylesheet" />

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
                <div><?php new ContentTimestampsComponent($createdOn, $modifiedOn) ?></div>
            <?php endif ?>
            <div><?= $content ?></div>
        </main>
    </content-container>
    
    <?php include "../templates/svg-library.php" ?>
</body>
</html>