<?php declare(strict_types=1);

use App\Components\PageStatsComponent;

/** @var PageStatsComponent $data */

?>

<page-stats-component>
    Showing <?= $data->collectionType ?>
    <items-start><?= $data->itemFirst ?></items-start>&ndash;<items-end><?= $data->itemLast ?></items-end>
    (of <items-total><?= $data->itemsTotal ?></items-total>)
</page-stats-component>
