<?php declare(strict_types=1);

namespace Components;

require_once 'utilities/component.utility.php';

use Exception;
use Utilities\Component;

/** @var string $containerId */
/** @var (array<int, array{title: string, targetId: string, active?: string}>) $tabs */

if (empty($containerId) || !is_string($containerId))
    throw new Exception('Tabs component requires a containerId string variable');
$tabs ??= [];

Component::addAttributes(['container-target' => "#$containerId"]);

Component::renderCSS();
Component::addJSModule();

?>

<ul class="tabs__list">
    <?php foreach ($tabs as $tab): ?>
        <li>
            <button
                class="tabs__button"
                tab-target="#<?= $tab['targetId'] ?>"
                <?= isset($tab['active']) ? 'disabled' : null ?>
                >
                <?= $tab['title'] ?>
            </button>
        </li>
    <?php endforeach ?>
</ul>