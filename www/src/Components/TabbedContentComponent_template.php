<?php declare(strict_types=1);

use App\Components\TabbedContentComponent;

/** @var TabbedContentComponent $data */

?>

<tabbed-content-component>
    <ul role="tablist"
        class="tablist"
        tabindex="-1"
        >
        <?php foreach ($data->tabs as $tab): ?>
            <li>
                <button type="button"
                    role="tab"
                    class="tab <?= $tab->active ? 'active' : null ?>"
                    aria-selected="<?= $tab->active ? 'true' : 'false' ?>"
                    aria-controls="<?= "{$tab->id}-{$data->uid}" ?>"
                    >
                    <?= $tab->title ?>
                </button>
            </li>
        <?php endforeach ?>
    </ul>

    <div>
        <?php foreach ($data->tabs as $tab): ?>
            <div role="tabpanel"
                id="<?= "{$tab->id}-{$data->uid}" ?>"
                aria-expanded="<?= $tab->active ? 'true' : 'false' ?>"
                <?= $tab->active ? null : 'hidden' ?>
                >
                <?= $tab->content ?>
            </div>
        <?php endforeach ?>
    </div>
</tabbed-content-component>
