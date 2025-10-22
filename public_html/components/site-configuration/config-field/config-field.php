<?php declare(strict_types=1);

namespace Components;

require_once 'utilities/component.utility.php';

use Exception;
use Utilities\Component;

$missingArgs = [];
if (empty($id)) $missingArgs[] = 'id';
if (empty($label)) $missingArgs[] = 'label';
if (empty($name)) $missingArgs = 'name';
if (empty($default)) $missingArgs = 'default';

if (!empty($missingArgs)) {
    $missingArgs = implode(', ', $missingArgs);
    throw new Exception("Config Field component missing variables: $missingArgs");
}

if (empty($config)) {
    $dbId = 0;
    $value = $default;
    $isDefault = true;
}
else { /** @var \Models\DB\Configuration $config */
    $dbId = $config->id;
    $value = $config->value;
    $isDefault = !$config->isActive;
}

Component::renderCSS(__FILE__);
Component::addJSModule(__FILE__);

?>

<input type="hidden" name="<?= $id ?>-id" id="<?= $id ?>-id" value="<?= $dbId ?>">
<input type="hidden" name="<?= $id ?>-constant" id="<?= $id ?>-constant" value="<?= $name ?>">
<input type="hidden" name="<?= $id ?>-default" id="<?= $id ?>-default" value="<?= $default ?>">
<input type="hidden" name="<?= $id ?>-value" id="<?= $id ?>-value" value="<?= $value ?>">
<input type="hidden" name="<?= $id ?>-unchanged-value" id="<?= $id ?>-unchanged-value" value="<?= $value ?>">
<input type="hidden" name="<?= $id ?>-was-default" id="<?= $id ?>-was-default" value="<?= $isDefault ?>">
<label for="<?= $id ?>"><?= $label ?></label>
<input type="text" name="<?= $id ?>" id="<?= $id ?>" placeholder="<?= $label ?>"
    value="<?= $value ?>" <?= $isDefault ? 'disabled' : null ?>>
<div input-errors></div>
<label>
    <input type="checkbox" name="<?= $id ?>-is-default" id="<?= $id ?>-is-default"
        <?= $isDefault ? 'checked' : null ?>>
    <?= PAGE_ADMIN_USEDEFAULT ?>
</label>