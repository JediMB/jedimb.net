<?php declare(strict_types=1);

namespace Components;

use Services\NavigationService;
use Utils\Component;
use Utils\MenuLink;

Component::renderCSS();
Component::queueJS(__FILE__);

?>

<nav id="sub-menu" class="p-4">
    <?php foreach (NavigationService::getInstance()->menu as $id => $item): /** @var MenuItem $item */ ?>
        <?php
        
        if (count($item->children) < 1)
            continue;
        
        $delayMultiplier = 0;

        ?>
        <ul id="submenu-<?= $id ?>" class="list-cards hidden"> <!-- hidden -->
            <?php foreach ($item->children as $subId => $subItem): /** @var MenuItem $subItem */ ?>
                <?php
                
                $animationDelay = ($delayMultiplier * 200) . 'ms';
                $delayMultiplier++;
                
                ?>
                <li class="card" style="--animation-delay: <?= $animationDelay ?>;">
                    <a tabindex="0" class="card-inner" <?= MenuLink::onClick($subItem->path, true) ?>>
                        <div class="card-front">
                            <?= $subItem->title ?>
                        </div>
                        <?php if ($subItem->description): ?>
                            <div class="card-back"><?= $subItem->description ?></div>
                        <?php endif ?>
                    </a>
                </li>
            <?php endforeach ?>
        </ul>
    <?php endforeach ?>
</nav>