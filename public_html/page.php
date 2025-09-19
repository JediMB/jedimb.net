<?php

namespace Page;

require_once 'services/page.service.php';

use Services\PageService;

$service = PageService::getInstance();
/** @var PageService $service */

$page = $service->getPage($service->id);

if (!$page) {
    include 'errors/404.php';
    return;
}

$service->setTitle($page->pageTitle);

?>

<page-content>
    <main>
        <h2><?= $page->header ?? $page->pageTitle ?></h2>
        <?= $page->content ?>
    </main>
</page-content>