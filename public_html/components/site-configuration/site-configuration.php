<?php declare(strict_types=1);

namespace Components;

require_once 'services/configuration.service.php';
require_once 'utilities/component.utility.php';

use Services\ConfigurationService;
use Utilities\Component;

Component::renderCSS(__FILE__);
Component::addJSModule(__FILE__);

$configService = ConfigurationService::getInstance(); /** @var ConfigurationService $configService */

?>

<form id="site-settings">
    <div class="category-head">
        <h3 style="margin: 0;"><?= PAGE_ADMIN_SECTION_SITE ?></h3>
        <button type="submit" class="btn">Save</button>
    </div>

    <?php foreach (CONFIGURABLE_CONSTANTS as $constantName): ?>
        <?php
        $id = strtolower(str_replace('_', '-', $constantName));
        $label =  ucwords(str_replace('-', ' ', $id));

        Component::include('site-configuration/config-field', [
            'id' => $id, 'label' => $label, 'name' => $constantName
        ] + $configService->getConfiguration($constantName));
        ?>
    <?php endforeach ?>
</form>