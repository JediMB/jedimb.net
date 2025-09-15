<?php

namespace Page;

require_once 'includes/services/page.service.php';

use Configuration;
use Models\PagePath;
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
        <p>
            <?php

            $paths = $service->getPagePaths();
            
            foreach ($paths as $path) {
                /** @var PagePath $path */

                $fullPath = $path->pathPart;

                while ($path->parentId) {
                    $path = $paths[$path->parentId];
                    /** @var PagePath $path */
                    $fullPath = $path->pathPart . DIRECTORY_SEPARATOR . $fullPath;
                }

                echo $fullPath;
                echo '<br/>';
            }
            
            ?>
        </p>
    </main>
</page-content>