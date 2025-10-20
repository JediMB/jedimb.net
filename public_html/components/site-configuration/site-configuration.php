<?php declare(strict_types=1);

namespace Components;

require_once 'services/configuration.service.php';
require_once 'utilities/component.utility.php';

use Services\ConfigurationService;
use Utilities\Component;

Component::renderCSS(__FILE__);
Component::queueJS(__FILE__);

$configService = ConfigurationService::getInstance(); /** @var ConfigurationService $configService */

?>

<form id="site-settings">
    <div class="category-head">
        <h3 style="margin: 0;"><?= PAGE_ADMIN_SECTION_SITE ?></h3>
        <input type="button" class="btn" value="Save">
    </div>

    <?php foreach (CONFIGURABLE_CONSTANTS as $constant): ?>
        <?php
        $id = strtolower(str_replace('_', '-', $constant));
        $label =  ucwords(str_replace('-', ' ', $id));

        Component::include('site-configuration/config-field', [
            'id' => $id, 'label' => $label, 'constant' => $constant,
            'input' => $configService->getUserConstant($constant, true)
        ]);
        ?>
    <?php endforeach ?>
</form>