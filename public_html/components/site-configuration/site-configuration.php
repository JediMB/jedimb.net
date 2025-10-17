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

    <?php Component::include('site-configuration/config-field', [
        'id' => 'site-title', 'label' => 'Title',
        'input' => $configService->getUserConstant('SITE_TITLE', true)
    ]) ?>
    <?php Component::include('site-configuration/config-field', [
        'id' => 'site-tagline', 'label' => 'Tagline',
        'input' => $configService->getUserConstant('SITE_TAGLINE', true)
    ]) ?>
    <?php Component::include('site-configuration/config-field', [
        'id' => 'site-author', 'label' => 'Author',
        'input' => $configService->getUserConstant('SITE_AUTHOR')
    ]) ?>
    <?php Component::include('site-configuration/config-field', [
        'id' => 'meta-description', 'label' => 'Meta Description',
        'input' => $configService->getUserConstant('META_DESCRIPTION')
    ]) ?>
    <?php Component::include('site-configuration/config-field', [
        'id' => 'meta-keywords', 'label' => 'Meta Keywords',
        'input' => $configService->getUserConstant('META_KEYWORDS')
    ]) ?>
</form>