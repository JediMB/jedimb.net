<?php declare(strict_types=1);

namespace Views;

use App\Components\ContentTimestampsComponent;
use App\Enums\PageType;
use App\Models\App\Page;
use App\Services\ConfigurationService;
use App\Utils\Asset;

/** @var Page $page */

$config = ConfigurationService::getInstance(); /** @var ConfigurationService $config */

list(
    $siteTitle, $siteTagline, $siteAuthor, $metaDescription, $metaKeywords) =
    $config->getUserConstants([
        'SITE_TITLE', 'SITE_TAGLINE', 'SITE_AUTHOR', 'META_DESCRIPTION', 'META_KEYWORDS'
]);

$links = !empty($links);

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <meta name="author" content="<?= $siteAuthor ?>">
    <meta name="description" content="<?= $metaDescription ?>">
    <meta name="keywords" content="<?= $metaKeywords ?>">

    <meta name="constants" content="<?= htmlspecialchars(json_encode(META_CONSTANTS)) ?>">

    <title>
        <?= $page->title
            ? "{$page->title} &ndash; ". $siteTitle
            : $siteTitle
        ?>
    </title>
    
    <link href="<?= Asset::addRevisionQuery(PATH_CSS_DEFAULT) ?>" rel="stylesheet" />

    <link rel="icon" type="image/x-icon" href="/favicon.svg" />
    
    <script type="text/javascript" src="/js/purify.min.js"></script>
    <script type="module" src="/js/default.js"></script>
</head>
<body>
    <content-container class="mb-3 <?= $links ? 'grid-cols-sidebar-right' : null ?>">
        <main>
            <?php if ($page->title): ?>
                <h2><?= $page->title ?></h2>
            <?php endif ?>
            <?php if ($page->pageType === PageType::BlogPost): ?>
                <div><?php new ContentTimestampsComponent($page->createdOn, $page->modifiedOn) ?></div>
            <?php endif ?>
            <div><?= $page->content ?></div>
        </main>
    </content-container>
    
    <?php include "../templates/svg-library.php" ?>
</body>
</html>