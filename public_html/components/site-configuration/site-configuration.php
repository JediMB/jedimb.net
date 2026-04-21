<?php declare(strict_types=1);

namespace Components;

require_once 'services/configuration.service.php';
require_once 'utilities/component.utility.php';

use Services\ConfigurationService;
use Utilities\Component;

Component::renderOnce();
Component::renderCSS();
Component::addJSModule();

$configService = ConfigurationService::getInstance(); /** @var ConfigurationService $configService */

?>

<form id="site-settings">
    <fieldset>
        <div class="category-head">
            <h3 class="h3" style="margin: 0;"><?= PAGE_ADMIN_SECTION_SITE ?></h3>
            <button type="submit" class="btn" disabled>Save</button>
        </div>

        <?php foreach (CONFIGURABLE_CONSTANTS as $constantName): ?>
            <?php
            $id = strtolower(str_replace('_', '-', $constantName));
            $label =  ucwords(str_replace('-', ' ', $id));

            if ($constantName === 'META_KEYWORDS')
                Component::include('site-configuration/config-csv', [
                    'id' => $id, 'label' => $label, 'name' => $constantName
                ] + $configService->getConfiguration($constantName));
            else
                Component::include('site-configuration/config-field', [
                    'id' => $id, 'label' => $label, 'name' => $constantName
                ] + $configService->getConfiguration($constantName));
            ?>
        <?php endforeach ?>
    </fieldset>
</form>