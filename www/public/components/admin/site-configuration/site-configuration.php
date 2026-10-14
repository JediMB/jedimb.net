<?php declare(strict_types=1);

namespace Components;

use App\Components\Admin\ConfigFieldComponent;
use App\Services\ConfigurationService;
use App\Utils\Component;

Component::renderOnce();
Component::renderCSS();

$configService = ConfigurationService::getInstance(); /** @var ConfigurationService $configService */

?>

<form id="site-settings">
    <fieldset>
        <div class="category-head">
            <h3 class="h3" style="margin: 0;"><?= PAGE_ADMIN_SECTION_SITE ?></h3>
            <button type="submit" class="btn" disabled>Save</button>
        </div>

        <svg is-loading width="2em" height="2em">
            <use xlink:href="#svg-loading" href="#svg-loading"></use>
        </svg>

        <?php
        foreach (ConfigurationService::$CONFIGURABLE_CONSTANTS as $constantName => $_) {
            $label =  ucwords(strtolower(str_replace('_', ' ', $constantName)));

            new ConfigFieldComponent($label, $constantName);
        } 
        ?>
    </fieldset>
</form>