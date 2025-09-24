<?php declare(strict_types=1);

require_once 'services/navigation.service.php';
require_once 'utilities/component.utility.php';
require_once 'utilities/menu-link.utility.php';

use Models\MenuItem;
use Services\NavigationService;
use Utilities\Component;
use Utilities\MenuLink;

Component::renderCSS(__FILE__);

?>

<nav id="mobile-menu">
    <button id="mobile-menu-button" <?= MenuLink::onClick('openMobileMenu(event);') ?>>
        <svg width="4rem" height="4rem" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect id="svg-rect-top-blade" width="80" height="14" x="0" y="11" rx="8" fill="white" style="--animation: first-top-blade;" />
            <rect id="svg-rect-top-hilt" width="30" height="16" x="70" y="10" rx="2" fill="white" style="--animation: first-top-hilt;" />
            <rect id="svg-rect-mid-blade" width="80" height="14" x="20" y="43" rx="8" fill="white" style="--animation: first-mid-blade;" />
            <rect id="svg-rect-mid-hilt" width="30" height="16" x="0" y="42" rx="2" fill="white" style="--animation: first-mid-hilt;" />
            <rect id="svg-rect-low-blade" width="80" height="14" x="0" y="75" rx="8" fill="white" style="--animation: first-low-blade;" />
            <rect id="svg-rect-low-hilt" width="30" height="16" x="70" y="74" rx="2" fill="white" style="--animation: first-low-hilt;" />
            <rect id="svg-rect-frame" width="100" height="100" x="0" y="0" fill="transparent" />
        </svg>
    </button>
    
    <ul id="mobile-menu-contents" class="hidden">
        <li><a href="/">Home</a></li>
        <?php foreach (NavigationService::getInstance()->menu as $id => $item): ?>
            <?php /** @var MenuItem $item */ ?>
            <?php if (count($item->children) > 0): ?>
                <?php
                
                $submenuMarkup = '';
                foreach ($item->children as $subId => $subItem) {
                    /** @var MenuItem $subItem */
                    $submenuMarkup = $submenuMarkup . <<<HTML
                        <li>
                            <a href="{$subItem->path}">{$subItem->title}</a>
                        </li>
                    HTML;
                }
                
                // Can't remember what this is supposed to do.
                // Because the old code didn't check the array length?
                //if (strlen($submenuMarkup) < 10) continue;
                ?>
                <li>
                    <input id="mobile-menu-entry-$id" type="checkbox" class="hidden">
                    <label for="mobile-menu-entry-$id" tabindex="0" <?= MenuLink::onReturnKey('this.click();') ?>>
                        <?= $item->title ?>
                    </label>
                    <ul>
                        <?= $submenuMarkup ?>
                    </ul>
                </li>
            <?php else: ?>
                <li>
                    <a href="<?= $item->path ?>">
                        <?= $item->title ?>
                    </a>
                </li>
            <?php endif ?>
        <?php endforeach ?>
    </ul>
</nav>

<?php Component::renderJS(__FILE__) ?>