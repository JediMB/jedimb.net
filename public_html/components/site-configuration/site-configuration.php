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

<form id="site-settings" style="display: flex; flex-direction: column; gap: 1em;">
    <div style="display: flex; flex-direction: row; gap: 1em; align-items: center; justify-content: space-between;">
        <h3 style="margin: 0;"><?= PAGE_ADMIN_SECTION_SITE ?></h3>
        <input type="button" class="btn" value="Save">
    </div>

    <?php $constants = [
        'SITE_TITLE', 'SITE_TAGLINE', 'SITE_AUTHOR',
        'META_DESCRIPTION', 'META_KEYWORDS'
    ] ?>

    <?php foreach ($constants as $constant): ?>
        <?php
        $id = strtolower(str_replace('_', '-', $constant));
        $label =  ucwords(str_replace('-', ' ', $id));

        Component::include('site-configuration/config-field', [
            'id' => $id, 'label' => $label,
            'input' => $configService->getUserConstant($constant, true)
        ]);
        ?>
    <?php endforeach ?>
</form>