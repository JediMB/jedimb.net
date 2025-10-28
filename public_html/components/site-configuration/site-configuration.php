<?php declare(strict_types=1);

namespace Components;

require_once 'services/configuration.service.php';
require_once 'utilities/component.utility.php';

use Services\ConfigurationService;
use Utilities\Component;

Component::renderOnce(__FILE__);
Component::renderCSS(__FILE__);
Component::addJSModule(__FILE__);

$configService = ConfigurationService::getInstance(); /** @var ConfigurationService $configService */

?>

<form id="site-settings">
    <fieldset>
        <div class="category-head">
            <h3 style="margin: 0;"><?= PAGE_ADMIN_SECTION_SITE ?></h3>
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

<svg class="hidden" xmlns="http://www.w3.org/2000/svg">
    <symbol id="svg-config-restore" viewBox="0 -960 960 960" fill="currentColor"><path d="M480-120q-138 0-240.5-91.5T122-440h82q14 104 92.5 172T480-200q117 0 198.5-81.5T760-480q0-117-81.5-198.5T480-760q-69 0-129 32t-101 88h110v80H120v-240h80v94q51-64 124.5-99T480-840q75 0 140.5 28.5t114 77q48.5 48.5 77 114T840-480q0 75-28.5 140.5t-77 114q-48.5 48.5-114 77T480-120Zm112-192L440-464v-216h80v184l128 128-56 56Z"/></symbol>
    <symbol id="svg-config-delete" viewBox="0 -960 960 960" fill="currentColor"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></symbol>
    <symbol id="svg-config-add" viewBox="0 -960 960 960" fill="currentColor"><path d="M440-280h80v-160h160v-80H520v-160h-80v160H280v80h160v160ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z"/></symbol>
</svg>