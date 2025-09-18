<?php

namespace Page;

require_once 'services/page.service.php';

use Services\NavigationService;
use Services\PageService;

$nav = NavigationService::getInstance();
/** @var NavigationService $nav */
$service = PageService::getInstance();
/** @var PageService $service */

$page = $service->getPage($nav->pageId);

if (!$page) {
    include 'errors/404.php';
    return;
}

$nav->setPageTitle($page->title);

?>

<page-content>
    <main>
        <h2><?= $page->header ?? $page->title ?></h2>
        <?= $page->content ?>
    </main>
</page-content>