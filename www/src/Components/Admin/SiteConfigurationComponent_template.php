<?php declare(strict_types=1);

use App\Components\Admin\ConfigFieldComponent;
use App\Components\Admin\SiteConfigurationComponent;

/** @var SiteConfigurationComponent $data */

?>

<site-configuration-component id="<?= $data->attributeId ?>">
    <form autocomplete="off">
        <fieldset class="flex-col gap-ml">
            <div class="flex-row justify-between">
                <h3 class="h3">Site settings</h3>
                <button btn-save-all
                    type="submit"
                    class="btn-primary btn-safe"
                    disabled
                    >
                    Save all changes
                </button>
            </div>

            <?php
            foreach ($data->constants as $constant) {
                new ConfigFieldComponent($constant['label'], $constant['name']);
            }
            ?>
        </fieldset>
    </form>
</site-configuration-component>
