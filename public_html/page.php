<?php

namespace Page;

require_once 'services/page.service.php';

use Configuration;
use Models\PagePath;
use Services\PageService;

$config = Configuration::getInstance();
/** @var Configuration $config */
$service = PageService::getInstance();
/** @var PageService $service */

$page = $service->getPage($config->pageId);

if (!$page) {
    include 'errors/404.php';
    return;
}

$config->setPageTitle($page->title);

?>

<page-content>
    <main>
        <h2><?= $page->header ?? $page->title ?></h2>
        <?= $page->content ?>
    </main>
</page-content>