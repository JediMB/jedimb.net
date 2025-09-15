<?php

namespace Page;

require_once 'includes/services/page.service.php';

use Configuration;
use Services\PageService;

$service = PageService::getInstance();
/** @var PageService $service */

$page = $service->getPage(1);

if (!$page) {
    include 'includes/errors/404.php';
    return;
}

Configuration::getInstance()->setPageTitle($page->title);

?>

<page-content>
    <main>
        <h2><?= $page->header ?? $page->title ?></h2>
        <p>
            <?= $page->content ?>
        </p>
    </main>
</page-content>