<?php declare(strict_types=1);

require_once 'services/navigation.service.php';
require_once 'utilities/component.utility.php';
require_once 'utilities/menu-link.utility.php';

use Models\MenuItem;
use Services\NavigationService;
use Utilities\Component;
use Utilities\MenuLink;

Component::renderCSS(__FILE__);
Component::queueJS(__FILE__);

?>

<nav id="sub-menu" class="p-4">
    <?php foreach (NavigationService::getInstance()->menu as $id => $item): ?>
        <?php
        /** @var MenuItem $item */
        if (count($item->children) < 1)
            continue;
        $delayMultiplier = 0;
        ?>
        <ul id="submenu-<?= $id ?>" class="list-cards hidden"> <!-- hidden -->
            <?php foreach ($item->children as $subId => $subItem): ?>
                <?php
                /** @var MenuItem $subItem */
                $animationDelay = ($delayMultiplier * 200) . 'ms';
                $delayMultiplier++;
                ?>
                <li class="card" style="--animation-delay: <?= $animationDelay ?>;">
                    <a tabindex="0" class="card-inner" <?= MenuLink::onClick($subItem->path, true) ?>>
                        <div class="card-front">
                            <?= $subItem->title ?>
                        </div>
                        <?php
                        // if (isset($submenuItem['description'])) {

                        //     echo <<<HTML
                        //         <div class="card-back">{$submenuItem['description']}</div>
                        //     HTML;
                        // }
                        ?>
                    </a>
                </li>
            <?php endforeach ?>
        </ul>
    <?php endforeach ?>
</nav>