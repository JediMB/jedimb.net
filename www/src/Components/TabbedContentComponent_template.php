<?php declare(strict_types=1);

use App\Components\TabbedContentComponent;

/** @var TabbedContentComponent $data */

?>

<tabbed-content-component>
    <ul role="tablist"
        tabindex="-1"
        class="flex-row"
        >
        <?php foreach ($data->tabs as $tab): ?>
            <li>
                <label for="<?= "tab-{$tab->id}-{$data->uid}" ?>"
                    role="tab"
                    aria-selected="<?= $tab->active ? 'true' : 'false' ?>"
                    aria-controls="<?= "{$tab->id}-{$data->uid}" ?>"
                    tabindex="0"
                    >
                    <input
                        hidden
                        type="radio"
                        id="<?= "tab-{$tab->id}-{$data->uid}" ?>"
                        name="<?= "tabs-{$data->uid}" ?>"
                        >
                    <?= $tab->title ?>
                </label>
            </li>
        <?php endforeach ?>
    </ul>

    <div>
        <?php foreach ($data->tabs as $tab): ?>
            <div role="tabpanel"
                id="<?= "{$tab->id}-{$data->uid}" ?>"
                aria-expanded="<?= $tab->active ? 'true' : 'false' ?>"
                <?= $tab->active ? null : 'hidden' ?>"
                >
                <?= $tab->content ?>
            </div>
        <?php endforeach ?>
    </div>
</tabbed-content-component>
