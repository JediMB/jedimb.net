<?php

namespace Page;

require_once 'services/navigation.service.php';
require_once 'services/page.service.php';

use Services\NavigationService;
use Services\PageService;
use Models\MenuItem;

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
        <p>
            <?php
            
            $menu = NavigationService::getInstance()->menu;

            function renderMenu(array $menu) {
                if (count($menu) > 0) {
                    echo '<ul style="padding-left: 10px;">';
                    foreach ($menu as $item) {
                        /** @var MenuItem $item */
                        
                        echo "<li>{$item->title} : {$item->path}";

                        if (count($item->children) > 0)
                            renderMenu($item->children);

                        echo "</li>";
                    }
                    echo '</ul>';
                }
            }

            renderMenu($menu);

            ?>
        </p>
    </main>
</page-content>