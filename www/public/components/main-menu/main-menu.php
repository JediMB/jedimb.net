<?php declare(strict_types=1);

namespace Components;

use Services\NavigationService;
use Utils\Component;
use Utils\MenuLink;

Component::renderCSS();

?>

<nav id="main-menu">
    <ul class="flex gap-2 flex-wrap justify-end">
        <?php foreach (NavigationService::getInstance()->menu as $id => $item): /** @var MenuItem $item */ ?>
            <li>
                <a id="menu-button-<?= $id ?>"
                    tabindex="0"
                    class="btn btn-menu"
                    <?php if (count($item->children) > 0): ?>
                        <?php $jsFunction = "toggleSubMenu($id, this)" ?>
                        <?= MenuLink::onClick($jsFunction) ?>
                        <?= MenuLink::onReturnKey($jsFunction) ?>
                    <?php else: ?>
                        <?= MenuLink::onClick($item->path, true) ?>
                    <?php endif ?>    
                ><?= $item->title ?></a>
            </li>
        <?php endforeach ?>
    </ul>
</nav>